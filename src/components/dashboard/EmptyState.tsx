import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; to: string };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-10 px-4">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-tdop-navy mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
      {action && (
        <Link
          to={action.to}
          className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg bg-tdop-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
};
