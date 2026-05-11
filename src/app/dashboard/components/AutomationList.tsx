'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Badge from '@/components/ui/Badge';
import Toggle from '@/components/ui/Toggle';
import Button from '@/components/ui/Button';
import { Plus, Trash2, MessageCircle, Clock, Hash, Pencil } from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  account: string;
  reelUrl: string;
  reelId: string;
  reelCaption: string;
  commentReplyTemplate: string;
  replyTemplate: string;
  replyMode: 'comment_and_dm' | 'dm_only';
  keywords: string[];
  sendDm: boolean;
  delaySeconds: number;
  dmsSent: number;
  successRate: number;
  status: 'active' | 'paused' | 'draft';
  cooldown: number;
  lastFired: string;
}

const statusBadge = (status: Automation['status']) => {
  if (status === 'active') return <Badge variant="success" dot>Active</Badge>;
  if (status === 'paused') return <Badge variant="warning" dot>Paused</Badge>;
  return <Badge variant="muted" dot>Draft</Badge>;
};

export default function AutomationList({ onNew, onEdit }: { onNew: () => void; onEdit: (automation: Automation) => void }) {
  const [automations, setAutomations] = useState<Automation[]>([]);

  const loadAutomations = async () => {
    const res = await fetch('/api/automations');
    if (!res.ok) return;
    const data = await res.json();
    setAutomations(data.automations || []);
  };

  useEffect(() => { void loadAutomations(); }, []);

  const handleToggle = async (id: string, checked: boolean) => {
    setAutomations((prev) => prev.map((a) => a.id === id ? { ...a, status: checked ? 'active' : 'paused' } : a));
    await fetch(`/api/automations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: checked ? 'active' : 'paused' }) });
    toast.success(`Automation ${checked ? 'activated' : 'paused'} successfully`);
  };

  const handleDelete = async (id: string, name: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/automations/${id}`, { method: 'DELETE' });
    toast.success(`"${name}" deleted`);
  };

  return <div className="card overflow-hidden"><div className="flex items-center justify-between px-5 py-4 border-b border-border"><div>
    <h2 className="text-base font-bold text-foreground">Automations</h2>
    <p className="text-xs text-muted-foreground mt-0.5">{automations.filter((a) => a.status === 'active').length} active of {automations.length} total</p>
  </div><Button size="sm" leftIcon={<Plus size={14} />} onClick={onNew}>New Automation</Button></div>
  <div className="divide-y divide-border">{automations.map((auto) => <div key={auto.id} className="px-5 py-4">
    <div className="flex items-start gap-4"><div className="flex-1 min-w-0"><div className="flex items-center gap-2.5 flex-wrap mb-2"><span className="text-sm font-bold text-foreground truncate">{auto.name}</span>{statusBadge(auto.status)}</div>
    <div className="flex items-center gap-4 flex-wrap mb-2.5"><span className="text-xs text-muted-foreground">{auto.account}</span><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock size={12} />{auto.cooldown}h cooldown</span><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><MessageCircle size={12} />{auto.dmsSent.toLocaleString()} DMs</span></div>
    <div className="flex items-center gap-1.5 flex-wrap mb-2.5">{auto.keywords.map((kw) => <span key={`${auto.id}-kw-${kw}`} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-light text-primary text-xs font-semibold rounded-lg"><Hash size={10} />{kw}</span>)}</div>
    </div><div className="flex flex-col items-end gap-3 shrink-0"><Toggle checked={auto.status === 'active'} onChange={(checked) => handleToggle(auto.id, checked)} disabled={auto.status === 'draft'} size="sm" />
    <div className="flex items-center gap-1">
      <button className="btn-ghost p-1.5 rounded-lg text-muted-foreground hover:text-primary" onClick={() => onEdit(auto)} aria-label={`Edit ${auto.name}`}><Pencil size={14} /></button>
      <button className="btn-ghost p-1.5 rounded-lg text-muted-foreground hover:text-danger" onClick={() => handleDelete(auto.id, auto.name)} aria-label={`Delete ${auto.name}`}><Trash2 size={14} /></button>
    </div></div></div>
  </div>)}</div></div>;
}
