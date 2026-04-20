import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

type ApiPost = {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  metaDescription: string;
  image: string;
  altText: string;
};

async function fetchPostBySlug(slug: string): Promise<ApiPost | null> {
  const response = await fetch(`${API_BASE_URL}/posts/`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const posts = (await response.json()) as ApiPost[];
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return {
      title: 'Report Not Found — The.Nerds',
      description: 'The requested report could not be found.',
    };
  }

  return {
    title: `${post.title} — The.Nerds`,
    description: post.metaDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-12">
        <article className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            {post.category}
          </p>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium mb-8">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="UserIcon" size={14} />
              {post.author}
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span>{post.readTime}</span>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border mb-8">
            <AppImage src={post.image} alt={post.altText} fill className="object-cover" priority />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            {post.content?.trim() ? (
              <div className="space-y-4">
                {post.content
                  .split('\n')
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={`${post.slug}-p-${index}`} className="text-base text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
              </div>
            ) : (
              <p className="text-base text-muted-foreground leading-relaxed">{post.metaDescription}</p>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
