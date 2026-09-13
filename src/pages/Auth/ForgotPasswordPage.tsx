import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '@/services/api/axiosInstance';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || t('auth.forgotError') || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-tdop-secondary/10 flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-tdop-secondary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-tdop-navy mb-2">
            {t('auth.checkEmail') || 'Check Your Email'}
          </h1>
          <p className="text-gray-500 mb-8">
            {t('auth.resetLinkSent') || `We've sent a password reset link to ${email}`}
          </p>
          <Link to="/login">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('auth.backToLogin') || 'Back to Sign In'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-extrabold text-tdop-navy">
            {t('auth.forgotTitle') || 'Forgot Password?'}
          </h1>
          <p className="mt-2 text-gray-500">
            {t('auth.forgotSubtitle') || "No worries, we'll send you reset instructions"}
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-tdop-navy mb-1.5">
                {t('auth.email') || 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-tdop-primary focus:ring-2 focus:ring-tdop-primary/20 outline-none transition-all text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              <Send className="w-5 h-5 mr-2" />
              {t('auth.sendResetLink') || 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-tdop-primary font-medium hover:underline">
              <ArrowLeft className="w-4 h-4" />
              {t('auth.backToLogin') || 'Back to Sign In'}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
