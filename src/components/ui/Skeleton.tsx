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
      aria-busy="true"
      role="presentation"
    />
  );
};
