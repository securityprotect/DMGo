'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('viewer');

  const load = async () => {
    const res = await fetch('/api/team');
    if (!res.ok) return;
    const data = await res.json();
    setMembers(data.members || []);
  };

  useEffect(() => { void load(); }, []);

  const invite = async () => {
    const res = await fetch('/api/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name, role }) });
    if (!res.ok) return toast.error('Failed to invite');
    toast.success('Member invited');
    setEmail(''); setName(''); setRole('viewer');
    void load();
  };

  return <DashboardLayout><div className="card p-6 space-y-4"><h1 className="text-xl font-bold">Team Access</h1><div className="grid md:grid-cols-4 gap-3"><Input label="Name" value={name} onChange={(e) => setName(e.target.value)} /><Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><div><label className="text-sm font-semibold">Role</label><select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}><option value="viewer">Viewer</option><option value="editor">Editor</option><option value="admin">Admin</option></select></div><div className="flex items-end"><Button onClick={invite} fullWidth>Invite</Button></div></div><div className="space-y-2">{members.map((m) => <div key={m._id} className="rounded-xl border border-border p-3 flex items-center justify-between"><div><p className="font-medium">{m.name || 'Unnamed'}</p><p className="text-xs text-muted-foreground">{m.email}</p></div><div className="text-xs">{m.role} • {m.status}</div></div>)}</div></div></DashboardLayout>;
}
