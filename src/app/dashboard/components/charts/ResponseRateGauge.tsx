'use client';
import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';

export default function ResponseRateGauge({ replied, total }: { replied: number; total: number }) {
  const responseRate = total ? (replied / total) * 100 : 0;
  const noReply = Math.max(total - replied, 0);
  const data = [{ value: Number(responseRate.toFixed(1)), fill: 'var(--primary)' }];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <ResponsiveContainer width={180} height={180}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="90%"
            startAngle={225}
            endAngle={-45}
            data={data}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: 'var(--muted)' }}
              dataKey="value"
              angleAxisId={0}
              cornerRadius={8}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-foreground tabular-nums">
            {responseRate.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            response rate
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 w-full px-2">
        {[
          { label: 'Replied', value: replied.toLocaleString(), color: 'bg-primary' },
          { label: 'No reply', value: noReply.toLocaleString(), color: 'bg-muted' },
        ]?.map((item) => (
          <div key={`gauge-legend-${item?.label}`} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item?.color}`} />
              <span className="text-xs text-muted-foreground">{item?.label}</span>
            </div>
            <span className="text-xs font-bold text-foreground tabular-nums">
              {item?.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
