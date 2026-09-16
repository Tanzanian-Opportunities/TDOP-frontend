import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant, className = '', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const variantClasses: Record<string, string> = {
    primary: 'bg-tdop-primary/10 text-tdop-primary',
    secondary: 'bg-tdop-secondary/10 text-tdop-secondary',
    accent: 'bg-tdop-accent/10 text-amber-700 dark:text-amber-400',
    verified: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    danger: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };

  const variantClass = variantClasses[variant || 'gray'] || variantClasses.gray;

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
