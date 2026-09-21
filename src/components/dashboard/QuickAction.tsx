import React from 'react';
import { Link } from 'react-router-dom';

interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  to: string;
  color?: string;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  label,
  icon,
  to,
  color = 'bg-tdop-primary/10 text-tdop-primary',
}) => {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 p-4 rounded-bento border border-gray-100 hover:border-gray-200 hover:shadow-bento-hover transition-all duration-200 group"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} group-hover:scale-105 transition-transform`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700 text-center leading-tight">{label}</span>
    </Link>
  );
};
