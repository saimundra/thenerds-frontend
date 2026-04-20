'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { apiFetch } from '@/lib/api';

const categories = [
  'All',
  'Market Analysis',
  'Financial Research',
  'Data Analytics',
  'Competitive Intel',
  'Macro',
];

type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  imageAlt: string;
};

export default function BlogGrid() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  React.useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        const data = (await apiFetch('/posts/')) as any[];
        const mapped = data
          .filter((item) => item.status === 'published')
          .map((item) => ({
            slug: item.slug,
            category: item.category,
            title: item.title,
            excerpt: item.metaDescription,
            date: item.date,
            readTime: item.readTime,
            author: item.author,
            image: item.image,
            imageAlt: item.altText,
          }));

        if (mounted) {
          setPosts(mapped);
        }
      } catch {
        if (mounted) {
          setPosts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPosts();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered =
    activeCategory === 'All' ? posts : posts?.filter((p) => p?.category === activeCategory);

  return (
    <section className="pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap mb-10 pb-6 border-b border-border/50">
          {categories?.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground font-medium">
            {filtered?.length} article{filtered?.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* H2 for SEO */}
        <h2 className="sr-only">All Research Articles</h2>

        {/* Grid */}
        {loading && (
          <div className="text-sm text-muted-foreground mb-6">Loading blog posts...</div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map((post) => (
            <article
              key={post?.slug}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all duration-300 card-hover flex flex-col"
            >
              <div className="relative overflow-hidden aspect-video">
                <AppImage
                  src={post?.image}
                  alt={post?.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-primary/90 text-white rounded">
                  {post?.category}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-sm font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                  {post?.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
                  {post?.excerpt}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="UserIcon" size={11} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-foreground/80">{post?.author}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {post?.date} · {post?.readTime}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary hover:text-accent transition-colors"
                    aria-label={`Read ${post?.title}`}
                  >
                    <Icon name="ArrowRightIcon" size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-sm text-muted-foreground mt-6">No posts available yet.</div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-12">
          <button className="w-9 h-9 rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center">
            <Icon name="ChevronLeftIcon" size={16} />
          </button>
          {[1, 2, 3]?.map((page) => (
            <button
              key={page}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                page === 1
                  ? 'bg-primary text-white'
                  : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="w-9 h-9 rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center">
            <Icon name="ChevronRightIcon" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
