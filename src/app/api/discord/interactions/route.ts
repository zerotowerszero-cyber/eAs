import { NextRequest, NextResponse } from 'next/server';
import { verifyKey } from 'discord-interactions';
import { createInvite } from '@/lib/db';
import crypto from 'crypto';

// Verify the incoming request is actually from Discord
function verifySignature(req: NextRequest, body: string): boolean {
  const signature = req.headers.get('x-signature-ed25519');
  const timestamp = req.headers.get('x-signature-timestamp');
  const publicKey = process.env.DISCORD_PUBLIC_KEY;

  if (!signature || !timestamp || !publicKey) {
    return false;
  }

  try {
    return verifyKey(body, signature, timestamp, publicKey);
  } catch (_) {
    return false;
  }
}

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    
    if (!verifySignature(req, rawBody)) {
      return NextResponse.json({ error: 'Invalid request signature' }, { status: 401 });
    }

    const interaction = JSON.parse(rawBody);

    // Type 1 is a PING request to verify the endpoint during setup
    if (interaction.type === 1) {
      return NextResponse.json({ type: 1 });
    }

    // Type 2 is a Slash Command
    if (interaction.type === 2) {
      const { data, member, user } = interaction;
      const commandName = data.name;

      // Extract user ID (can be in member.user or user depending on if it's sent in a guild or DM)
      const userId = member?.user?.id || user?.id;

      if (commandName === 'generate-code') {
        if (userId !== '847175065027608646') {
          return NextResponse.json({
            type: 4,
            data: {
              content: 'You are not authorized to use this command.',
              flags: 64 // Ephemeral (only visible to the user)
            }
          });
        }

        // Generate the codes
        const inviteToken = generateRandomString(20);
        const authCode = generateRandomString(10);
        
        // Save them to the database
        await createInvite(inviteToken, authCode);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eas.cx';
        const inviteLink = `${baseUrl}/auth/${inviteToken}`;

        const msg = `Your generated access link:\n${inviteLink}\n\nWhen visited, the user's IP will be permanently bound to this 10-digit code:\n${authCode}\n\nEnsure the user visits the link from the exact device and network they intend to use.`;

        // Respond to the interaction ephemerally
        return NextResponse.json({
          type: 4,
          data: {
            content: msg,
            flags: 64 // Ephemeral flag (64)
          }
        });
      }
    }

    return NextResponse.json({ error: 'Unknown interaction type' }, { status: 400 });
  } catch (err) {
    console.error("Discord interaction error:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
