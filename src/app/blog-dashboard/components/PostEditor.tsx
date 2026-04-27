'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import type { Post } from './DashboardLayout';

interface Props {
  post: Post | null;
  currentUsername: string;
  canEditAuthor: boolean;
  defaultCategory?: string;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

const categories = [
  'NEPSE',
  'Forex',
  'Smart Money Concepts',
  'Market Analysis',
  'Financial Research',
  'Data Analytics',
  'Competitive Intel',
  'Macro',
];

const emptyPost: Omit<Post, 'id' | 'views'> = {
  title: '',
  slug: '',
  category: 'NEPSE',
  status: 'draft',
  author: '',
  date: 'Apr 19, 2026',
  readTime: '',
  content: '',
  metaTitle: '',
  metaDescription: '',
  h1: '',
  altText: '',
  image:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function PostEditor({
  post,
  currentUsername,
  canEditAuthor,
  defaultCategory,
  onSave,
  onCancel,
}: Props) {
  const [form, setForm] = useState<Omit<Post, 'id' | 'views'>>(
    post
      ? { ...post }
      : { ...emptyPost, category: defaultCategory || emptyPost.category, author: currentUsername }
  );
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'preview'>('content');
  const [charCount, setCharCount] = useState({ metaTitle: 0, metaDescription: 0 });

  useEffect(() => {
    setCharCount({
      metaTitle: form.metaTitle.length,
      metaDescription: form.metaDescription.length,
    });
  }, [form.metaTitle, form.metaDescription]);

  useEffect(() => {
    if (!post && currentUsername) {
      setForm((prev) => ({ ...prev, author: prev.author || currentUsername }));
    }
  }, [post, currentUsername]);

  useEffect(() => {
    if (!post && defaultCategory) {
      setForm((prev) => ({ ...prev, category: defaultCategory }));
    }
  }, [post, defaultCategory]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !post) {
        updated.slug = slugify(value);
        if (!updated.h1) updated.h1 = value;
      }
      return updated;
    });
  };

  const handleSave = (status: 'published' | 'draft') => {
    onSave({
      ...form,
      status,
      id: post?.id ?? String(Date.now()),
      views: post?.views ?? 0,
    });
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: 'DocumentTextIcon' },
    { id: 'seo', label: 'SEO', icon: 'MagnifyingGlassIcon' },
    { id: 'preview', label: 'Preview', icon: 'EyeIcon' },
  ] as const;

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">
            {post ? 'Edit Post' : 'New Post'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {post
              ? `Editing: ${post.title.slice(0, 40)}...`
              : 'Create and optimize a new research article'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="XMarkIcon" size={18} /> Cancel
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab.icon as 'DocumentTextIcon'} size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'content' && (
            <>
              {/* Title */}
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Article Content
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => update('title', e.target.value)}
                    placeholder="e.g. AI-Driven Alpha: How Quant Funds Are Outperforming"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Slug
                    </label>
                    <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2.5">
                      <span className="text-xs text-muted-foreground shrink-0">/blog/</span>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => update('slug', e.target.value)}
                        className="flex-1 bg-transparent text-sm text-foreground focus:outline-none min-w-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={form.readTime}
                      onChange={(e) => update('readTime', e.target.value)}
                      placeholder="e.g. 8 min"
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Article Body
                  </label>
                  <textarea
                    rows={8}
                    value={form.content}
                    onChange={(e) => update('content', e.target.value)}
                    placeholder="Write your research article here. Use markdown for formatting..."
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none font-mono leading-relaxed"
                  />
                </div>
              </div>

              {/* Image */}
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Featured Image
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => update('image', e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Alt Text{' '}
                    <span className="text-primary text-[10px] font-medium normal-case ml-1">
                      (Required for SEO & Accessibility)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.altText}
                    onChange={(e) => update('altText', e.target.value)}
                    placeholder="Describe the image for screen readers and search engines"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    Good alt text: &quot;Financial analyst reviewing market charts on dark screen
                    with blue data visualizations&quot;
                  </p>
                </div>
                {form.image && (
                  <div className="rounded-lg overflow-hidden border border-border aspect-video relative">
                    <AppImage
                      src={form.image}
                      alt={form.altText || 'Preview image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'seo' && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="MagnifyingGlassIcon" size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-foreground">SEO Settings</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                These fields directly control how this article appears in Google search results.
                Optimize carefully.
              </p>

              {/* H1 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    H1 Tag <span className="text-primary font-medium ml-1">(Page Heading)</span>
                  </label>
                  <span className="text-[10px] text-muted-foreground">One per page</span>
                </div>
                <input
                  type="text"
                  value={form.h1}
                  onChange={(e) => update('h1', e.target.value)}
                  placeholder="Primary heading — matches or refines the title"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  The H1 tag is the most important on-page SEO element. Should contain your primary
                  keyword.
                </p>
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground">Meta Title</label>
                  <span
                    className={`text-[10px] font-medium ${charCount.metaTitle > 60 ? 'text-red-400' : charCount.metaTitle > 50 ? 'text-amber-400' : 'text-green-400'}`}
                  >
                    {charCount.metaTitle}/60
                  </span>
                </div>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => update('metaTitle', e.target.value)}
                  placeholder="Article Title | The.Nerds"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Keep under 60 characters. Appears as the blue link in Google results.
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground">Meta Description</label>
                  <span
                    className={`text-[10px] font-medium ${charCount.metaDescription > 160 ? 'text-red-400' : charCount.metaDescription > 140 ? 'text-amber-400' : 'text-green-400'}`}
                  >
                    {charCount.metaDescription}/160
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={form.metaDescription}
                  onChange={(e) => update('metaDescription', e.target.value)}
                  placeholder="A concise summary of the article that appears in search results..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Keep between 140–160 characters. This is the snippet shown under the title in
                  search results.
                </p>
              </div>

              {/* SERP Preview */}
              <div className="border border-border rounded-xl p-4 bg-background">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Google Preview
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-green-400 font-medium">
                    thenerds.io › blog › {form.slug || 'article-slug'}
                  </p>
                  <p className="text-sm font-semibold text-primary leading-snug">
                    {form.metaTitle || form.title || 'Meta Title — The.Nerds'}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {form.metaDescription ||
                      'Your meta description will appear here. Write a compelling summary that encourages clicks from search results.'}
                  </p>
                </div>
              </div>

              {/* SEO Checklist */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  SEO Checklist
                </p>
                {[
                  { label: 'H1 tag set', pass: form.h1.length > 0 },
                  {
                    label: 'Meta title under 60 chars',
                    pass: form.metaTitle.length > 0 && form.metaTitle.length <= 60,
                  },
                  {
                    label: 'Meta description 140–160 chars',
                    pass: form.metaDescription.length >= 140 && form.metaDescription.length <= 160,
                  },
                  {
                    label: 'Slug is URL-friendly',
                    pass: form.slug.length > 0 && /^[a-z0-9-]+$/.test(form.slug),
                  },
                  { label: 'Image alt text provided', pass: form.altText.length > 10 },
                  { label: 'Author assigned', pass: form.author.length > 0 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.pass ? 'bg-green-400/20' : 'bg-border'}`}
                    >
                      {item.pass ? (
                        <Icon name="CheckIcon" size={10} className="text-green-400" />
                      ) : (
                        <Icon name="MinusIcon" size={10} className="text-muted-foreground" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${item.pass ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <Icon name="EyeIcon" size={16} className="text-primary" />
                <span className="text-sm font-bold text-foreground">Article Preview</span>
              </div>
              <div className="p-6">
                {form.image && (
                  <div className="rounded-xl overflow-hidden aspect-video relative mb-6">
                    <AppImage
                      src={form.image}
                      alt={form.altText || 'Article image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-primary/20 text-primary rounded">
                      {form.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {form.date} · {form.readTime}
                    </span>
                  </div>
                  <h1 className="text-xl font-extrabold text-foreground leading-snug">
                    {form.h1 || form.title || 'Article Title'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {form.author && `By ${form.author}`}
                  </p>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground italic">
                      Article body content will appear here when published...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Publish
            </h3>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Status</label>
              <div className="flex gap-2">
                {(['draft', 'published'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => update('status', s)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors capitalize ${
                      form.status === s
                        ? s === 'published'
                          ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                          : 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                        : 'bg-background border border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleSave('published')}
                className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-accent transition-colors"
              >
                Publish Now
              </button>
              <button
                onClick={() => handleSave('draft')}
                className="w-full bg-background border border-border text-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Save as Draft
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Article Info
            </h3>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => update('author', e.target.value)}
                placeholder="e.g. Marcus Chen"
                disabled={!canEditAuthor}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              {!canEditAuthor && (
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Author name is locked to your account for your own posts.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Publish Date
              </label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* SEO Score */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                SEO Score
              </h3>
              <button
                onClick={() => setActiveTab('seo')}
                className="text-[10px] font-semibold text-primary hover:text-accent transition-colors"
              >
                View details
              </button>
            </div>
            {(() => {
              const checks = [
                form.h1.length > 0,
                form.metaTitle.length > 0 && form.metaTitle.length <= 60,
                form.metaDescription.length >= 140 && form.metaDescription.length <= 160,
                form.slug.length > 0 && /^[a-z0-9-]+$/.test(form.slug),
                form.altText.length > 10,
                form.author.length > 0,
              ];
              const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
              const color =
                score >= 80 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
              const barColor =
                score >= 80 ? 'bg-green-400' : score >= 50 ? 'bg-amber-400' : 'bg-red-400';
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-extrabold ${color}`}>{score}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {score >= 80
                      ? 'Great SEO optimization'
                      : score >= 50
                        ? 'Needs improvement'
                        : 'Poor SEO — fill required fields'}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
