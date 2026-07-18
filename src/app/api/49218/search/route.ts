import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB_API_KEY is not configured in .env.local' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`TMDB API returned ${response.status}`);
    }

    const data = await response.json();
    
    // Filter to only include movies and tv shows (exclude people)
    const results = data.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('TMDB Search Error:', error);
    return NextResponse.json({ error: 'Failed to search TMDB' }, { status: 500 });
  }
}
