import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Send, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import { Input } from '@/components/ui/Input';

interface ForgotPasswordData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    // TODO: wire to authApi.forgotPassword(data.email)
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-tdop-light dark:bg-tdop-dark flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-tdop-royal dark:text-white">
            {t('auth.forgotTitle')}
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {t('auth.forgotSubtitle')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800/70 rounded-2xl shadow-soft dark:border dark:border-gray-700 border border-gray-100 p-7 sm:p-8">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {t('auth.resetLinkSent')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('auth.resetLinkSentDesc')}
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-tdop-primary dark:text-tdop-cyan hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('auth.backToLogin')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label={t('auth.email')}
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                autoComplete="email"
                icon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register('email', {
                  required: t('forms.required'),
                  pattern: { value: /^\S+@\S+$/i, message: t('forms.invalidEmail') },
                })}
              />

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-tdop-royal hover:bg-tdop-royalLight text-white font-semibold shadow-soft transition-colors"
              >
                <Send className="w-4 h-4" />
                {t('auth.sendResetLink')}
              </button>

              <div className="flex items-center text-sm text-gray-400">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                {t('auth.needsVerifiedEmail')}
              </div>

              <p className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-tdop-primary dark:text-tdop-cyan hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('auth.backToLogin')}
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