import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogHero from './components/BlogHero';
import BlogGrid from './components/BlogGrid';

export const metadata: Metadata = {
  title: 'Research & Insights — The.Nerds',
  description:
    'Market research, financial analysis, and data-driven insights from The.Nerds team. Published reports, sector analysis, and investment intelligence.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Research & Insights — The.Nerds',
    description: 'Market research and financial intelligence from The.Nerds.',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
};

const articleListSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'The.Nerds Research & Insights',
  description: 'Market research, financial analysis, and data-driven insights.',
  url: 'http://localhost:3000/blog',
  publisher: { '@type': 'Organization', name: 'The.Nerds' },
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleListSchema) }}
      />
      <Header />
      <main>
        <BlogHero />
        <BlogGrid />
      </main>
      <Footer />
    </>
  );
}
