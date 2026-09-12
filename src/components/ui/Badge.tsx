import React from 'react';
import { getStatusColor } from '@/utils/formatRole';

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant, className = '', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const variantClass = variant ? getStatusColor(variant) : getStatusColor('pending');

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${variantClass} ${className}`}>
      {children}
    </span>
  );
};

interface BadgeDotProps {
  children: React.ReactNode;
  className?: string;
}

export const BadgeDot: React.FC<BadgeDotProps> = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-current" />
      {children}
    </span>
  );
};
