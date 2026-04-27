import React from 'react';
import type { Metadata } from 'next';
import DashboardLayout from './components/DashboardLayout';

export const metadata: Metadata = {
  title: 'Content Dashboard — The.Nerds',
  description: 'Manage research articles, reports, SEO settings, and publishing workflows.',
  robots: { index: false, follow: false },
};

export default function BlogDashboardPage() {
  return <DashboardLayout />;
}
