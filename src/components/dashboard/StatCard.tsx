import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  value: number | string;
  label: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  to?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  trend = 'neutral',
  color = 'bg-tdop-primary/10 text-tdop-primary',
  to,
}) => {
  const Wrapper = to ? Link : 'div';

  return (
    <Wrapper
      to={to || ''}
      className={`relative bg-white rounded-bento border border-gray-100 shadow-bento p-5 flex items-center gap-4 group ${
        to ? 'hover:shadow-bento-hover hover:border-gray-200 cursor-pointer transition-all duration-200' : ''
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-bold text-tdop-navy leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1 truncate">{label}</p>
      </div>
      {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-tdop-secondary shrink-0" />}
      {trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-400 shrink-0" />}
      {to && (
        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-tdop-primary transition-colors shrink-0" />
      )}
    </Wrapper>
  );
};
