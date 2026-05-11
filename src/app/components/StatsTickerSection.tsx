import React from 'react';

const stats = [
  { value: '12.4M+', label: 'DMs Sent' },
  { value: '98.6%', label: 'Delivery Rate' },
  { value: '47K+', label: 'Active Creators' },
  { value: '3.2M+', label: 'Leads Generated' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '190+', label: 'Countries' },
  { value: '12.4M+', label: 'DMs Sent' },
  { value: '98.6%', label: 'Delivery Rate' },
  { value: '47K+', label: 'Active Creators' },
  { value: '3.2M+', label: 'Leads Generated' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '190+', label: 'Countries' },
];

export default function StatsTickerSection() {
  return (
    <section className="py-8 border-y border-border bg-white overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap">
        {stats?.map((stat, i) => (
          <div
            key={`ticker-stat-${i}`}
            className="inline-flex items-center gap-2 px-8 shrink-0"
          >
            <span className="text-xl font-extrabold text-primary tabular-nums">
              {stat?.value}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {stat?.label}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-border ml-6" />
          </div>
        ))}
      </div>
    </section>
  );
}