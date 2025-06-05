'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Newscard from '@/components/NewsCard';
import { useCountry } from '@/context/CountryContext';
import PaginationControls from '@/components/PaginationControls';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

type RawArticle = {
  guid?: string;
  title?: string;
  description?: string;
  image_url?: string | null;
  pubDate?: string;
  source_id?: string;
  link?: string;
};

type Article = {
  article_id: string;
  title: string;
  description: string;
  image_url: string | null;
  formattedDate: string;
  source_name: string;
  source_icon: string;
  link: string;
};

export default function SearchPage() {
  const { country } = useCountry();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';

  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const [page, setPage] = useState(1);
  const [pageTokens, setPageTokens] = useState<string[]>(['']);

  useEffect(() => {
    if (!searchQuery || !country.code) return;

    async function fetchSearchResults() {
      setLoading(true);
      setError(null);

      try {
        const currentToken = pageTokens[page - 1] || '';

        const params = new URLSearchParams({
          query: searchQuery,
          country: country.code.toLowerCase(),
          language: 'en',
        });

        if (currentToken) {
          params.set('page', currentToken);
        }

        const res = await fetch(`/api/search?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch search results');
        const data = await res.json();

        const formattedArticles: Article[] = (data.results || []).map(
          (item: RawArticle, i: number) => ({
            article_id: item.guid || String(i),
            title: item.title || 'No Title',
            description: item.description || 'No Description',
            image_url: item.image_url || null,
            formattedDate: item.pubDate
              ? format(new Date(item.pubDate), 'dd MMM yyyy, HH:mm')
              : 'Unknown Date',
            source_name: item.source_id || 'Unknown Source',
            source_icon: '/default-news.jpg',
            link: item.link || '#',
          })
        );

        setArticles(formattedArticles);
        setTotalResults(data.totalResults || 0);

        // Add next page token if available and not already stored
        if (data.nextPage && pageTokens.length < page + 1) {
          setPageTokens((prev: string[]) => [...prev, data.nextPage]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error fetching search results');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
    // We intentionally exclude pageTokens from dependency array to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, country.code, page]);

  if (!searchQuery) {
    return <p className="text-center py-20">No search term provided.</p>;
  }

  if (loading) return <p className="text-center py-20">Loading results...</p>;
  if (error) return <p className="text-center py-20 text-red-600">{error}</p>;

  return (
    <main className="min-h-screen bg-white text-foreground px-4 sm:px-6 lg:px-12 py-10">
      <h1 className="text-3xl font-bold mb-10">
        Search Results for: <span className="text-blue-600">{searchQuery}</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.length === 0 ? (
          <p className="col-span-full text-center">No articles found.</p>
        ) : (
          articles.map((article) => <Newscard key={article.article_id} article={article} />)
        )}
      </div>

      {totalResults > 9 && (
        <PaginationControls
          currentPage={page}
          totalResults={totalResults}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </main>
  );
}
