import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchPublishedReports } from '@/lib/reports';

export const metadata: Metadata = {
  title: 'Forex Market Reports — The.Nerds | Currency Intelligence & Analysis',
  description:
    'Macro-driven Forex research reports: major and minor pair analysis, central bank policy insights, technical setups, and cross-border capital flow intelligence.',
  alternates: { canonical: '/reports/forex' },
  openGraph: {
    title: 'Forex Market Reports — The.Nerds',
    description: 'Macro-driven currency intelligence and Forex research reports.',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
};

const forexSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Forex Market Reports — The.Nerds',
  description: 'Macro-driven currency intelligence and Forex research reports.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4028'}/reports/forex`,
};

export default async function ForexReportsPage() {
  const reports = await fetchPublishedReports('forex');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(forexSchema) }}
      />
      <Header />
      <main className="min-h-screen bg-background pt-16">
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8" aria-label="Breadcrumb">
              <Link href="/reports" className="hover:text-foreground transition-colors">Reports</Link>
              <span>/</span>
              <span className="text-foreground">Forex Market</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-widest uppercase mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
                  Currency Markets
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
                  Forex Market Reports
                </h1>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                  Macro-driven currency intelligence, synced directly from your published dashboard reports.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{reports.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Reports</div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
            {reports.length} Reports Available
          </h2>

          {reports.length === 0 ? (
            <div className="rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
              No Forex reports are published yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report, i) => (
                <article
                  key={report.id}
                  className={`group bg-card border border-border rounded-2xl p-6 md:p-7 hover:border-primary/40 transition-all duration-300 fade-in-up fade-in-up-${Math.min(i + 1, 5)}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Forex</span>
                        <span className="text-xs text-muted-foreground ml-auto md:ml-0">
                          {report.date} · {report.readTime}
                        </span>
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors leading-snug">
                        {report.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {report.metaDescription}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs text-primary/80 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                          #{report.category}
                        </span>
                        <span className="text-xs text-muted-foreground/70 bg-background/60 border border-border/60 px-2 py-0.5 rounded-md">
                          Author: {report.author}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex md:flex-col items-center md:items-end gap-3 md:gap-2 md:pt-1">
                      <Link
                        href={`/blog/${report.slug}`}
                        className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/btn"
                      >
                        Read Report
                        <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="max-w-7xl mx-auto px-6 pb-16">
          <Link href="/reports" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to All Reports
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
