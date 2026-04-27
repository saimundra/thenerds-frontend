'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import PostsTable from './PostsTable';
import PostEditor from './PostEditor';
import DashboardStats from './DashboardStats';
import { apiFetch, getReadableError } from '@/lib/api';
import { clearTokens } from '@/lib/auth';

type View = 'overview' | 'articles' | 'reports' | 'new-post' | 'edit-post';

const REPORT_CATEGORIES = new Set(['nepse', 'forex', 'smart money concepts']);

function isReportCategory(category: string) {
  return REPORT_CATEGORIES.has((category || '').trim().toLowerCase());
}

export interface Post {
  id: string;
  ownerId?: number;
  title: string;
  slug: string;
  category: string;
  status: 'published' | 'draft';
  author: string;
  date: string;
  readTime: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  altText: string;
  views: number;
  image: string;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: 'Squares2X2Icon' },
  { id: 'articles', label: 'Articles', icon: 'DocumentTextIcon' },
  { id: 'reports', label: 'Reports', icon: 'ChartPieIcon' },
  { id: 'new-post', label: 'New Content', icon: 'PlusCircleIcon' },
];

export default function DashboardLayout() {
  const router = useRouter();
  const [view, setView] = useState<View>('overview');
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editorDefaultCategory, setEditorDefaultCategory] = useState<string>('NEPSE');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizePost = (post: any): Post => ({
    id: String(post.id),
    ownerId: post.ownerId,
    title: post.title,
    slug: post.slug,
    category: post.category,
    status: post.status,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    content: post.content ?? '',
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    h1: post.h1,
    altText: post.altText,
    views: post.views,
    image: post.image,
  });

  React.useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        setLoading(true);
        const me = (await apiFetch('/auth/me/')) as {
          username: string;
          can_manage_posts: boolean;
          can_manage_users: boolean;
        };
        if (!me.can_manage_posts) {
          if (mounted) {
            setForbidden(true);
            setError('Your account is not allowed to access the blog dashboard.');
          }
          return;
        }

        if (mounted) {
          setCurrentUsername(me.username);
          setCurrentUserIsAdmin(me.can_manage_users);
        }

        const data = (await apiFetch('/posts/?scope=dashboard')) as any[];
        if (mounted) {
          setPosts(data.map(normalizePost));
          setForbidden(false);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(getReadableError(err, 'Unable to load posts from backend API.'));
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

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setView('edit-post');
    setSidebarOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/posts/${id}/`, { method: 'DELETE' });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(getReadableError(err, 'Delete failed. Please try again.'));
    }
  };

  const handleSave = async (post: Post) => {
    const payload = {
      title: post.title,
      slug: post.slug,
      category: post.category,
      status: post.status,
      author: post.author || currentUsername,
      date: post.date,
      readTime: post.readTime,
      content: post.content,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      h1: post.h1,
      altText: post.altText,
      views: post.views,
      image: post.image,
    };

    try {
      if (editingPost) {
        const updated = await apiFetch(`/posts/${post.id}/`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        const normalized = normalizePost(updated);
        setPosts((prev) => prev.map((p) => (p.id === normalized.id ? normalized : p)));
      } else {
        const created = await apiFetch('/posts/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setPosts((prev) => [normalizePost(created), ...prev]);
      }

      setError(null);
      setView(isReportCategory(post.category) ? 'reports' : 'articles');
      setEditingPost(null);
    } catch (err) {
      setError(getReadableError(err, 'Save failed. Please check your inputs and try again.'));
    }
  };

  const handleSignOut = () => {
    clearTokens();
    router.push('/login');
  };

  const handleNewPost = (category = 'NEPSE') => {
    setEditorDefaultCategory(category);
    setEditingPost(null);
    setView('new-post');
    setSidebarOpen(false);
  };

  const articlePosts = React.useMemo(
    () => posts.filter((post) => !isReportCategory(post.category)),
    [posts]
  );
  const reportPosts = React.useMemo(
    () => posts.filter((post) => isReportCategory(post.category)),
    [posts]
  );

  if (forbidden) {
    return (
      <main className="min-h-screen bg-background pt-24 px-6 pb-10">
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6">
          <h1 className="text-xl font-extrabold text-foreground mb-2">Dashboard access required</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Your account must be assigned as admin or blog creator from the admin panel.
          </p>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            <Icon name="ArrowRightStartOnRectangleIcon" size={14} />
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-60 bg-card border-r border-border flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-border shrink-0">
          <Link href="/homepage" className="flex items-center">
            <span className="font-sans font-800 text-base tracking-tight text-foreground">
              The<span className="text-primary">.</span>Nerds
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-2">
            Content
          </p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id as View);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                view === item.id ||
                (view === 'edit-post' && item.id === (editingPost && isReportCategory(editingPost.category) ? 'reports' : 'articles'))
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon name={item.icon as 'Squares2X2Icon'} size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom links */}
        <div className="p-3 border-t border-border space-y-1">
          <Link
            href="/blog"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <Icon name="ArrowTopRightOnSquareIcon" size={18} />
            View Blog
          </Link>
          <Link
            href="/homepage"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <Icon name="HomeIcon" size={18} />
            Homepage
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-16 border-b border-border flex items-center justify-between px-5 bg-card/50 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-foreground p-1"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Icon name="Bars3Icon" size={22} />
            </button>
            <div>
              <p className="text-sm font-bold text-foreground capitalize">
                {view === 'edit-post'
                  ? 'Edit Content'
                  : view === 'new-post'
                    ? isReportCategory(editorDefaultCategory)
                      ? 'New Report'
                      : 'New Article'
                    : view}
              </p>
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                Blog Content Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNewPost(view === 'reports' ? 'NEPSE' : 'Market Analysis')}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-accent transition-colors"
            >
              <Icon name="PlusIcon" size={14} />
              <span className="hidden sm:inline">{view === 'reports' ? 'New Report' : 'New Content'}</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon name="UserIcon" size={16} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {error && (
            <div className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {loading && (
            <div className="mb-4 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              Loading posts from API...
            </div>
          )}

          {view === 'overview' && (
            <DashboardStats
              posts={posts}
              onNewPost={() => handleNewPost('Market Analysis')}
              onViewPosts={() => setView('articles')}
            />
          )}
          {view === 'articles' && (
            <PostsTable
              posts={articlePosts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNewPost={() => handleNewPost('Market Analysis')}
              title="Articles"
              subtitle={`${articlePosts.length} total article${articlePosts.length === 1 ? '' : 's'}`}
              newButtonLabel="New Article"
              emptyLabel="No articles found"
            />
          )}
          {view === 'reports' && (
            <PostsTable
              posts={reportPosts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNewPost={() => handleNewPost('NEPSE')}
              title="Reports"
              subtitle={`${reportPosts.length} total report${reportPosts.length === 1 ? '' : 's'}`}
              newButtonLabel="New Report"
              emptyLabel="No reports found"
            />
          )}
          {(view === 'new-post' || view === 'edit-post') && (
            <PostEditor
              post={editingPost}
              currentUsername={currentUsername}
              canEditAuthor={currentUserIsAdmin}
              defaultCategory={editorDefaultCategory}
              onSave={handleSave}
              onCancel={() => {
                setView(editingPost && isReportCategory(editingPost.category) ? 'reports' : 'articles');
                setEditingPost(null);
              }}
            />
          )}
        </main>

        <div className="border-t border-border p-4 bg-card/40">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ArrowRightStartOnRectangleIcon" size={14} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
