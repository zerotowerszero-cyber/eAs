import { NextResponse } from 'next/server';
import { getUrl } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  // Await the params object in Next.js 15+ per new App Router async conventions
  const { code } = await params;

  try {
    const originalUrl = await getUrl(code);

    if (originalUrl) {
      // 302 Redirect to the original URL
      return NextResponse.redirect(originalUrl, 302);
    } else {
      // Code not found, redirect to homepage or a 404 page
      const baseUrl = new URL(request.url).origin;
      return NextResponse.redirect(`${baseUrl}/?error=not-found`, 302);
    }
  } catch (error) {
    console.error('Error in URL redirect:', error);
    const baseUrl = new URL(request.url).origin;
    return NextResponse.redirect(baseUrl, 302);
  }
}
