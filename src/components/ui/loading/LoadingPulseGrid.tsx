import React from 'react';

export default function LoadingPulseGrid({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2" aria-live="polite" aria-busy="true">
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={`cell-${i}`}
            className="w-1.5 h-1.5 rounded-sm bg-white/90 animate-grid-wave"
            style={{ animationDelay: `${i * 70}ms` }}
          />
        ))}
      </div>
      <span className="text-xs opacity-90">{label}</span>
    </div>
  );
}
