'use client';

import React, { useEffect, useState } from 'react';
import Newscard from '@/components/NewsCard';
import { format } from 'date-fns';
import { useCountry } from '@/context/CountryContext';
import PaginationControls from '@/components/PaginationControls';

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

type RawArticle = {
  guid?: string;
  title?: string;
  description?: string;
  image_url?: string | null;
  pubDate?: string;
  source_id?: string;
  link?: string;
};

export default function Home() {
  const { country } = useCountry();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalResults, setTotalResults] = useState(0); 
  const [pageTokens, setPageTokens] = useState<string[]>(['']);
  const [currentPage, setCurrentPage] = useState(1);

  const currentPageToken = pageTokens[currentPage - 1] ?? '';

  useEffect(() => {
    setPageTokens(['']);
    setCurrentPage(1);
  }, [country]);

  useEffect(() => {
    if (!country?.code || country.code === 'wo') return;

    async function fetchNews() {
      setLoading(true);
      setError(null);

      try {
        let url = `/api/news?country=${country.code.toLowerCase()}`;
        if (currentPageToken) {
          url += `&page=${encodeURIComponent(currentPageToken)}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();

        const formattedArticles: Article[] = (data.results || []).map((item: RawArticle, i: number) => ({
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
        }));

        setArticles(formattedArticles);
        setTotalResults(data.totalResults || 0);

        if (data.nextPageToken) {
          setPageTokens((prev) => {
            const updated = [...prev];
            updated[currentPage] = data.nextPageToken;
            return updated;
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage || 'Error fetching news');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [country, currentPageToken, currentPage]);

  function handlePageChange(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  if (loading) return <p className="text-center py-20">Loading news...</p>;
  if (error) return <p className="text-center py-20 text-red-600">{error}</p>;

  return (
    <main className="min-h-screen bg-white text-foreground px-4 sm:px-6 lg:px-12 py-10">
      <h1 className="text-4xl font-bold text-center mb-12">Latest News</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.length === 0 ? (
          <p className="col-span-full text-center">No articles found.</p>
        ) : (
          articles.map((article) => <Newscard key={article.article_id} article={article} />)
        )}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalResults={totalResults}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
