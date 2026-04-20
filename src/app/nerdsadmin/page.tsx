import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminPanelPage from '@/app/admin-panel/page';

export default async function NerdsAdminPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    redirect('/login?next=/nerdsadmin');
  }

  return <AdminPanelPage />;
}
