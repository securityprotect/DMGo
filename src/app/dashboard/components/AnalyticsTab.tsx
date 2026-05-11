'use client';
import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

const DmVolumeChart = dynamic(() => import('./charts/DmVolumeChart'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-muted rounded-2xl h-64 w-full" />
  ),
});

const SuccessRateChart = dynamic(() => import('./charts/SuccessRateChart'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-muted rounded-2xl h-64 w-full" />
  ),
});

const ResponseRateGauge = dynamic(() => import('./charts/ResponseRateGauge'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-muted rounded-2xl h-64 w-full" />
  ),
});

interface ActivityItem {
  id: string;
  keyword: string;
  status: 'sent' | 'failed' | 'queued' | 'rate-limited';
  createdAt: string;
}

export default function AnalyticsTab() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/activity');
      if (!res.ok) return;
      const data = await res.json();
      setActivity(data.activity || []);
    };
    void load();
  }, []);

  const analytics = useMemo(() => {
    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dmVolumeMap = new Map<string, { dms: number; failed: number; dayIndex: number }>();
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toDateString();
      dmVolumeMap.set(key, { dms: 0, failed: 0, dayIndex: d.getDay() });
    }

    const successMap = new Map<string, { total: number; sent: number; date: Date }>();
    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toDateString();
      successMap.set(key, { total: 0, sent: 0, date: d });
    }

    const keywordMap = new Map<string, { triggers: number; dms: number }>();
    let replied = 0;
    let totalWithOutcome = 0;

    activity.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const key = createdAt.toDateString();
      const isFailed = item.status === 'failed' || item.status === 'rate-limited';

      if (dmVolumeMap.has(key)) {
        const row = dmVolumeMap.get(key)!;
        if (item.status === 'sent') row.dms += 1;
        if (isFailed) row.failed += 1;
      }

      if (successMap.has(key)) {
        const row = successMap.get(key)!;
        if (item.status === 'sent' || isFailed) {
          row.total += 1;
          if (item.status === 'sent') row.sent += 1;
        }
      }

      const kw = (item.keyword || '').trim().toLowerCase();
      if (kw) {
        const current = keywordMap.get(kw) || { triggers: 0, dms: 0 };
        current.triggers += 1;
        if (item.status === 'sent') current.dms += 1;
        keywordMap.set(kw, current);
      }

      if (item.status === 'sent' || isFailed) {
        totalWithOutcome += 1;
        if (item.status === 'sent') replied += 1;
      }
    });

    const dmVolumeData = Array.from(dmVolumeMap.entries()).map(([, v]) => ({
      day: dayNames[v.dayIndex],
      dms: v.dms,
      failed: v.failed,
    }));

    const successData = Array.from(successMap.entries()).map(([, v]) => ({
      date: v.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rate: v.total ? Number(((v.sent / v.total) * 100).toFixed(1)) : 0,
    }));

    const topKeywords = Array.from(keywordMap.entries())
      .map(([keyword, v], idx) => ({
        id: `kw-${keyword}-${idx}`,
        keyword,
        triggers: v.triggers,
        dms: v.dms,
        rate: `${v.triggers ? ((v.dms / v.triggers) * 100).toFixed(1) : '0.0'}%`,
      }))
      .sort((a, b) => b.triggers - a.triggers)
      .slice(0, 5);

    const weeklyDms = dmVolumeData.reduce((sum, d) => sum + d.dms, 0);
    return { dmVolumeData, successData, topKeywords, weeklyDms, replied, totalWithOutcome };
  }, [activity]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                DM Volume — Last 7 Days
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Total outbound DMs per day
              </p>
            </div>
            <span className="badge-primary text-xs font-semibold px-2.5 py-1 rounded-xl">
              {analytics.weeklyDms.toLocaleString()} this week
            </span>
          </div>
          <DmVolumeChart data={analytics.dmVolumeData} />
        </div>

        <div className="card p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground">
              Response Rate
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              % of DM recipients who replied
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ResponseRateGauge replied={analytics.replied} total={analytics.totalWithOutcome} />
          </div>
        </div>
      </div>
      <div className="grid xl:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Success Rate Trend — 14 Days
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daily DM delivery success %
              </p>
            </div>
          </div>
          <SuccessRateChart data={analytics.successData} />
        </div>

        <div className="card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground">
              Top Keywords by Volume
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              This week — triggers fired and DMs sent
            </p>
          </div>
          <div className="flex flex-col gap-0 divide-y divide-border">
            {analytics.topKeywords?.map((kw, i) => (
              <div
                key={kw?.id}
                className="flex items-center gap-4 py-3 hover:bg-muted/30 transition-colors rounded-xl px-2"
              >
                <span className="text-xs font-bold text-muted-foreground w-5 tabular-nums">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-semibold text-primary">
                  #{kw?.keyword}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {kw?.triggers?.toLocaleString()} triggers
                </span>
                <span className="text-xs font-bold text-foreground tabular-nums">
                  {kw?.dms?.toLocaleString()} DMs
                </span>
                <span className="text-xs font-bold text-success">
                  {kw?.rate}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
