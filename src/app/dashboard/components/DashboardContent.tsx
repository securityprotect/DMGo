'use client';
import React, { useEffect, useState } from 'react';
import KpiGrid from './KpiGrid';
import ConnectInstagramBanner from './ConnectInstagramBanner';
import DashboardTabs from './DashboardTabs';

export default function DashboardContent() {
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(false);

  useEffect(() => {
    let active = true;
    const hardStop = setTimeout(() => {
      if (active) setCheckingConnection(false);
    }, 2500);
    const load = async () => {
      if (active) setCheckingConnection(true);
      try {
        const res = await Promise.race([
          fetch('/api/instagram/accounts', {
            cache: 'no-store',
            credentials: 'same-origin',
          }),
          new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('accounts_fetch_timeout')), 8000)),
        ]);
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setInstagramConnected((data.accounts || []).length > 0);
          }
        }
      } catch {
        if (active) {
          setInstagramConnected(false);
        }
      } finally {
        if (active) {
          setCheckingConnection(false);
        }
      }
    };
    void load();
    return () => {
      active = false;
      clearTimeout(hardStop);
    };
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
