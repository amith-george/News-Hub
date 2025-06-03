'use client';

import React, { useEffect, useState } from 'react';
import Newscard from '@/components/NewsCard';
import { useCountry } from '@/context/CountryContext';
import { format } from 'date-fns';
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

type Props = {
  params: {
    category: string;
  };
};

// Define a proper type for the API news item to avoid using 'any'
type NewsItem = {
  guid?: string;
  title?: string;
  description?: string;
  image_url?: string | null;
  pubDate?: string;
  source_id?: string;
  link?: string;
};

export default function CategoryPage({ params }: Props) {
  const { category } = params;
  const { country } = useCountry();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalResults, setTotalResults] = useState(0);
  const [pageTokens, setPageTokens] = useState<string[]>(['']); // index = pageNumber - 1
  const [currentPage, setCurrentPage] = useState(1);

  const currentPageToken = pageTokens[currentPage - 1] ?? null;

  // Reset pagination when country or category changes
  useEffect(() => {
    setPageTokens(['']);
    setCurrentPage(1);
  }, [country, category]);

  useEffect(() => {
    if (!country?.code || !category) return;

    async function fetchNews() {
      setLoading(true);
      setError(null);

      try {
        let url = `/api/news?country=${country.code.toLowerCase()}&category=${encodeURIComponent(
          category
        )}`;
        if (currentPageToken) {
          url += `&page=${encodeURIComponent(currentPageToken)}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to fetch news');
        }

        const data = await res.json();

        const formattedArticles: Article[] = (data.results || []).map(
          (item: NewsItem, i: number) => ({
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

        if (data.nextPageToken) {
          setPageTokens((prev) => {
            const updated = [...prev];
            updated[currentPage] = data.nextPageToken;
            return updated;
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error fetching news';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [country, category, currentPageToken, currentPage]);

  function handlePageChange(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  if (loading)
    return (
      <main className="min-h-screen flex justify-center items-center">
        <p>Loading news for {category}...</p>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen flex justify-center items-center text-red-600">
        <p>Error: {error}</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-white text-foreground px-4 sm:px-6 lg:px-12 py-10">
      <h1 className="text-4xl font-bold text-center mb-12 capitalize">{category} News</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No news found for the selected category and country.
          </p>
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
