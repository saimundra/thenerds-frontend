'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { apiFetch, getReadableError } from '@/lib/api';
import { clearTokens } from '@/lib/auth';

const ADMIN_PANEL_CACHE_KEY = 'thenerds_admin_panel_cache_v1';

interface MeResponse {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

interface UserItem {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  role: 'admin' | 'blog_creator';
  date_joined: string;
}

interface PostItem {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  category: string;
  author: string;
  date: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  altText: string;
  views: number;
  image: string;
}

interface AdminPanelCache {
  users: UserItem[];
  posts: PostItem[];
  forbidden: boolean;
}

const REPORT_CATEGORIES = new Set(['nepse', 'forex', 'smart money concepts']);

function isReportCategory(category: string) {
  return REPORT_CATEGORIES.has((category || '').trim().toLowerCase());
}

function readAdminPanelCache(): AdminPanelCache | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(ADMIN_PANEL_CACHE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as AdminPanelCache;
  } catch {
    return null;
  }
}

function writeAdminPanelCache(cache: AdminPanelCache) {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(ADMIN_PANEL_CACHE_KEY, JSON.stringify(cache));
}

const initialForm = {
  username: '',
  email: '',
  password: '',
  role: 'blog_creator' as 'admin' | 'blog_creator',
};

export default function AdminPanelPage() {
  const router = useRouter();
  const hasLoadedOnce = React.useRef(false);
  const initialCache = React.useMemo(() => readAdminPanelCache(), []);
  const [loading, setLoading] = React.useState(!initialCache);
  const [forbidden, setForbidden] = React.useState(initialCache?.forbidden ?? false);
  const [error, setError] = React.useState<string | null>(null);

  const [users, setUsers] = React.useState<UserItem[]>(initialCache?.users ?? []);
  const [posts, setPosts] = React.useState<PostItem[]>(initialCache?.posts ?? []);
  const [form, setForm] = React.useState(initialForm);
  const [savingUser, setSavingUser] = React.useState(false);
  const [showCreatePassword, setShowCreatePassword] = React.useState(false);
  const [updatingUserId, setUpdatingUserId] = React.useState<number | null>(null);

  const [editingPostId, setEditingPostId] = React.useState<number | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [editStatus, setEditStatus] = React.useState<'published' | 'draft'>('draft');
  const [postTypeFilter, setPostTypeFilter] = React.useState<'all' | 'articles' | 'reports'>('all');

  const filteredPosts = React.useMemo(() => {
    if (postTypeFilter === 'articles') {
      return posts.filter((post) => !isReportCategory(post.category));
    }
    if (postTypeFilter === 'reports') {
      return posts.filter((post) => isReportCategory(post.category));
    }
    return posts;
  }, [posts, postTypeFilter]);

  const articleCount = React.useMemo(
    () => posts.filter((post) => !isReportCategory(post.category)).length,
    [posts]
  );
  const reportCount = React.useMemo(
    () => posts.filter((post) => isReportCategory(post.category)).length,
    [posts]
  );

  const loadData = React.useCallback(async () => {
    try {
      const me = (await apiFetch('/auth/me/')) as MeResponse;
      if (!me.is_staff) {
        setForbidden(true);
        writeAdminPanelCache({ users: [], posts: [], forbidden: true });
        setLoading(false);
        return;
      }

      const [usersData, postsData] = await Promise.all([
        apiFetch('/users/'),
        apiFetch('/posts/?scope=dashboard'),
      ]);

      setUsers(usersData as UserItem[]);
      setPosts(postsData as PostItem[]);
      setForbidden(false);
      writeAdminPanelCache({
        users: usersData as UserItem[],
        posts: postsData as PostItem[],
        forbidden: false,
      });
      setError(null);
    } catch (err) {
      setError(
        getReadableError(
          err,
          'Failed to load admin data (/auth/me, /users, /posts). Please sign in as an admin user.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // In Next.js dev mode, React Strict Mode can invoke effects twice.
    // Guard the initial load to avoid repeated "Loading admin panel..." flashes.
    if (hasLoadedOnce.current) {
      return;
    }
    hasLoadedOnce.current = true;
    loadData();
  }, [loadData]);

  React.useEffect(() => {
    if (loading) {
      return;
    }

    writeAdminPanelCache({ users, posts, forbidden });
  }, [loading, users, posts, forbidden]);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingUser(true);
    setError(null);

    try {
      const created = (await apiFetch('/users/', {
        method: 'POST',
        body: JSON.stringify(form),
      })) as UserItem;
      setUsers((prev) => [created, ...prev]);
      setForm(initialForm);
    } catch (err) {
      setError(getReadableError(err, 'Could not create user (/users).'));
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await apiFetch(`/users/${id}/`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      setError(getReadableError(err, 'Could not delete user.'));
    }
  };

  const handleRoleChange = async (id: number, role: 'admin' | 'blog_creator') => {
    try {
      setUpdatingUserId(id);
      const updated = (await apiFetch(`/users/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      })) as UserItem;

      setUsers((prev) => prev.map((user) => (user.id === id ? updated : user)));
    } catch (err) {
      setError(getReadableError(err, 'Could not update user role.'));
    } finally {
      setUpdatingUserId(null);
    }
  };

  const startEditPost = (post: PostItem) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditStatus(post.status);
  };

  const savePostEdit = async (post: PostItem) => {
    try {
      const updated = (await apiFetch(`/posts/${post.id}/`, {
        method: 'PUT',
        body: JSON.stringify({
          ...post,
          title: editTitle,
          status: editStatus,
        }),
      })) as PostItem;

      setPosts((prev) => prev.map((item) => (item.id === post.id ? updated : item)));
      setEditingPostId(null);
    } catch (err) {
      setError(getReadableError(err, 'Could not update post.'));
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await apiFetch(`/posts/${id}/`, { method: 'DELETE' });
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      setError(getReadableError(err, 'Could not delete post.'));
    }
  };

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ADMIN_PANEL_CACHE_KEY);
    }
    clearTokens();
    router.push('/login');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-24 px-6 pb-10 text-muted-foreground">
        Loading admin panel...
      </main>
    );
  }

  if (forbidden) {
    return (
      <main className="min-h-screen bg-background pt-24 px-6 pb-10">
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6">
          <h1 className="text-xl font-extrabold text-foreground mb-2">Admin access required</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Your account is not an admin account. Please sign in with an admin user.
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
    <main className="min-h-screen bg-background pt-24 px-6 pb-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1">Admin Panel</p>
            <h1 className="text-2xl font-extrabold text-foreground">User & Content Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/homepage')}
              className="inline-flex items-center gap-2 border border-border text-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/5"
            >
              <Icon name="HomeIcon" size={14} />
              Back to Home
            </button>
            <button
              onClick={() => router.push('/blog-dashboard')}
              className="inline-flex items-center gap-2 border border-border text-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/5"
            >
              <Icon name="Squares2X2Icon" size={14} />
              Dashboard
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <Icon name="ArrowRightStartOnRectangleIcon" size={14} />
              Sign out
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-bold text-foreground mb-4">Create Account</h2>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <input
                value={form.username}
                onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="Username"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
                required
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
                required
              />
              <div className="relative">
                <input
                  type={showCreatePassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Password"
                  className="w-full bg-background border border-border rounded-lg px-3 pr-10 py-2.5 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCreatePassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showCreatePassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showCreatePassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                </button>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Role
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      role: e.target.value as 'admin' | 'blog_creator',
                    }))
                  }
                  className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="blog_creator">Blog Creator</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <button
                disabled={savingUser}
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-70"
              >
                <Icon name="PlusIcon" size={14} />
                {savingUser ? 'Creating...' : 'Create user'}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-bold text-foreground mb-4">Accounts</h2>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{user.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email} {user.role === 'admin' ? '• Admin' : '• Blog Creator'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={user.role}
                      disabled={updatingUserId === user.id}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value as 'admin' | 'blog_creator')
                      }
                      className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs"
                    >
                      <option value="blog_creator">Blog Creator</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                      aria-label={`Delete user ${user.username}`}
                    >
                      <Icon name="TrashIcon" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Articles & Reports</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {articleCount} articles • {reportCount} reports
              </p>
            </div>
            <div className="flex items-center gap-2">
              {([
                { id: 'all', label: 'All' },
                { id: 'articles', label: 'Articles' },
                { id: 'reports', label: 'Reports' },
              ] as const).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPostTypeFilter(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                    postTypeFilter === item.id
                      ? 'bg-primary text-white'
                      : 'bg-background border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-center rounded-lg border border-border px-3 py-3"
              >
                <div>
                  {editingPostId === post.id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-foreground">{post.title}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {isReportCategory(post.category) ? 'Report' : 'Article'} • {post.category} • {post.author} • {post.views.toLocaleString()} views
                  </p>
                </div>

                <div>
                  {editingPostId === post.id ? (
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as 'published' | 'draft')}
                      className="bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        post.status === 'published'
                          ? 'bg-green-400/15 text-green-400'
                          : 'bg-amber-400/15 text-amber-400'
                      }`}
                    >
                      {post.status}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                  {editingPostId === post.id ? (
                    <button
                      onClick={() => savePostEdit(post)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                    >
                      <Icon name="CheckIcon" size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditPost(post)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                    >
                      <Icon name="PencilIcon" size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Icon name="TrashIcon" size={14} />
                  </button>
                </div>
              </div>
            ))}
            {filteredPosts.length === 0 && (
              <div className="rounded-lg border border-border px-3 py-8 text-center text-sm text-muted-foreground">
                No {postTypeFilter === 'all' ? 'content' : postTypeFilter} found.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
