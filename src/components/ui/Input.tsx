import React from 'react';

interface InputOption {
  value: string;
  label: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  as?: 'input' | 'textarea' | 'select';
  rows?: number;
  options?: InputOption[];
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, suffix, as = 'input', rows, options, className = '', id, ...props }, ref) => {
    const commonInputClasses = 'block w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-tdop-navy placeholder-gray-400 focus:ring-2 focus:ring-tdop-primary focus:border-tdop-primary outline-none transition-colors';
    const wrapperClasses = 'relative flex items-center';
    const generatedId = id || (props.name ? `input-${props.name}` : undefined);

    if (as === 'textarea') {
      return (
        <div className="input-group">
          {label && <label htmlFor={generatedId} className="text-sm font-medium text-gray-700">{label}</label>}
          <textarea id={generatedId} rows={rows} className={`${commonInputClasses} resize-none`} {...props as any} ref={ref as any} />
          {error && <span className="error">{error}</span>}
        </div>
      );
    }

    if (as === 'select' || options) {
      return (
        <div className="input-group">
          {label && <label htmlFor={generatedId} className="text-sm font-medium text-gray-700">{label}</label>}
          <select id={generatedId} className={commonInputClasses} {...props as any} ref={ref as any}>
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {error && <span className="error">{error}</span>}
        </div>
      );
    }

    return (
      <div className="input-group">
        {label && <label htmlFor={generatedId} className="text-sm font-medium text-gray-700">{label}</label>}
        <div className={wrapperClasses}>
          {icon && <span className="absolute left-3 z-10 text-gray-400">{icon}</span>}
          <input id={generatedId} ref={ref} className={`${commonInputClasses} ${icon ? 'pl-10' : ''} ${suffix ? 'pr-11' : ''} ${className}`} {...props} />
          {suffix && <span className="absolute right-3 z-10 flex items-center">{suffix}</span>}
        </div>
        {error && <span className="error">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
