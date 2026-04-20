"use client";

import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { apiFetch } from '@/lib/api';

type FeaturedPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
  };
  image: string;
  imageAlt: string;
};

export default function BlogHero() {
  const [featuredPost, setFeaturedPost] = React.useState<FeaturedPost | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    async function loadFeaturedPost() {
      try {
        const data = (await apiFetch('/posts/')) as any[];
        const published = data.find((item) => item.status === 'published');

        if (mounted && published) {
          setFeaturedPost({
            slug: published.slug,
            category: published.category,
            title: published.title,
            excerpt: published.metaDescription,
            date: published.date,
            readTime: published.readTime,
            author: {
              name: published.author,
              role: 'Research Analyst',
            },
            image: published.image,
            imageAlt: published.altText,
          });
        }
      } catch {
        if (mounted) {
          setFeaturedPost(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadFeaturedPost();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page H1 */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
            The.Nerds Research Hub
          </p>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-foreground leading-tight">
            Insights & Analysis
          </h1>
          <p className="text-base text-muted-foreground mt-3 max-w-xl font-medium">
            Original research, market analysis, and financial intelligence from our team of
            analysts.
          </p>
        </div>

        {/* Featured Post */}
        <article className="group relative rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-all duration-300">
          <div className="grid lg:grid-cols-2 items-stretch">
            {/* Image */}
            <div className="relative min-h-[280px] lg:min-h-[420px] overflow-hidden">
              {featuredPost && (
                <AppImage
                  src={featuredPost.image}
                  alt={featuredPost.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80 hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent lg:hidden" />
              <span className="absolute top-5 left-5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-primary text-white rounded-md">
                Featured
              </span>
            </div>

            {/* Content */}
            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3 block">
                  {featuredPost?.category ?? 'Featured'}
                </span>
                <h2 className="text-xl lg:text-2xl font-extrabold text-foreground leading-snug mb-4">
                  {loading
                    ? 'Loading featured article...'
                    : (featuredPost?.title ?? 'No featured article available.')}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {featuredPost?.excerpt ??
                    'Publish a post from the dashboard to show it here.'}
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="UserIcon" size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {featuredPost?.author?.name ?? 'The.Nerds Team'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {featuredPost?.author?.role ?? 'Research Team'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <span>{featuredPost?.date}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <span>{featuredPost?.readTime}</span>
                  </div>
                  {featuredPost ? (
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-accent transition-colors"
                      aria-label={`Read ${featuredPost.title}`}
                    >
                      Read Report <Icon name="ArrowRightIcon" size={12} />
                    </Link>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground">No post yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
