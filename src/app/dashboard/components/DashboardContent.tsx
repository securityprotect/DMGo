'use client';
import React, { useEffect, useState } from 'react';
import KpiGrid from './KpiGrid';
import ConnectInstagramBanner from './ConnectInstagramBanner';
import DashboardTabs from './DashboardTabs';

export default function DashboardContent() {
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/instagram/accounts');
      if (res.ok) {
        const data = await res.json();
        setInstagramConnected((data.accounts || []).length > 0);
      }
      setCheckingConnection(false);
    };
    void load();
  }, []);

  if (checkingConnection) {
    return (
      <div className="min-h-[55vh] flex items-center justify-center">
        <div className="glass-card rounded-2xl px-7 py-6 flex items-center gap-4">
          <div className="loader-orbit">
            <span />
            <span />
            <span />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Loading workspace</p>
            <p className="text-xs text-muted-foreground">Checking connected Instagram account</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Live data from your connected account and automations.</p>
        </div>
      </div>
      {!instagramConnected && <ConnectInstagramBanner />}
      <KpiGrid />
      <DashboardTabs />
    </div>
  );
}
