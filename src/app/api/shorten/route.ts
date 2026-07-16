import { NextResponse } from 'next/server';
import { saveUrl, getUrl } from '@/lib/db';

// Generate a random 4-character alphanumeric string
function generateCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json(
        { error: 'Invalid URL provided. Must start with http:// or https://' },
        { status: 400 }
      );
    }

    // Try generating a unique code (up to 5 attempts to avoid collision)
    let code = '';
    let isUnique = false;
    
    for (let i = 0; i < 5; i++) {
      code = generateCode();
      const existing = await getUrl(code);
      if (!existing) {
        isUnique = true;
        break;
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate a unique code. Please try again.' },
        { status: 500 }
      );
    }

    // Save the mapping
    await saveUrl(code, url);

    // Return the generated code
    return NextResponse.json({ code, originalUrl: url });
  } catch (error) {
    console.error('Error shortening URL:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
