import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setValue('');
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onCancel]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (required && !value.trim()) return;
    onConfirm(value.trim());
    setValue('');
  };

  const inputId = `input-dialog-${title.replace(/\s/g, '-').toLowerCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-elevated max-w-md w-full p-6 animate-modal-in">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label={t('app.close')}
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-tdop-navy mb-1">{title}</h3>
        <label htmlFor={inputId} className="text-sm text-gray-500 mb-4 block">{label}</label>

        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            id={inputId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 rounded-xl border border-gray-200 text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary resize-none"
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            id={inputId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 rounded-xl border border-gray-200 text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          />
        )}

        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {t('app.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (required && !value.trim())}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-tdop-primary hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('app.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputDialog;
