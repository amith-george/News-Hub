// src/app/category/[category]/page.tsx
import React from 'react';
import CategoryNewsClient from '@/components/CategoryNewsClient';

type Props = {
  params: {
    category: string;
  };
};

export default function CategoryPage({ params }: Props) {
  return <CategoryNewsClient category={params.category} />;
}
