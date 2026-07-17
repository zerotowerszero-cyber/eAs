import { NextResponse } from 'next/server';
import { getNotepad, setNotepad } from '@/lib/db';

export async function GET() {
  try {
    const content = await getNotepad();
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching notepad:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notepad.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { content, password } = await request.json();

    if (password !== 'notepad1234') {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid content.' },
        { status: 400 }
      );
    }

    await setNotepad(content);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving notepad:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
