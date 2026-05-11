'use client';
import React, { useEffect, useState } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { RefreshCw, RotateCcw, Filter, Activity, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type ActivityStatus = 'sent' | 'failed' | 'queued' | 'rate-limited';
interface ActivityItem { id: string; username: string; account: string; automation: string; keyword: string; dmPreview: string; status: ActivityStatus; timestamp: string; retries: number; failReason?: string; }

const filterOptions: { id: string; label: string; value: ActivityStatus | 'all' }[] = [
  { id: 'filter-all', label: 'All', value: 'all' },
  { id: 'filter-sent', label: 'Sent', value: 'sent' },
  { id: 'filter-queued', label: 'Queued', value: 'queued' },
  { id: 'filter-failed', label: 'Failed', value: 'failed' },
  { id: 'filter-rate', label: 'Rate Limited', value: 'rate-limited' },
];

export default function LiveActivityTab() {
  const [filter, setFilter] = useState<ActivityStatus | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/activity');
    if (res.ok) {
      const data = await res.json();
      setActivity(data.activity || []);
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);
  useEffect(() => {
    const interval = setInterval(() => { void load(); }, 15000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === 'all' ? activity : activity.filter((a) => a.status === filter);
  const failedCount = activity.filter((a) => a.status === 'failed' || a.status === 'rate-limited').length;

  const handleRetry = async (id: string, username: string) => {
    await fetch(`/api/activity/retry/${id}`, { method: 'POST' });
    toast.success(`Retry queued for ${username}`);
    void load();
  };

  const handleRetryAll = async () => {
    await fetch('/api/activity/retry-all', { method: 'POST' });
    toast.success(`Retry queued for ${failedCount} item(s)`);
    void load();
  };

  const handleClear = async () => {
    const confirmed = window.confirm('Clear all live activity logs? This cannot be undone.');
    if (!confirmed) return;
    const res = await fetch('/api/activity', { method: 'DELETE' });
    if (!res.ok) return toast.error('Failed to clear activity');
    toast.success('Activity data cleared');
    setActivity([]);
  };

  return <div className="card overflow-hidden"><div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border flex-wrap"><div><h2 className="text-base font-bold text-foreground">Live Activity Feed</h2><p className="text-xs text-muted-foreground mt-0.5">Real-time DM log - {activity.length} events</p></div><div className="flex items-center gap-2">{failedCount > 0 && <Button variant="danger" size="sm" leftIcon={<RotateCcw size={13} />} onClick={handleRetryAll}>Retry {failedCount} failed</Button>}<Button variant="ghost" size="sm" leftIcon={<Trash2 size={14} />} onClick={() => void handleClear()}>Clear Data</Button><Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />} onClick={() => void load()} loading={loading}>Refresh</Button></div></div>
  <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30 overflow-x-auto scrollbar-hide"><Filter size={14} className="text-muted-foreground shrink-0" />
  <div className="flex items-center gap-1.5">{filterOptions.map((opt) => <button key={opt.id} onClick={() => setFilter(opt.value)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${filter === opt.value ? 'bg-primary text-white' : 'bg-white border border-border text-muted-foreground'}`}>{opt.label}</button>)}</div></div>
  {loading ? <div className="divide-y divide-border">{Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}</div> : filtered.length === 0 ? <div className="py-16 flex flex-col items-center gap-3 text-center px-6"><Activity size={22} className="text-muted-foreground" /><p className="text-sm font-bold text-foreground">No activity yet</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[700px]"><thead><tr className="border-b border-border bg-muted/30">{['User','Account','Automation','Keyword','Status','Time','Retries',''].map((col) => <th key={col} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{col}</th>)}</tr></thead><tbody className="divide-y divide-border">{filtered.map((item) => <tr key={item.id}><td className="px-4 py-3 text-sm font-semibold">{item.username}</td><td className="px-4 py-3 text-xs">{item.account}</td><td className="px-4 py-3 text-xs">{item.automation}</td><td className="px-4 py-3 text-xs">#{item.keyword}</td><td className="px-4 py-3"><Badge variant={item.status === 'sent' ? 'success' : item.status === 'queued' ? 'info' : item.status === 'rate-limited' ? 'warning' : 'danger'} dot>{item.status}</Badge></td><td className="px-4 py-3 text-xs">{item.timestamp}</td><td className="px-4 py-3 text-xs">{item.retries}</td><td className="px-4 py-3">{(item.status === 'failed' || item.status === 'rate-limited') && <button onClick={() => void handleRetry(item.id, item.username)} className="btn-ghost p-1.5"><RotateCcw size={14} /></button>}</td></tr>)}</tbody></table></div>}
  </div>;
}
