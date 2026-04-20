import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    redirect('/login?next=/admin-panel');
  }

  return <>{children}</>;
}
