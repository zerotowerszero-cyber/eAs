import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // We expect messages to be in the format: { role: 'user' | 'model', parts: [{ text: string } | { inlineData: { mimeType, data } }] }
    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid request", { status: 400 });
    }

    const apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3
    ].filter(Boolean) as string[];

    if (apiKeys.length === 0) {
      return new Response(JSON.stringify({ error: "No API keys configured." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    let responseStream: any = null;
    let lastError: any = null;

    // Try keys sequentially until one succeeds
    for (let i = 0; i < apiKeys.length; i++) {
      try {
        const ai = new GoogleGenAI({ apiKey: apiKeys[i] });
        
        responseStream = await ai.models.generateContentStream({
          model: 'gemini-3.5-flash',
          contents: messages,
          config: {
            temperature: 0.7,
          }
        });
        
        // Success - clear error and break out of loop
        lastError = null;
        break;
      } catch (error: any) {
        console.warn(`API Key ${i + 1} failed:`, error.message);
        lastError = error;
      }
    }

    if (lastError) {
      throw new Error(`All configured API keys failed. Last error: ${lastError.message}`);
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
