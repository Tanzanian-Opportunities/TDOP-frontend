import React from 'react';
import { Link } from 'react-router-dom';

interface ActivityItemProps {
  icon: React.ReactNode;
  iconColor?: string;
  title: string;
  subtitle?: string;
  time?: string;
  to?: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  iconColor = 'bg-tdop-primary/10 text-tdop-primary',
  title,
  subtitle,
  time,
  to,
}) => {
  const Wrapper = to ? Link : 'div';

  return (
    <Wrapper
      to={to || ''}
      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
        to ? 'hover:bg-gray-50 cursor-pointer' : ''
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-tdop-navy line-clamp-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{subtitle}</p>
        )}
      </div>
      {time && (
        <span className="text-xs text-gray-400 shrink-0 mt-0.5">{time}</span>
      )}
    </Wrapper>
  );
};
