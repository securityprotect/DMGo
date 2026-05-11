'use client';
import React from 'react';
import LoadingPulseGrid from '@/components/ui/loading/LoadingPulseGrid';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  outline: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-foreground bg-white border border-border hover:bg-muted active:scale-95 transition-all duration-150 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
};

const sizeClasses: Record<ButtonSize, string> = { sm: 'px-3.5 py-1.5 text-xs rounded-lg', md: '', lg: 'px-7 py-3.5 text-base rounded-2xl' };

export default function Button({ variant = 'primary', size = 'md', loading = false, loadingLabel, leftIcon, rightIcon, fullWidth = false, children, className = '', disabled, ...props }: ButtonProps) {
  const base = variantClasses[variant];
  const sz = sizeClasses[size];
  const fw = fullWidth ? 'w-full' : '';

  return (
    <button className={`${base} ${sz} ${fw} ${className}`} disabled={disabled || loading} aria-disabled={disabled || loading} {...props}>
      {loading ? <LoadingPulseGrid label={loadingLabel || 'Loading'} /> : <>
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </>}
    </button>
  );
}
