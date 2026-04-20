import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function CTASection() {
  return (
    <section id="contact" className="py-16 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="relative rounded-2xl overflow-hidden border border-border/60 p-10 lg:p-16 text-center"
          style={{
            background: 'linear-gradient(135deg, #0F1929 0%, #0A0A0A 40%, #0D1A2E 100%)',
          }}
        >
          {/* Background decoration */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
              Work With Us
            </p>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground mb-4 leading-tight">
              Ready to make
              <br />
              <span className="gradient-text">data-driven decisions?</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed font-medium">
              Our research team is available for bespoke engagements, retainer relationships, and
              one-time project scopes. Response within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="mailto:research@thenerds.io"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg text-sm font-bold hover:bg-accent transition-all blue-glow"
              >
                <Icon name="EnvelopeIcon" size={16} />
                research@thenerds.io
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-white/5 hover:border-primary/50 transition-all"
              >
                Browse Insights
                <Icon name="ArrowRightIcon" size={14} />
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-border/40">
              {[
                { icon: 'ShieldCheckIcon', text: 'NDA-protected engagements' },
                { icon: 'ClockIcon', text: '24hr response SLA' },
                { icon: 'CheckBadgeIcon', text: 'Verified track record' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
                >
                  <Icon name={item.icon as 'ShieldCheckIcon'} size={14} className="text-primary" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
