import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import type { Post } from './DashboardLayout';

interface Props {
  posts: Post[];
  onNewPost: () => void;
  onViewPosts: () => void;
}

export default function DashboardStats({ posts, onNewPost, onViewPosts }: Props) {
  const published = posts.filter((p) => p.status === 'published').length;
  const drafts = posts.filter((p) => p.status === 'draft').length;
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

  const stats = [
    {
      label: 'Total Posts',
      value: posts.length,
      icon: 'DocumentTextIcon',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Published',
      value: published,
      icon: 'CheckCircleIcon',
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      label: 'Drafts',
      value: drafts,
      icon: 'PencilIcon',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: 'EyeIcon',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  const recentPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 3);

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-extrabold text-foreground mb-1">Overview</h2>
        <p className="text-sm text-muted-foreground">Your content performance at a glance.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <Icon name={stat.icon as 'DocumentTextIcon'} size={18} className={stat.color} />
            </div>
            <p className="text-2xl font-extrabold text-foreground stat-counter">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent posts */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">Top Performing Posts</h3>
          <button
            onClick={onViewPosts}
            className="text-xs font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1"
          >
            View all <Icon name="ArrowRightIcon" size={12} />
          </button>
        </div>
        <div className="divide-y divide-border">
          {recentPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <AppImage
                  src={post.image}
                  alt={post.altText}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{post.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {post.category} · {post.date}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground">{post.views.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">views</p>
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                  post.status === 'published'
                    ? 'bg-green-400/15 text-green-400'
                    : 'bg-amber-400/15 text-amber-400'
                }`}
              >
                {post.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          onClick={onNewPost}
          className="flex items-center gap-4 bg-primary/10 border border-primary/20 rounded-xl p-5 hover:bg-primary/15 transition-colors text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Icon name="PlusCircleIcon" size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Create New Post</p>
            <p className="text-xs text-muted-foreground mt-0.5">Write and publish research</p>
          </div>
          <Icon
            name="ArrowRightIcon"
            size={16}
            className="text-primary ml-auto group-hover:translate-x-1 transition-transform"
          />
        </button>
        <button
          onClick={onViewPosts}
          className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Icon name="DocumentTextIcon" size={20} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Manage Posts</p>
            <p className="text-xs text-muted-foreground mt-0.5">Edit, publish, or delete</p>
          </div>
          <Icon
            name="ArrowRightIcon"
            size={16}
            className="text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}
