'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import type { Post } from './DashboardLayout';

interface Props {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onNewPost: () => void;
  title?: string;
  subtitle?: string;
  newButtonLabel?: string;
  emptyLabel?: string;
}

export default function PostsTable({
  posts,
  onEdit,
  onDelete,
  onNewPost,
  title = 'All Posts',
  subtitle,
  newButtonLabel = 'New Post',
  emptyLabel = 'No posts found',
}: Props) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const filtered = posts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {subtitle ?? `${posts.length} total item${posts.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <button
          onClick={onNewPost}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-accent transition-colors shrink-0"
        >
          <Icon name="PlusIcon" size={16} /> {newButtonLabel}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon
            name="MagnifyingGlassIcon"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'published', 'draft'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors capitalize ${
                filterStatus === s
                  ? 'bg-primary text-white'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Post
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">
                  Author
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden sm:table-cell">
                  Views
                </th>
                <th className="text-right px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                        <AppImage
                          src={post.image}
                          alt={post.altText}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate max-w-[200px] lg:max-w-xs">
                          {post.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {post.date} · {post.readTime}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs font-medium text-muted-foreground">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs font-medium text-muted-foreground">{post.author}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${
                        post.status === 'published'
                          ? 'bg-green-400/15 text-green-400'
                          : 'bg-amber-400/15 text-amber-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-green-400' : 'bg-amber-400'}`}
                      />
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right hidden sm:table-cell">
                    <span className="text-sm font-semibold text-foreground">
                      {post.views.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(post)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        aria-label={`Edit ${post.title}`}
                      >
                        <Icon name="PencilIcon" size={15} />
                      </button>
                      {deleteConfirm === post.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              onDelete(post.id);
                              setDeleteConfirm(null);
                            }}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors text-[10px] font-bold"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-white/5 transition-colors text-[10px] font-bold"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(post.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          aria-label={`Delete ${post.title}`}
                        >
                          <Icon name="TrashIcon" size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Icon
                name="DocumentTextIcon"
                size={32}
                className="text-muted-foreground/30 mx-auto mb-3"
              />
              <p className="text-sm font-medium text-muted-foreground">{emptyLabel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
