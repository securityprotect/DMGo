import React from 'react';
import AuthCard from './components/AuthCard';
import AuthBrand from './components/AuthBrand';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex">
      <AuthBrand />
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <AuthCard />
      </div>
    </div>
  );
}