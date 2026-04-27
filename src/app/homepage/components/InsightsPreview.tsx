'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { apiFetch } from '@/lib/api';

type InsightPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
};

export default function InsightsPreview() {
  const [posts, setPosts] = React.useState<InsightPost[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        const data = (await apiFetch('/posts/')) as any[];
        const mapped = data
          .filter((item) => item.status === 'published')
          .slice(0, 3)
          .map((item) => ({
            slug: item.slug,
            category: item.category,
            title: item.title,
            excerpt: item.metaDescription,
            date: item.date,
            readTime: item.readTime,
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

  return (
    <section className="py-16 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
              Enterprise clients(Across globe)
            </p>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground">
              Articles worth reading
            </h2>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors shrink-0"
          >
            View all articles <Icon name="ArrowRightIcon" size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post, i) => (
            <article
              key={post?.slug}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all duration-300 card-hover flex flex-col"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative overflow-hidden aspect-video">
                <AppImage
                  src={post?.image}
                  alt={post?.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-primary/90 text-white rounded-md">
                  {post?.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-base font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                  {post?.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                  {post?.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <span>{post?.date}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <span>{post?.readTime}</span>
                  </div>
                  <Link
                    href={`/blog`}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition-colors"
                    aria-label={`Read ${post?.title}`}
                  >
                    Read <Icon name="ArrowRightIcon" size={12} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {loading && <p className="text-sm text-muted-foreground mt-4">Loading insights...</p>}
        {!loading && posts.length === 0 && (
          <p className="text-sm text-muted-foreground mt-4">Articles lates post to be done</p>
        )}
      </div>
    </section>
  );
}
