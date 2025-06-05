// src/app/category/[category]/page.tsx
import React from 'react';
import CategoryNewsClient from '@/components/CategoryNewsClient';

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return <CategoryNewsClient category={params.category} />;
}
