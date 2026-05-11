'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, CheckCircle2, Zap, Reply, AlertTriangle, Activity as ActivityIcon, TrendingUp, TrendingDown } from 'lucide-react';

type ActivityStatus = 'sent' | 'failed' | 'queued' | 'rate-limited';
interface ActivityItem { status: ActivityStatus; }
interface AutomationItem { status: 'active' | 'paused' | 'draft'; dmsSent?: number; successRate?: number; }

interface KpiCardProps {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  trend?: { direction: 'up' | 'down'; value: string; label: string };
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  colSpan?: 'col-span-1' | 'col-span-2';
}

const variantStyles: Record<string, { card: string; icon: string; value: string }> = {
  default: { card: 'bg-white border-border', icon: 'bg-muted text-primary', value: 'text-foreground' },
  primary: { card: 'bg-primary-light/50 border-primary/20', icon: 'gradient-primary text-white', value: 'text-primary' },
  success: { card: 'bg-success/5 border-success/20', icon: 'bg-success/15 text-green-700', value: 'text-green-700' },
  warning: { card: 'bg-warning/5 border-warning/20', icon: 'bg-warning/15 text-amber-700', value: 'text-amber-700' },
  danger: { card: 'bg-danger/5 border-danger/20', icon: 'bg-danger/15 text-red-700', value: 'text-red-700' },
};

function KpiCard({ label, value, subValue, trend, icon, variant = 'default', colSpan = 'col-span-1' }: KpiCardProps) {
  const styles = variantStyles[variant];
  return <div className={`rounded-2xl border p-5 flex flex-col gap-3 shadow-card ${styles.card} ${colSpan}`}><div className="flex items-center justify-between"><p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p><div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${styles.icon}`}>{icon}</div></div><div><p className={`text-3xl font-extrabold tabular-nums ${styles.value}`}>{value}</p>{subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}</div>{trend && <div className="flex items-center gap-1.5">{trend.direction === 'up' && variant !== 'danger' ? <TrendingUp size={13} className="text-success" /> : <TrendingDown size={13} className="text-danger" />}<span className={`text-xs font-bold ${variant === 'danger' ? 'text-danger' : 'text-success'}`}>{trend.value}</span><span className="text-xs text-muted-foreground">{trend.label}</span></div>}</div>;
}

export default function KpiGrid() {
  const [automations, setAutomations] = useState<AutomationItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const [aRes, actRes] = await Promise.all([fetch('/api/automations'), fetch('/api/activity')]);
      if (aRes.ok) setAutomations((await aRes.json()).automations || []);
      if (actRes.ok) setActivity((await actRes.json()).activity || []);
    };
    void load();
  }, []);

  const kpiData: KpiCardProps[] = useMemo(() => {
    const sentToday = activity.filter((x) => x.status === 'sent').length;
    const failures = activity.filter((x) => x.status === 'failed' || x.status === 'rate-limited').length;
    const queued = activity.filter((x) => x.status === 'queued').length;
    const active = automations.filter((a) => a.status === 'active').length;
    const paused = automations.filter((a) => a.status === 'paused').length;
    const draft = automations.filter((a) => a.status === 'draft').length;
    const avgSuccess = automations.length ? (automations.reduce((s, a) => s + (a.successRate || 0), 0) / automations.length) : 0;
    return [
      { id: 'kpi-dms-sent', label: 'DMs Sent Today', value: sentToday.toLocaleString(), subValue: `${activity.length.toLocaleString()} events`, icon: <MessageCircle size={20} />, variant: 'primary', colSpan: 'col-span-2' },
      { id: 'kpi-success-rate', label: 'Success Rate', value: `${avgSuccess.toFixed(1)}%`, subValue: 'From your automations', icon: <CheckCircle2 size={20} />, variant: 'success' },
      { id: 'kpi-active-automations', label: 'Active Automations', value: String(active), subValue: `${paused} paused, ${draft} draft`, icon: <Zap size={20} />, variant: 'default' },
      { id: 'kpi-response-rate', label: 'Queued', value: String(queued), subValue: 'Pending sends', icon: <Reply size={20} />, variant: 'default' },
      { id: 'kpi-failures', label: 'Failures Today', value: String(failures), subValue: 'Check Live Activity tab', icon: <AlertTriangle size={20} />, variant: failures > 0 ? 'danger' : 'success' },
      { id: 'kpi-triggers-fired', label: 'Triggers Fired', value: String(activity.length), subValue: 'From webhook/activity logs', icon: <ActivityIcon size={20} />, variant: 'default' },
    ];
  }, [automations, activity]);

  return <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">{kpiData.map((kpi) => <KpiCard key={kpi.id} {...kpi} />)}</div>;
}
