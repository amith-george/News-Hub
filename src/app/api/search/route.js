import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const country = searchParams.get('country');
  const language = searchParams.get('language') || 'en';
  const page = searchParams.get('page'); // page token string, can be null
  const pageSize = 9;

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  const apiKey = process.env.NEWS_DATA_APIKEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const baseUrl = 'https://newsdata.io/api/1/news';

  const url = new URL(baseUrl);
  url.searchParams.set('apikey', apiKey);
  url.searchParams.set('q', query);
  url.searchParams.set('language', language);
  url.searchParams.set('size', pageSize);

  if (country) {
    url.searchParams.set('country', country);
  }

  if (page) {
    url.searchParams.set('page', page);
  }

  console.log('Fetching search from:', url.href);

  try {
    const response = await fetch(url.href);
    const data = await response.json();

    if (!response.ok) {
      console.error('Search API error response:', data);
      return NextResponse.json({ error: data?.message || 'Failed to search news' }, { status: response.status });
    }

    return NextResponse.json({
      ...data,
      currentPageToken: page ?? null,
      nextPageToken: data.nextPage ?? null,
      pageSize,
      totalResults: data.totalResults ?? null,
      totalPages: data.totalPages ?? null,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 });
  }
}
