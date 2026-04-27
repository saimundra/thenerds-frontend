import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchPublishedReports, type ReportCategoryKey } from '@/lib/reports';

export const metadata: Metadata = {
  title: 'Research Reports — The.Nerds | NEPSE, Forex & SMC Analysis',
  description: 'Institutional-grade research reports covering NEPSE market analysis, Forex intelligence, and Smart Money Concepts. Data-driven insights for serious investors.',
  alternates: { canonical: '/reports' },
  openGraph: {
    title: 'Research Reports — The.Nerds',
    description: 'Institutional-grade research reports covering NEPSE, Forex, and SMC markets.',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
};

const reportsSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Research Reports — The.Nerds',
  description: 'Institutional-grade research reports covering NEPSE, Forex, and SMC markets.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4028'}/reports`,
};

interface ReportCategory {
  id: string;
  key: ReportCategoryKey;
  href: string;
  tag: string;
  title: string;
  description: string;
  accent: string;
  accentBg: string;
  icon: React.ReactNode;
}

const categories: ReportCategory[] = [
  {
    id: 'nepse',
    key: 'nepse',
    href: '/reports/nepse',
    tag: 'Equity Markets',
    title: 'NEPSE Market Reports',
    description:
      'Comprehensive analysis of Nepal Stock Exchange — sector deep-dives, index forecasts, IPO assessments, and weekly market intelligence for institutional and retail investors.',
    accent: 'text-primary',
    accentBg: 'bg-primary/10 border-primary/20',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l4-4 3 3 4-5 4 4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 20h18M3 4h18" />
      </svg>
    ),
  },
  {
    id: 'forex',
    key: 'forex',
    href: '/reports/forex',
    tag: 'Currency Markets',
    title: 'Forex Market Reports',
    description:
      'Macro-driven currency intelligence spanning major, minor, and exotic pairs. Central bank policy analysis, technical setups, and cross-border capital flow tracking.',
    accent: 'text-primary',
    accentBg: 'bg-primary/10 border-primary/20',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 3c-2.5 2-4 5-4 9s1.5 7 4 9M12 3c2.5 2 4 5 4 9s-1.5 7-4 9M3 12h18" />
      </svg>
    ),
  },
  {
    id: 'smc',
    key: 'smc',
    href: '/reports/smc',
    tag: 'Smart Money Concepts',
    title: 'SMC Analysis Reports',
    description:
      'Institutional order flow, liquidity sweeps, order blocks, and fair value gap analysis. Decode where smart money is positioned before the crowd catches on.',
    accent: 'text-primary',
    accentBg: 'bg-primary/10 border-primary/20',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default async function ReportsPage() {
  const reportGroups = await Promise.all([
    fetchPublishedReports('nepse'),
    fetchPublishedReports('forex'),
    fetchPublishedReports('smc'),
  ]);

  const reportsByCategory: Record<ReportCategoryKey, ReturnType<typeof fetchPublishedReports> extends Promise<infer T> ? T : never> = {
    nepse: reportGroups[0],
    forex: reportGroups[1],
    smc: reportGroups[2],
  };

  const totalReports = reportGroups.reduce((sum, list) => sum + list.length, 0);
  const activeMarkets = reportGroups.filter((list) => list.length > 0).length;
  const latestGlobalDate = reportGroups.flat()[0]?.date ?? 'No reports yet';
  const stats = [
    { value: String(totalReports), label: 'Reports Published' },
    { value: String(activeMarkets), label: 'Active Markets' },
    { value: latestGlobalDate, label: 'Latest Update' },
    { value: 'Live', label: 'Source: Dashboard' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reportsSchema) }}
      />
      <Header />
      <main className="min-h-screen bg-background pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
                Research Intelligence
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-tight mb-5">
                Market Research{' '}
                <span className="gradient-text">Reports</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Institutional-grade research across Nepal's equity markets, global currency pairs, and smart money frameworks. Every report is built on quantitative data, not speculation.
              </p>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-b border-border/40 bg-card/30">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground stat-counter">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category Cards */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-10">
            Browse by Market
          </h2>
          {totalReports === 0 && (
            <div className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              No reports are published yet. Create and publish reports from the dashboard to see them here.
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              (() => {
                const scopedReports = reportsByCategory[cat.key];
                const latestDate = scopedReports[0]?.date ?? 'No reports yet';
                return (
              <Link
                key={cat.id}
                href={cat.href}
                className={`group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden card-hover fade-in-up fade-in-up-${i + 1}`}
              >
                {/* Top accent line */}
                <div className="h-0.5 w-full bg-gradient-to-r from-primary/70 to-primary" />

                <div className="p-7 flex flex-col flex-1">
                  {/* Icon + tag */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`p-3 rounded-xl border ${cat.accentBg} ${cat.accent}`}>
                      {cat.icon}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.accentBg} ${cat.accent}`}>
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                    {cat.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: 'Reports', value: String(scopedReports.length) },
                      { label: 'Latest', value: scopedReports.length > 0 ? 'Live' : '--' },
                      { label: 'Status', value: scopedReports.length > 0 ? 'Active' : 'Empty' },
                    ].map((m) => (
                      <div key={m.label} className="bg-background/60 rounded-lg p-2.5 text-center">
                        <div className={`text-lg font-bold ${cat.accent}`}>{m.value}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/60">
                    <span className="text-xs text-muted-foreground">Latest: {latestDate}</span>
                    <span className={`text-sm font-semibold ${cat.accent} flex items-center gap-1.5 group-hover:gap-2.5 transition-all`}>
                      View Reports
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
                );
              })()
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/40 bg-card/20">
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Need a custom research brief?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Our analysts deliver bespoke reports tailored to your portfolio, sector focus, or investment thesis.
            </p>
            <Link
              href="/homepage#contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-lg text-sm font-semibold hover:bg-accent transition-colors"
            >
              Request Custom Report
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
