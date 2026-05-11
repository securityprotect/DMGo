import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'primary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
  muted: 'badge-muted',
  primary: 'badge-primary',
};

const dotColorMap: Record<BadgeVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  muted: 'bg-muted-foreground',
  primary: 'bg-primary',
};

export default function Badge({
  variant = 'muted',
  children,
  dot = false,
  className = '',
}: BadgeProps) {
  return (
    <span className={`${variantMap[variant]} ${className}`}>
      {dot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${dotColorMap[variant]}`}
        />
      )}
      {children}
    </span>
  );
}