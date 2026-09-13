import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '@/components/layout/Logo';
import { Mail, Send, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '@/services/api/authApi';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3"><Logo size="lg" /></div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-tdop-navy">{t('auth.forgotTitle')}</h1>
          <p className="mt-1.5 text-sm text-gray-500">{t('auth.forgotSubtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-7 sm:p-8">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-tdop-secondary/10">
                <CheckCircle2 className="w-7 h-7 text-tdop-secondary" />
              </div>
              <h2 className="font-semibold text-tdop-navy">{t('auth.resetLinkSent')}</h2>
              <p className="text-sm text-gray-500">{t('auth.resetLinkSentDesc')}</p>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 text-sm font-medium text-tdop-primary hover:underline">
                <ArrowLeft className="w-4 h-4" />{t('auth.backToLogin')}
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-tdop-navy mb-1.5">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-tdop-primary focus:ring-2 focus:ring-tdop-primary/20 outline-none transition-all text-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-tdop-primary hover:bg-blue-700 text-white font-semibold shadow-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                {t('auth.sendResetLink')}
              </button>

              <div className="flex items-center text-sm text-gray-400">
                <AlertCircle className="w-4 h-4 mr-1.5" />{t('auth.needsVerifiedEmail')}
              </div>

              <p className="text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-tdop-primary hover:underline">
                  <ArrowLeft className="w-4 h-4" />{t('auth.backToLogin')}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
