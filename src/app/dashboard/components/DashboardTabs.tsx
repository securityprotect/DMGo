'use client';
import React, { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AutomationBuilderTab from './AutomationBuilderTab';
import AnalyticsTab from './AnalyticsTab';
import LiveActivityTab from './LiveActivityTab';
import { Zap, BarChart3, Activity } from 'lucide-react';

interface DashboardTab { id: string; label: string; icon: React.ReactNode; }

const tabs: DashboardTab[] = [
  { id: 'builder', label: 'Automation Builder', icon: <Zap size={16} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  { id: 'activity', label: 'Live Activity', icon: <Activity size={16} /> },
];

export default function DashboardTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = useMemo(() => {
    const tab = searchParams.get('tab');
    if (tab === 'analytics' || tab === 'activity' || tab === 'builder') return tab;
    return 'builder';
  }, [searchParams]);

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center gap-1 bg-white border border-border rounded-2xl p-1.5 w-fit shadow-card overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap ${activeTab === tab.id ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4" role="tabpanel">
        {activeTab === 'builder' && <AutomationBuilderTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'activity' && <LiveActivityTab />}
      </div>
    </div>
  );
}
