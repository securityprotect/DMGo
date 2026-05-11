import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center gradient-bg-dream rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 depth-grid opacity-60" />
      <div className="glass-card rounded-2xl px-8 py-7 flex items-center gap-4 relative z-10">
        <div className="loader-orbit">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Loading dashboard</p>
          <p className="text-xs text-muted-foreground">Syncing automation and account data</p>
        </div>
      </div>
    </div>
  );
}
