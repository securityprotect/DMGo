import React, { Suspense } from 'react';
import AuthCard from './components/AuthCard';
import AuthBrand from './components/AuthBrand';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex relative">
      <AuthBrand />
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative z-20 pointer-events-auto">
        <Suspense fallback={null}>
          <AuthCard />
        </Suspense>
      </div>
    </div>
  );
}
