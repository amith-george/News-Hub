// src/app/category/[category]/page.tsx
import React from 'react';
import CategoryNewsClient from '@/components/CategoryNewsClient';

type Params = {
  category: string;
};

export default async function CategoryPage({
  params,
}: {
  params: Params;
}) {
  // No need to await anything here, but the async signature matches Next.js expectation.
  return <CategoryNewsClient category={params.category} />;
}
