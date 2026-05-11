'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';

export default function HelpSupportPage() {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch('/api/support/tickets');
    if (!res.ok) return;
    const data = await res.json();
    setTickets(data.tickets || []);
  };

  useEffect(() => { void load(); }, []);

  const createTicket = async () => {
    const res = await fetch('/api/support/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, category, priority, message }) });
    if (!res.ok) return toast.error('Ticket creation failed');
    toast.success('Ticket logged successfully');
    setSubject(''); setMessage(''); setCategory('general'); setPriority('medium');
    void load();
  };

  return <DashboardLayout><div className="space-y-6"><div className="card p-6 space-y-4"><h1 className="text-xl font-bold">Help & Support</h1><div className="grid md:grid-cols-3 gap-4"><Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} /><div><label className="text-sm font-semibold">Category</label><select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}><option value="general">General</option><option value="billing">Billing</option><option value="instagram">Instagram</option><option value="technical">Technical</option></select></div><div><label className="text-sm font-semibold">Priority</label><select className="input-field" value={priority} onChange={(e) => setPriority(e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div></div><div><label className="text-sm font-semibold">Message</label><textarea className="input-field min-h-32" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue in detail..." /></div><Button onClick={createTicket}>Log Ticket</Button></div><div className="card p-6"><h2 className="text-lg font-bold mb-3">My Tickets</h2><div className="space-y-2">{tickets.map((t) => <div key={t._id} className="rounded-xl border border-border p-3"><div className="flex items-center justify-between"><p className="font-semibold">{t.subject}</p><span className="text-xs">{t.status}</span></div><p className="text-xs text-muted-foreground">{t.category} • {t.priority}</p><p className="text-sm mt-1">{t.message}</p></div>)}{tickets.length === 0 && <p className="text-sm text-muted-foreground">No tickets yet.</p>}</div></div></div></DashboardLayout>;
}
