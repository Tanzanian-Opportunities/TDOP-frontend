import React from 'react';
import { X } from 'lucide-react';

interface RejectDialogProps {
  open: boolean;
  title: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const RejectDialog: React.FC<RejectDialogProps> = ({
  open,
  title,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const [reason, setReason] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (open) {
      setReason('');
      textareaRef.current?.focus();
      const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onCancel]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-slide-up">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100 text-red-600 mb-4">
          <X className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-semibold text-tdop-navy mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">Provide a reason for rejection. This will be visible to the organization.</p>

        <label htmlFor="reject-reason" className="sr-only">Rejection reason</label>
        <textarea
          ref={textareaRef}
          id="reject-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Incomplete information, misleading details, policy violation..."
          className="w-full p-3 rounded-xl border border-gray-200 text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
          rows={3}
        />

        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(reason); setReason(''); }}
            disabled={loading || !reason.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Rejecting...' : 'Reject Opportunity'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectDialog;
