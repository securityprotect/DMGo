'use client';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

type SuccessRatePoint = { date: string; rate: number };

interface TooltipPayloadItem {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const val = payload[0].value;
  return (
    <div className="bg-white border border-border rounded-xl shadow-card-lg px-4 py-3 text-sm">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-bold text-foreground tabular-nums">
        {val.toFixed(1)}% success rate
      </p>
      <p
        className={`text-xs font-medium mt-0.5 ${
          val >= 98 ? 'text-success' : val >= 96 ? 'text-warning' : 'text-danger'
        }`}
      >
        {val >= 98 ? 'Excellent' : val >= 96 ? 'Good' : 'Needs attention'}
      </p>
    </div>
  );
}

export default function SuccessRateChart({ data }: { data: SuccessRatePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <defs>
          <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--success)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
          axisLine={false}
          tickLine={false}
          interval={3}
        />
        <YAxis
          domain={[94, 100]}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
          axisLine={false}
          tickLine={false}
          width={38}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={98}
          stroke="var(--success)"
          strokeDasharray="4 4"
          strokeOpacity={0.5}
          label={{
            value: '98% target',
            position: 'right',
            fontSize: 10,
            fill: 'var(--success)',
            fontFamily: 'var(--font-sans)',
          }}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="var(--success)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: 'var(--success)', stroke: 'white', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
