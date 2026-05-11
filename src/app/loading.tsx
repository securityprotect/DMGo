import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg-dream relative overflow-hidden">
      <div className="absolute inset-0 depth-grid opacity-70" />
      <div className="absolute top-16 left-24 w-48 h-48 rounded-full blob-primary float-soft" />
      <div className="absolute bottom-16 right-24 w-52 h-52 rounded-full blob-accent float-soft" />
      <div className="glass-card rounded-3xl px-10 py-9 flex flex-col items-center gap-4 animate-scale-in relative z-10">
        <div className="loader-orbit">
          <span />
          <span />
          <span />
        </div>
        <p className="text-sm font-semibold text-foreground">Preparing your workspace</p>
      </div>
    </div>
  );
}
