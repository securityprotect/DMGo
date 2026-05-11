'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return;
      const data = await res.json();
      setName(data.user?.name || '');
      setEmail(data.user?.email || '');
    };
    void load();
  }, []);

  const saveProfile = async () => {
    const res = await fetch('/api/settings/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email }) });
    if (!res.ok) return toast.error('Profile update failed');
    toast.success('Profile updated');
  };

  const changePassword = async () => {
    const res = await fetch('/api/settings/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || 'Password change failed');
    toast.success('Password changed successfully');
    setCurrentPassword(''); setNewPassword('');
  };

  return <DashboardLayout><div className="space-y-6"><div className="card p-6 space-y-4"><h1 className="text-xl font-bold">Profile Settings</h1><div className="grid md:grid-cols-2 gap-4"><Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} /><Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} /></div><Button onClick={saveProfile}>Save Profile</Button></div><div className="card p-6 space-y-4"><h2 className="text-lg font-bold">Security</h2><div className="grid md:grid-cols-2 gap-4"><Input label="Current password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /><Input label="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div><Button onClick={changePassword}>Change Password</Button></div></div></DashboardLayout>;
}
