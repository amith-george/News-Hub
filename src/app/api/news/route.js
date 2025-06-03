import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get('country');
  const category = searchParams.get('category');
  // Accept page as string token, default to undefined (first page)
  const page = searchParams.get('page'); // keep as string or null
  const pageSize = 9;

  if (!country) {
    return NextResponse.json({ error: 'Missing country code' }, { status: 400 });
  }

  const apiKey = process.env.NEWS_DATA_APIKEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const baseUrl = 'https://newsdata.io/api/1/latest';

  const url = new URL(baseUrl);
  url.searchParams.set('apikey', apiKey);
  url.searchParams.set('country', country.toLowerCase());
  url.searchParams.set('language', 'en');
  url.searchParams.set('size', pageSize);

  if (category) {
    url.searchParams.set('category', category);
  }

  // If page token is present, add it to the request
  if (page) {
    url.searchParams.set('page', page);
  }

  console.log('Fetching news from:', url.href);

  try {
    const response = await fetch(url.href);
    const data = await response.json();

    if (!response.ok) {
      console.error('News API error response:', data);
      return NextResponse.json({ error: data?.message || 'Failed to fetch news' }, { status: response.status });
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
