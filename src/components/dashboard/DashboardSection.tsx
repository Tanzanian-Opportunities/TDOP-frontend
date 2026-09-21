import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface DashboardSectionProps {
  title: string;
  icon?: React.ReactNode;
  action?: { label: string; to: string; icon?: React.ReactNode };
  children: React.ReactNode;
  className?: string;
  empty?: boolean;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  icon,
  action,
  children,
  className = '',
  empty = false,
}) => {
  return (
    <section className={`bg-white rounded-bento border border-gray-100 shadow-bento overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {icon && <span className="text-tdop-primary">{icon}</span>}
          <h2 className="text-base font-semibold text-tdop-navy">{title}</h2>
        </div>
        {action && (
          <Link
            to={action.to}
            className="inline-flex items-center gap-1 text-sm font-medium text-tdop-primary hover:text-blue-700 transition-colors"
          >
            {action.label}
            {action.icon || <ArrowRight className="w-4 h-4" />}
          </Link>
        )}
      </div>
      <div className={`${empty ? 'p-6' : ''}`}>
        {children}
      </div>
    </section>
  );
};
