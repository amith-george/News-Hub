'use client';

import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { usePathname, useRouter } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';

const today = new Date();
const initialDate = today.toLocaleDateString('en-GB').replace(/\//g, '-');

export default function NewsHeader() {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { country } = useCountry();

  function capitalizeFirstLetter(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getCategoryFromPath(path: string | null): string {
    if (!path) return 'Latest News';
    const parts = path.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'category') {
      return capitalizeFirstLetter(parts[1]);
    }
    return 'Latest News';
  }

  function handleSearch() {
    if (!searchTerm.trim()) return;

    setLoading(true);
    const encodedQuery = encodeURIComponent(searchTerm.trim());
    router.push(`/search?query=${encodedQuery}`);
    setLoading(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className="flex flex-wrap justify-between items-center px-6 py-4 bg-white">
      <div className="space-y-1 text-left">
        <div className="text-lg font-semibold text-gray-900">
          Date: <span className="font-normal">{currentDate}</span>
        </div>
        <div className="text-lg font-semibold text-gray-900">
          {country.name}
          {pathname && !pathname.startsWith('/search') && (
            <>
              {' '} &gt;{' '}
              <span className="font-normal text-blue-600">
                {getCategoryFromPath(pathname)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center w-full max-w-[600px] mt-4 sm:mt-0">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search for news, topics, or keywords..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
          disabled={loading}
        />
        <button
          onClick={handleSearch}
          aria-label="Search"
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <FiSearch size={18} />
        </button>
      </div>
    </div>
  );
}
