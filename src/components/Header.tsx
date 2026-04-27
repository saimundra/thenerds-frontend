'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { clearTokens, isAuthenticated } from '@/lib/auth';

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Reports',
    dropdown: [
      {
        label: 'NEPSE',
        href: '/reports/nepse',
        description: 'Equity & macro intelligence',
      },
      { label: 'Forex', href: '/reports/forex', description: 'Landscape mapping' },
      { label: 'Smart Money Concepts', href: '/reports/smc', description: 'Quantitative modeling' },
    ],
  },
  {
    label: 'Articles',
    href: '/blog',
  },
  { label: 'About', href: '/homepage#about' },
  { label: 'Contact', href: '/homepage#contact' },
];

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const syncAuth = () => setAuthed(isAuthenticated());
    syncAuth();
    window.addEventListener('focus', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('focus', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const dashboardHref = authed ? '/blog-dashboard' : '/login?next=/blog-dashboard';

  const handleSignOut = () => {
    clearTokens();
    setAuthed(false);
    setProfileOpen(false);
    setMobileOpen(false);
    router.push('/login');
  };

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-border/60 py-0'
            : 'bg-transparent py-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand text */}
          <Link href="/homepage" className="flex items-center group">
            <span className="font-sans font-800 text-lg tracking-tight text-foreground">
              The<span className="text-primary">.</span>Nerds
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {item.href && !item.dropdown ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                    aria-expanded={activeDropdown === item.label}
                  >
                    {item.label}
                    <Icon
                      name="ChevronDownIcon"
                      size={14}
                      className={`transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}

                {/* Dropdown */}
                {item.dropdown && activeDropdown === item.label && (
                  <div
                    className="dropdown-menu absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="p-2">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="flex flex-col gap-0.5 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {sub.label}
                          </span>
                          {sub.description && (
                            <span className="text-xs text-muted-foreground">{sub.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={dashboardHref}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              Dashboard
            </Link>
            {authed && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
                  aria-label="Open profile menu"
                >
                  <Icon name="UserIcon" size={16} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-border bg-card shadow-2xl p-1.5">
                    <Link
                      href="/blog-dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-white/5"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Icon name="Squares2X2Icon" size={14} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-white/5"
                    >
                      <Icon name="ArrowRightStartOnRectangleIcon" size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
            <Link
              href="https://discord.com/invite/xJVmq7XYA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:bg-accent transition-colors"
            >
              Join the Community
              <Icon name="ArrowRightIcon" size={14} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <Icon name={mobileOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl md:hidden flex flex-col pt-16">
          <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.href && !item.dropdown ? (
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-base font-semibold text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-foreground"
                      onClick={() =>
                        setMobileExpanded(mobileExpanded === item.label ? null : item.label)
                      }
                    >
                      {item.label}
                      <Icon
                        name="ChevronDownIcon"
                        size={16}
                        className={`transition-transform ${mobileExpanded === item.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {mobileExpanded === item.label && item.dropdown && (
                      <div className="pl-4 space-y-1 pb-2">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
          <div className="px-6 pb-8 space-y-3">
            <Link
              href={dashboardHref}
              className="block w-full text-center py-3 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
            {authed && (
              <>
                <Link
                  href="/blog-dashboard"
                  className="block w-full text-center py-3 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-white/5 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-center py-3 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-white/5 transition-colors"
                >
                  Sign out
                </button>
              </>
            )}
            <Link
              href="https://discord.com/invite/xJVmq7XYA"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Join the Community
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
