import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', width, height, rounded = true }) => {
  return (
    <div
      className={`skeleton ${rounded ? 'rounded-lg' : ''} ${className}`}
      style={{ width, height }}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton height={20} width="60%" />
      <Skeleton height={16} width="80%" />
      <Skeleton height={16} width="40%" />
      <div className="flex gap-2">
        <Skeleton height={24} width={80} rounded />
        <Skeleton height={24} width={80} rounded />
      </div>
    </div>
  );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 card">
          <Skeleton height={40} width={40} rounded />
          <div className="flex-1 space-y-2">
            <Skeleton height={16} width="60%" />
            <Skeleton height={12} width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} height={16} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};
