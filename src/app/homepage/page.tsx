import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import CredibilityStats from './components/CredibilityStats';
import ServicesSection from './components/ServicesSection';
import InsightsPreview from './components/InsightsPreview';
import CTASection from './components/CTASection';

export const metadata: Metadata = {
  title: 'The.Nerds — Market Research & Data Analytics',
  description:
    'Institutional-grade market research and data analytics. The.Nerds decodes financial markets with quantitative intelligence for investors and enterprises.',
  alternates: {
    canonical: '/homepage',
  },
  openGraph: {
    title: 'The.Nerds — Market Research & Data Analytics',
    description: 'Institutional-grade market research and data analytics.',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The.Nerds',
  description: 'Market research and data analytics firm delivering financial intelligence.',
  url: 'http://localhost:3000/homepage',
  logo: 'https://img.rocket.new/generatedImages/rocket_gen_img_1487111c6-1766510267496.png',
  sameAs: [],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'The.Nerds — Market Research & Data Analytics',
  description: 'Institutional-grade market research and data analytics.',
  url: 'http://localhost:3000/homepage',
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'The.Nerds Research Services',
  description: 'Market analysis, financial research, and competitive intelligence.',
  provider: { '@type': 'Organization', name: 'The.Nerds' },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <Header />
      <main>
        <HeroSection />
        <CredibilityStats />
        <ServicesSection />
        <InsightsPreview />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
