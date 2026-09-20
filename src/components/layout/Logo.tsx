import React from 'react';

interface LogoProps {
  className?: string;
  dark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', dark = false, size = 'md' }) => {
  const tile =
    size === 'lg'
      ? 'w-12 h-12 rounded-2xl text-xl'
      : size === 'sm'
      ? 'w-8 h-8 rounded-lg text-sm'
      : 'w-10 h-10 rounded-xl text-lg';
  const word = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl';

  return (
    <span aria-label="TDOP home" className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`${tile} bg-tdop-primary flex items-center justify-center font-display font-extrabold text-white shadow-soft`}
      >
        T
      </span>
      <span className={`font-display font-bold tracking-tight leading-none ${word}`}>
        <span className="text-tdop-primary">T</span>
        <span className={dark ? 'text-white' : 'text-tdop-navy'}>D</span>
        <span className="text-tdop-secondary">O</span>
        <span className={dark ? 'text-white' : 'text-tdop-navy'}>P</span>
      </span>
    </span>
  );
};

export default Logo;
