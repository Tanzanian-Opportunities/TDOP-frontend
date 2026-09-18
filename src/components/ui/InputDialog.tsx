import React, { useState } from 'react';
import { X } from 'lucide-react';

interface InputDialogProps {
  open: boolean;
  title: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const InputDialog: React.FC<InputDialogProps> = ({
  open,
  title,
  label,
  placeholder = '',
  multiline = false,
  required = true,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const [value, setValue] = useState('');

  if (!open) return null;

  const handleSubmit = () => {
    if (required && !value.trim()) return;
    onConfirm(value.trim());
    setValue('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-slide-up">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-tdop-navy mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{label}</p>

        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 rounded-xl border border-gray-200 text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary resize-none"
            rows={3}
            autoFocus
          />
        ) : (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 rounded-xl border border-gray-200 text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          />
        )}

        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (required && !value.trim())}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-tdop-primary hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputDialog;
