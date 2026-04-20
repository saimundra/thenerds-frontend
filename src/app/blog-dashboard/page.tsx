import React from 'react';
import type { Metadata } from 'next';
import DashboardLayout from './components/DashboardLayout';

export const metadata: Metadata = {
  title: 'Blog Dashboard — The.Nerds',
  description: 'Manage research articles, SEO settings, and content for The.Nerds blog.',
  robots: { index: false, follow: false },
};

export default function BlogDashboardPage() {
  return <DashboardLayout />;
}
