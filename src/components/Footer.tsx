'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { isAuthenticated } from '@/lib/auth';

export default function Footer() {
  const [authed, setAuthed] = React.useState(false);

  React.useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  const dashboardHref = authed ? '/blog-dashboard' : '/login?next=/blog-dashboard';

  return (
    <footer className="border-t border-border/50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Brand */}
          <Link href="/homepage" className="flex items-center gap-2.5">
            <span className="font-sans font-bold text-base tracking-tight text-foreground">
              The<span className="text-primary">.</span>Nerds
            </span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <Link
              href="/homepage"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Insights
            </Link>
            <Link
              href="/homepage#services"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </Link>
            <Link
              href="/homepage#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/homepage#contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link
              href={dashboardHref}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          {/* Social + Copyright */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Twitter"
              className="text-muted-foreground hover:text-primary transition-colors p-1.5"
            >
              <Icon name="GlobeAltIcon" size={18} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-primary transition-colors p-1.5"
            >
              <Icon name="LinkIcon" size={18} />
            </a>
            <span className="text-xs text-muted-foreground ml-2">© 2026 The.Nerds</span>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/60">
            join/learn/trade . Not financial advice
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/homepage"
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/homepage"
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
