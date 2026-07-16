import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.DISCORD_TOKEN;
  const applicationId = process.env.DISCORD_APPLICATION_ID;

  if (!token || !applicationId) {
    return NextResponse.json(
      { error: 'Missing DISCORD_TOKEN or DISCORD_APPLICATION_ID in environment variables.' },
      { status: 500 }
    );
  }

  const commands = [
    {
      name: 'generate-code',
      description: 'Generate a secure 10-digit code and invite link',
      type: 1, // CHAT_INPUT (slash command)
    }
  ];

  try {
    const response = await fetch(
      `https://discord.com/api/v10/applications/${applicationId}/commands`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${token}`,
        },
        body: JSON.stringify(commands),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Failed to register commands: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, commands: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
