'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, Zap, BarChart3, Activity, Settings, HelpCircle, ChevronLeft, ChevronRight, Users, Bell } from 'lucide-react';

interface SidebarProps { collapsed: boolean; onToggle: () => void; mobileOpen: boolean; onMobileClose: () => void; }

const navGroups = [
  { id: 'nav-group-main', label: 'Main', items: [
    { id: 'nav-dashboard', label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'nav-automations', label: 'Automations', href: '/dashboard?tab=builder', icon: <Zap size={18} /> },
    { id: 'nav-analytics', label: 'Analytics', href: '/dashboard?tab=analytics', icon: <BarChart3 size={18} /> },
    { id: 'nav-activity', label: 'Live Activity', href: '/dashboard?tab=activity', icon: <Activity size={18} /> },
  ]},
  { id: 'nav-group-account', label: 'Account', items: [
    { id: 'nav-instagram', label: 'Instagram Accounts', href: '/dashboard/instagram-accounts', icon: <Users size={18} /> },
    { id: 'nav-team', label: 'Team', href: '/dashboard/team', icon: <Users size={18} /> },
    { id: 'nav-notifications', label: 'Notifications', href: '/dashboard/notifications', icon: <Bell size={18} /> },
  ]},
];

const bottomNav = [
  { id: 'nav-settings', label: 'Settings', href: '/dashboard/settings', icon: <Settings size={18} /> },
  { id: 'nav-help', label: 'Help & Support', href: '/dashboard/help-support', icon: <HelpCircle size={18} /> },
];

export default function DashboardSidebar({ collapsed, onToggle, mobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'builder';
  const sidebarWidth = collapsed ? 'w-16' : 'w-60';

  return <aside className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-white border-r border-border transition-all duration-300 ${sidebarWidth} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
    <div className={`flex items-center h-16 border-b border-border px-3 shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
      {!collapsed ? <div className="flex items-center gap-2"><AppLogo size={28} /><span className="font-bold text-base text-foreground">DmGo</span></div> : <AppLogo size={28} />}
      <button onClick={onToggle} className="btn-ghost p-1.5 hidden lg:flex shrink-0">{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
    </div>
    <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-4 scrollbar-hide">{navGroups.map((group) => <div key={group.id}>{!collapsed && <p className="section-label px-3 mb-2">{group.label}</p>}<div className="flex flex-col gap-0.5">{group.items.map((item) => { let isActive = false; if (item.href.startsWith('/dashboard?tab=')) { const targetTab = item.href.split('tab=')[1] || 'builder'; isActive = pathname === '/dashboard' && activeTab === targetTab; } else if (item.href === '/dashboard') { isActive = pathname === '/dashboard' && activeTab === 'builder'; } else { isActive = pathname === item.href; } return <Link key={item.id} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive ? 'bg-primary-light text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'} ${collapsed ? 'justify-center' : ''}`}>{item.icon}{!collapsed && <span className="flex-1 truncate">{item.label}</span>}</Link>; })}</div></div>)}</nav>
    <div className="border-t border-border py-3 px-2 flex flex-col gap-0.5">{bottomNav.map((item) => { const isActive = pathname === item.href; return <Link key={item.id} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive ? 'bg-primary-light text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'} ${collapsed ? 'justify-center' : ''}`}>{item.icon}{!collapsed && <span className="truncate">{item.label}</span>}</Link>; })}</div>
  </aside>;
}
