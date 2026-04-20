'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const floatingStats = [
  { label: 'Reports Published', value: '1,240+', icon: 'DocumentChartBarIcon' },
  { label: 'Accuracy Rate', value: '94.7%', icon: 'ChartBarIcon' },
];

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      opacity: number;
      size: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.05,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Particle canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(37,99,235,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(59,130,246,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center py-20 relative z-10">
        {/* Left: Typography */}
        <div className="lg:col-span-7 space-y-8">
          {/* Eyebrow */}
          <div className="fade-in-up fade-in-up-1 flex items-center gap-3">
            <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Market Intelligence · Data Analytics · Financial Research
            </span>
          </div>

          {/* H1 */}
          <h1 className="fade-in-up fade-in-up-2 hero-text font-extrabold text-foreground">
            We
            <br />
            <span className="gradient-text">Decode</span>
            <br />
            Markets.
          </h1>

          <p className="fade-in-up fade-in-up-3 text-lg text-muted-foreground leading-relaxed max-w-lg font-medium">
            Institutional-grade research and quantitative analytics. We turn raw market data into
            decisions that move capital.
          </p>

          {/* CTAs */}
          <div className="fade-in-up fade-in-up-4 flex flex-wrap items-center gap-4">
            <Link
              href="/blog"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-lg text-sm font-bold hover:bg-accent transition-all blue-glow"
            >
              Read Our Research
              <Icon name="ArrowRightIcon" size={16} />
            </Link>
            <Link
              href="/homepage#services"
              className="flex items-center gap-2 border border-border text-foreground px-7 py-3.5 rounded-lg text-sm font-semibold hover:bg-white/5 hover:border-primary/50 transition-all"
            >
              Our Services
            </Link>
          </div>

          {/* Floating stat chips */}
          <div className="fade-in-up fade-in-up-5 flex flex-wrap gap-4 pt-2">
            {floatingStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-2.5 card-hover"
              >
                <Icon
                  name={stat.icon as 'DocumentChartBarIcon'}
                  size={16}
                  className="text-primary"
                />
                <div>
                  <p className="text-base font-bold text-foreground stat-counter">{stat.value}</p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image panel */}
        <div className="lg:col-span-5 relative fade-in-up fade-in-up-3">
          <div className="relative rounded-2xl overflow-hidden border border-border/60 aspect-[4/5] shimmer">
            <AppImage
              src="https://img.rocket.new/generatedImages/rocket_gen_img_17592cde9-1767269946295.png"
              alt="Financial data analyst reviewing market charts on multiple screens in dimly lit office, dark blue glow, atmospheric shadows"
              fill
              className="object-cover grayscale brightness-75"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />

            {/* Overlay card */}
            <div className="absolute bottom-6 left-6 right-6 bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Live Signal
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-primary">
                  <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  Active
                </span>
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-2xl font-extrabold text-foreground stat-counter">+18.3%</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Portfolio Alpha · Q1 2026
                  </p>
                </div>
                <svg viewBox="0 0 120 40" className="flex-1 h-10" aria-hidden="true">
                  <path
                    d="M0 35 Q15 30 30 32 T60 20 T90 12 T120 5"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <path
                    d="M0 35 Q15 30 30 32 T60 20 T90 12 T120 5 L120 40 L0 40 Z"
                    fill="url(#chartGrad)"
                    opacity="0.2"
                  />

                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Decorative element */}
          <div
            className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(37,99,235,0.15)' }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50 z-10">
        <span className="text-[10px] font-medium uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
    </section>
  );
}
