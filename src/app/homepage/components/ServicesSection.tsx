'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

// BENTO GRID AUDIT
// Array has 4 cards: [MarketAnalysis, DataAnalytics, FinancialResearch, CompetitiveIntel]
// Row 1: [col-1-2: MarketAnalysis cs-2 rs-1] [col-3: DataAnalytics cs-1 rs-2]
// Row 2: [col-1: FinancialResearch cs-1 rs-1] [col-2: CompetitiveIntel cs-1 rs-1]
// Placed 4/4 cards ✓

const services = [
  {
    id: 'market-analysis',
    title: 'Market Analysis',
    description:
      'Sector-by-sector deep dives with quantitative models. We map total addressable markets, growth vectors, and structural shifts before they reach consensus.',
    tags: ['TAM/SAM/SOM', 'Sector Reports', 'Trend Forecasting'],
    stat: '340+ reports',
    statLabel: 'Published in 2025',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e1bd9a9e-1767142220757.png',
    imageAlt:
      'Data visualization dashboard showing market trend charts on dark monitors, atmospheric blue glow, professional trading environment',
    colSpan: 'lg:col-span-2',
    rowSpan: '',
    large: true,
  },
  {
    id: 'data-analytics',
    title: 'Smart money concept',
    description:
      'We focus on institutional trading logic — liquidity, order blocks, market structure, and manipulation zones',
    tags: ['market structure', 'liquidity', 'edge'],
    stat: '2.4B+',
    statLabel: 'Data points monthly',
    image: null,
    colSpan: 'lg:col-span-1',
    rowSpan: 'lg:row-span-2',
    large: false,
  },
  {
    id: 'financial-research',
    title: 'NEPSE',
    description:
      'We break down the Nepal Stock Exchange with a strategic lens — combining technical analysis, market sentiment, and trend behavior.',
    tags: ['equity', 'invest', 'earnings'],
    stat: '94.7%',
    statLabel: 'Forecast accuracy',
    image: null,
    colSpan: 'lg:col-span-1',
    rowSpan: '',
    large: false,
  },
  {
    id: 'competitive-intel',
    title: 'Forex',
    description:
      'From price action to macro understanding, we guide you through Forex with structured learning and real-world application',
    tags: ['rading', 'currency', 'winloss'],
    stat: '120+',
    statLabel: 'Industries covered',
    image: null,
    colSpan: 'lg:col-span-1',
    rowSpan: '',
    large: false,
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-16 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className={`flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 scroll-reveal ${visible ? '' : 'hidden-initial'}`}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
              What We Do
            </p>
            <h2 className="text-2xl lg:text-4xl font-extrabold text-foreground leading-tight">
              Research verticals
              <br className="hidden lg:block" /> built for precision.
            </h2>
          </div>
          <Link
            href="/homepage#contact"
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors shrink-0"
          >
            See all services <Icon name="ArrowRightIcon" size={14} />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card 1: MarketAnalysis — col-span-2 */}
          <div
            className={`lg:col-span-2 group relative rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-all duration-300 card-hover min-h-[320px] scroll-reveal ${visible ? '' : 'hidden-initial'}`}
            style={{ transitionDelay: '0.1s' }}
          >
            {services[0].image && (
              <>
                <AppImage
                  src={services[0].image}
                  alt={services[0].imageAlt!}
                  fill
                  className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
              </>
            )}
            <div className="relative z-10 p-7 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Icon name="ChartBarSquareIcon" size={20} className="text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-primary stat-counter">
                    {services[0].stat}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {services[0].statLabel}
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-8">
                <h3 className="text-xl font-extrabold text-foreground mb-2">{services[0].title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-md">
                  {services[0].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {services[0].tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-primary/10 text-primary rounded-md border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: DataAnalytics — col-span-1, row-span-2 */}
          <div
            className={`lg:col-span-1 lg:row-span-2 group relative rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-all duration-300 card-hover flex flex-col scroll-reveal ${visible ? '' : 'hidden-initial'}`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div className="p-7 flex-1 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                  <Icon name="CircleStackIcon" size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-extrabold text-foreground mb-2">{services[1].title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {services[1].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {services[1].tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-primary/10 text-primary rounded-md border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mini chart */}
              <div className="mt-6">
                <svg viewBox="0 0 200 80" className="w-full h-20" aria-hidden="true">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#008000" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#008000" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 70 L20 60 L40 65 L60 45 L80 50 L100 30 L120 35 L140 20 L160 25 L180 10 L200 15 L200 80 L0 80 Z"
                    fill="url(#areaGrad)"
                  />
                  <path
                    d="M0 70 L20 60 L40 65 L60 45 L80 50 L100 30 L120 35 L140 20 L160 25 L180 10 L200 15"
                    fill="none"
                    stroke="#008000"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-2xl font-extrabold text-primary stat-counter">
                    {services[1].stat}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide text-right">
                    {services[1].statLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: FinancialResearch — col-span-1 */}
          <div
            className={`lg:col-span-1 group relative rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-all duration-300 card-hover scroll-reveal ${visible ? '' : 'hidden-initial'}`}
            style={{ transitionDelay: '0.3s' }}
          >
            <div className="p-7 flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                  <Icon name="BanknotesIcon" size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-extrabold text-foreground mb-2">{services[2].title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {services[2].description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div>
                  <p className="text-xl font-extrabold text-primary stat-counter">
                    {services[2].stat}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {services[2].statLabel}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {services[2].tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: CompetitiveIntel — col-span-1 */}
          <div
            className={`lg:col-span-1 group relative rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-all duration-300 card-hover scroll-reveal ${visible ? '' : 'hidden-initial'}`}
            style={{ transitionDelay: '0.4s' }}
          >
            <div className="p-7 flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                  <Icon name="MagnifyingGlassIcon" size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-extrabold text-foreground mb-2">{services[3].title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {services[3].description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div>
                  <p className="text-xl font-extrabold text-primary stat-counter">
                    {services[3].stat}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {services[3].statLabel}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {services[3].tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
