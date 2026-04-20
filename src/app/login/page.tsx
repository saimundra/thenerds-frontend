import React, { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background pt-24 px-6 pb-10">
          <div className="max-w-md mx-auto rounded-2xl border border-border bg-card p-7 sm:p-8 shadow-xl text-sm text-muted-foreground">
            Loading login form...
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
