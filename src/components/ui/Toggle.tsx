'use client';
import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export default function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}: ToggleProps) {
  const trackSize =
    size === 'sm' ?'w-8 h-4' :'w-11 h-6';
  const thumbSize =
    size === 'sm' ?'w-3 h-3 translate-x-0.5' :'w-4 h-4 translate-x-1';
  const thumbActive =
    size === 'sm' ?'translate-x-[18px]' :'translate-x-[22px]';

  return (
    <label
      className={`inline-flex items-center gap-2.5 cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${trackSize} ${
          checked ? 'bg-primary' : 'bg-border'
        }`}
        type="button"
      >
        <span
          className={`inline-block bg-white rounded-full shadow transition-transform duration-200 ${thumbSize} ${
            checked ? thumbActive : ''
          }`}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
    </label>
  );
}