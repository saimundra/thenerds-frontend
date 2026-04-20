'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const stats = [
  {
    value: 1240,
    suffix: '+',
    label: 'Research Reports',
    description: 'Published since 2019',
    icon: 'DocumentChartBarIcon',
  },
  {
    value: 94.7,
    suffix: '%',
    label: 'Forecast Accuracy',
    description: 'Verified 12-month track record',
    icon: 'ChartBarIcon',
    decimal: true,
  },
  {
    value: 380,
    suffix: '+',
    label: 'Enterprise Clients',
    description: 'Across 28 industries',
    icon: 'BuildingOffice2Icon',
  },
  {
    value: 2.4,
    suffix: 'B',
    label: 'Data Points Processed',
    description: 'Monthly across all models',
    icon: 'CircleStackIcon',
    decimal: true,
  },
];

function useCountUp(target: number, duration: number, start: boolean, decimal: boolean) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(parseFloat((eased * target).toFixed(decimal ? 1 : 0)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration, decimal]);
  return current;
}

function StatCard({ stat, animate }: { stat: (typeof stats)[0]; animate: boolean }) {
  const count = useCountUp(stat.value, 1800, animate, stat.decimal ?? false);

  return (
    <div className="group relative p-6 lg:p-8 border border-border rounded-xl bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 card-hover overflow-hidden">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name={stat.icon as 'DocumentChartBarIcon'} size={20} className="text-primary" />
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
        </div>
        <p className="text-3xl lg:text-4xl font-extrabold text-foreground stat-counter mb-1">
          {count}
          {stat.suffix}
        </p>
        <p className="text-sm font-semibold text-foreground/80 mb-1">{stat.label}</p>
        <p className="text-xs text-muted-foreground font-medium">{stat.description}</p>
      </div>
    </div>
  );
}

export default function CredibilityStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimate(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-16 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
              By the Numbers
            </p>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground">
              Research you can quantify.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Every claim we make is backed by verifiable data and transparent methodology.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  );
}
