import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function NotificationsPage() {
  return <DashboardLayout><div className="card p-6"><h1 className="text-xl font-bold">Notifications</h1><p className="text-sm text-muted-foreground mt-2">Notification center is active. More channels can be added here.</p></div></DashboardLayout>;
}
