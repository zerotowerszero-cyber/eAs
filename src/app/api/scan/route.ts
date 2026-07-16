import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'VirusTotal API key is not configured' }, { status: 500 });
    }

    // VirusTotal requires the URL to be Base64url encoded without padding
    const encodedUrl = Buffer.from(url).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
    // First, try to fetch the existing report for this URL to make it instant
    const response = await fetch(`https://www.virustotal.com/api/v3/urls/${encodedUrl}`, {
      method: 'GET',
      headers: {
        'x-apikey': apiKey,
        'accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        stats: data.data.attributes.last_analysis_stats,
        lastAnalysisDate: data.data.attributes.last_analysis_date
      }, { status: 200 });
    } else if (response.status === 404) {
      // URL has not been scanned before, submit it for scanning
      const submitResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
        method: 'POST',
        headers: {
          'x-apikey': apiKey,
          'accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ url })
      });
      
      if (submitResponse.ok) {
        // Since scanning takes time, we'll return a status indicating it's processing
        return NextResponse.json({ 
          status: 'processing',
          message: 'URL submitted for scanning. Please try again in a few moments.'
        }, { status: 202 });
      } else {
        const errorData = await submitResponse.json();
        console.error('VirusTotal submission error:', errorData);
        return NextResponse.json({ error: 'Failed to submit URL to VirusTotal' }, { status: 500 });
      }
    } else {
      const errorData = await response.json();
      console.error('VirusTotal fetch error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch data from VirusTotal' }, { status: response.status });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
