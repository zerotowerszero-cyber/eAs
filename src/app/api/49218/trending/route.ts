import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET() {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB_API_KEY is not configured in .env.local' }, { status: 500 });
  }

  try {
    // Fetch 5 pages (20 items each = 100 total) of trending movies and tv shows
    const pagesToFetch = [1, 2, 3, 4, 5];
    
    const fetchPromises = pagesToFetch.map(page => 
      fetch(`${TMDB_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`, { 
        next: { revalidate: 3600 } // Cache for 1 hour
      }).then(res => res.json())
    );

    const results = await Promise.all(fetchPromises);
    
    let allTrending: any[] = [];
    results.forEach(data => {
      if (data && data.results) {
        allTrending = [...allTrending, ...data.results];
      }
    });
    
    // Remove duplicates based on item.id
    const uniqueMap = new Map();
    allTrending.forEach((item: any) => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });
    
    // Filter out people, keep only movies and tv
    const finalResults = Array.from(uniqueMap.values())
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .slice(0, 100); // Ensure exactly 100 (or less if not enough)

    return NextResponse.json({ results: finalResults });
  } catch (error) {
    console.error('TMDB Trending Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trending media' }, { status: 500 });
  }
}
