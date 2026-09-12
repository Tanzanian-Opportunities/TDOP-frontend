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
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`${tile} bg-gradient-to-br from-tdop-royal via-tdop-royalLight to-tdop-cyan flex items-center justify-center font-display font-extrabold text-white shadow-soft`}
      >
        T
      </span>
      <span className={`font-display font-bold tracking-tight leading-none ${word}`}>
        <span className="text-tdop-gold">T</span>
        <span className={dark ? 'text-white' : 'text-tdop-royal'}>D</span>
        <span className="text-tdop-cyan">O</span>
        <span className={dark ? 'text-white' : 'text-tdop-royal'}>P</span>
      </span>
    </span>
  );
};

export default Logo;