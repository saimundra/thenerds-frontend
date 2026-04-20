import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function BlogDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!accessToken && !refreshToken) {
    redirect('/login?next=/blog-dashboard');
  }

  return <>{children}</>;
}
