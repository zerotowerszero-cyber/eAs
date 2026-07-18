import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB_API_KEY is not configured in .env.local' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  
  if (!type || !id || (type !== 'movie' && type !== 'tv')) {
    return NextResponse.json({ error: 'Invalid type or id' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      if (response.status === 404) {
         return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      throw new Error(`TMDB API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('TMDB Details Error:', error);
    return NextResponse.json({ error: 'Failed to fetch details from TMDB' }, { status: 500 });
  }
}
