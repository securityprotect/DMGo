'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DashboardLayout from '../components/DashboardLayout';
import Button from '@/components/ui/Button';

interface InstagramAccountItem {
  _id: string;
  username: string;
  igUserId: string;
  accountType: string;
  createdAt: string;
}

export default function InstagramAccountsPage() {
  const [accounts, setAccounts] = useState<InstagramAccountItem[]>([]);
  const [unlinkingId, setUnlinkingId] = useState('');

  const loadAccounts = async () => {
    const res = await fetch('/api/instagram/accounts');
    if (!res.ok) return;
    const data = await res.json();
    setAccounts(data.accounts || []);
  };

  useEffect(() => {
    void loadAccounts();
  }, []);

  const unlinkAccount = async (id: string, username: string) => {
    const ok = window.confirm(`Unlink @${username} from DmGo? You can reconnect it anytime.`);
    if (!ok) return;

    setUnlinkingId(id);
    const res = await fetch(`/api/instagram/accounts/${id}`, { method: 'DELETE' });
    setUnlinkingId('');
    if (!res.ok) {
      toast.error('Failed to unlink Instagram account');
      return;
    }

    toast.success(`Unlinked @${username}`);
    await loadAccounts();
  };

  return (
    <DashboardLayout>
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Instagram Accounts</h1>
          <Button onClick={() => (window.location.href = '/dashboard')}>Connect New</Button>
        </div>

        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No connected Instagram account yet.</p>
        ) : (
          <div className="space-y-3">
            {accounts.map((a) => (
              <div key={a._id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">@{a.username}</p>
                    <p className="text-xs text-muted-foreground">IG User ID: {a.igUserId}</p>
                    <p className="text-xs text-muted-foreground">Type: {a.accountType}</p>
                    <p className="text-xs text-muted-foreground">
                      Connected: {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={unlinkingId === a._id}
                    loadingLabel="Unlinking"
                    onClick={() => void unlinkAccount(a._id, a.username)}
                  >
                    Unlink
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

