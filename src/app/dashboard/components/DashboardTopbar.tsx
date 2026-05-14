'use client';
import React, { useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';
import Badge from '@/components/ui/Badge';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from 'lucide-react';

interface TopbarProps {
  onMobileMenuOpen: () => void;
}

const notifications = [
  {
    id: 'notif-001',
    title: 'Automation "Reel — Free Guide" hit 1,000 DMs',
    time: '2 min ago',
    unread: true,
    type: 'success' as const,
  },
  {
    id: 'notif-002',
    title: 'Instagram token for @maya.creates expires in 3 days',
    time: '1 hr ago',
    unread: true,
    type: 'warning' as const,
  },
  {
    id: 'notif-003',
    title: '14 DMs failed — rate limit reached on @maya.creates',
    time: '3 hr ago',
    unread: true,
    type: 'danger' as const,
  },
  {
    id: 'notif-004',
    title: 'New account @dmgo.brands connected successfully',
    time: 'Yesterday',
    unread: false,
    type: 'info' as const,
  },
  {
    id: 'notif-005',
    title: 'Weekly report: 12,440 DMs sent, 98.1% success rate',
    time: '2 days ago',
    unread: false,
    type: 'success' as const,
  },
];

export default function DashboardTopbar({ onMobileMenuOpen }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPlan, setUserPlan] = useState('starter plan');
  const normalizedName = (userName || '').trim().toLowerCase();
  const isGenericName = !normalizedName || normalizedName === 'user';
  const hasRealEmail = !!userEmail && userEmail.toLowerCase() !== 'user@dmgo.app';
  const displayName = !isGenericName ? userName : (hasRealEmail ? userEmail : 'My Account');
  const displayInitial = (displayName?.trim()?.[0] || 'A').toUpperCase();

  const unreadCount = notifications.filter((n) => n.unread).length;
  const topbarMenuRef = useRef<HTMLDivElement | null>(null);
  const isGenericIdentity = (value?: string) => {
    const v = String(value || '').trim().toLowerCase();
    return !v || v === 'user' || v === 'admin' || v === 'test' || v === 'guest';
  };
  const isGenericEmail = (value?: string) => {
    const local = String(value || '').split('@')[0]?.trim().toLowerCase() || '';
    return !local || isGenericIdentity(local);
  };

  useEffect(() => {
    const profileCookieRaw = document.cookie.match(/(?:^|;\s*)dmgo_profile=([^;]+)/)?.[1];
    if (profileCookieRaw) {
      try {
        const profileCookie = decodeURIComponent(profileCookieRaw);
        const b64 = profileCookie.replace(/-/g, '+').replace(/_/g, '/');
        const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
        const text = atob(padded);
        const data = JSON.parse(text) as { name?: string; email?: string; plan?: string };
        if (data?.name && !isGenericIdentity(data.name)) setUserName(data.name);
        if (data?.email && !isGenericEmail(data.email)) setUserEmail(data.email);
        if (data?.plan) setUserPlan(`${data.plan} plan`);
      } catch {
        // ignore malformed profile cookie
      }
    }

    const loadMe = async () => {
      try {
        const res = await Promise.race([
          fetch('/api/auth/me', { cache: 'no-store', credentials: 'same-origin' }),
          new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('me_fetch_timeout')), 8000)),
        ]);
        if (res.status === 401) {
          window.location.href = '/sign-up-login-screen';
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        if (data.user?.name && !isGenericIdentity(data.user.name)) setUserName(data.user.name);
        if (data.user?.email && !isGenericEmail(data.user.email)) setUserEmail(data.user.email);
        if (data.user?.plan) setUserPlan(`${data.user.plan} plan`);
      } catch {
        // Retry once after brief delay in flaky proxy/network paths.
        setTimeout(async () => {
          try {
            const retry = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'same-origin' });
            if (!retry.ok) return;
            const data = await retry.json();
            if (data.user?.name) setUserName(data.user.name);
            if (data.user?.email) setUserEmail(data.user.email);
            if (data.user?.plan) setUserPlan(`${data.user.plan} plan`);
          } catch {
            // Keep defaults.
          }
        }, 1200);
      }
    };
    void loadMe();
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!topbarMenuRef.current) return;
      if (topbarMenuRef.current.contains(event.target as Node)) return;
      setNotifOpen(false);
      setUserMenuOpen(false);
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Signed out successfully');
    } catch {
      toast.error('Could not sign out cleanly. Redirecting to login.');
    } finally {
      window.location.href = '/sign-up-login-screen';
    }
  };

  return (
    <header
      ref={topbarMenuRef}
      className="h-16 bg-white border-b border-border flex items-center justify-between gap-4 px-4 xl:px-6 shrink-0 sticky top-0 z-50 pointer-events-auto"
    >
      <div className="flex items-center gap-3">
        <button
          className="btn-ghost p-2 lg:hidden"
          onClick={onMobileMenuOpen}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="relative hidden sm:block">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            placeholder="Search automations, keywords…"
            className="input-field pl-10 h-9 text-sm w-64 xl:w-80"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 relative z-[60]">
        <div className="relative">
          <button
            className="btn-ghost p-2 relative"
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserMenuOpen(false);
            }}
            aria-label={`Notifications — ${unreadCount} unread`}
            aria-expanded={notifOpen}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-danger text-white text-xs font-bold flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-2xl shadow-card-xl animate-slide-down z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground">
                  Notifications
                </h3>
                <Badge variant="danger">{unreadCount} new</Badge>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-border scrollbar-hide">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                      n.unread ? 'bg-primary-light/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                          n.unread ? 'bg-primary' : 'bg-transparent'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground line-clamp-2">
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-border">
                <button className="text-sm text-primary font-semibold hover:underline w-full text-center">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            onClick={() => {
              setUserMenuOpen((v) => !v);
              setNotifOpen(false);
            }}
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {displayInitial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-foreground leading-tight">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                {userPlan}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`text-muted-foreground transition-transform duration-150 ${
                userMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border rounded-2xl shadow-card-xl animate-slide-down z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-bold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {userEmail}
                </p>
              </div>
              <div className="p-1.5 flex flex-col gap-0.5">
                {[
                  { icon: <User size={15} />, label: 'Profile' },
                  { icon: <Settings size={15} />, label: 'Settings' },
                ].map((item) => (
                  <button
                    key={`usermenu-${item.label}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
                  >
                    <span className="text-muted-foreground">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition-colors w-full text-left"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

