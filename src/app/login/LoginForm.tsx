'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { clearTokens, setTokens } from '@/lib/auth';
import { apiFetch, getApiBaseUrl, getReadableError } from '@/lib/api';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

interface MeResponse {
  can_manage_users: boolean;
  can_manage_posts: boolean;
}

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = searchParams.get('next') || '';

  const getRedirectPath = (me: MeResponse) => {
    const requestedPath = nextPath.startsWith('/') ? nextPath : '';

    const canOpenAdmin =
      requestedPath.startsWith('/nerdsadmin') || requestedPath.startsWith('/admin-panel');
    if (canOpenAdmin && me.can_manage_users) {
      return requestedPath;
    }

    const canOpenBlogDashboard = requestedPath.startsWith('/blog-dashboard');
    if (canOpenBlogDashboard && me.can_manage_posts) {
      return requestedPath;
    }

    if (me.can_manage_users) {
      return '/nerdsadmin';
    }

    if (me.can_manage_posts) {
      return '/blog-dashboard';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password.');
      }

      const data = (await response.json()) as { access: string; refresh: string };
      setTokens(data.access, data.refresh);

      const me = (await apiFetch('/auth/me/')) as MeResponse;
      const redirectPath = getRedirectPath(me);

      if (!redirectPath) {
        clearTokens();
        throw new Error('Your account does not have dashboard access. Please contact an admin.');
      }

      router.push(redirectPath);
    } catch (err) {
      setError(getReadableError(err, 'Login failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-24 px-6 pb-10">
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl border border-border bg-card p-7 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <AppLogo size={34} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Dashboard
              </p>
              <h1 className="text-xl font-extrabold text-foreground">Sign in to The.Nerds</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 pr-11 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={18} />
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-accent transition-colors disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              <Icon name="ArrowRightIcon" size={14} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
