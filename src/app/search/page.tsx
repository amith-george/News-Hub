// src/app/search/page.tsx
import { Suspense } from 'react';
import SearchNewsClient from '@/components/SearchNewsClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-center py-20">Loading search page...</p>}>
      <SearchNewsClient />
    </Suspense>
  );
}
