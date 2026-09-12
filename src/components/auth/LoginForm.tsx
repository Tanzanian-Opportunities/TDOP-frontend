import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { LoginCredentials } from '@/types/user';
import { Input } from '@/components/ui/Input';
import Logo from '@/components/layout/Logo';
import { User, Lock, Eye, EyeOff, AlertCircle, KeyRound, ShieldCheck, Building2, Users, LogIn } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
  </svg>
);

const LoginForm: React.FC = () => {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginCredentials>({
    defaultValues: { email: '', password: '' },
  });
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError('');
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || t('auth.loginFailed'));
    }
  };

  const onSocial = () => setError(t('auth.socialNote'));

  const useDemo = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
    void handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-tdop-light dark:bg-tdop-dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="lg" dark={false} />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-tdop-royal dark:text-white">
            {t('auth.signInTitle')}
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {t('auth.signInSubtitle')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800/70 rounded-2xl shadow-soft dark:border dark:border-gray-700 border border-gray-100 p-7 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <Input
              label={t('auth.emailOrPhone')}
              type="text"
              placeholder="name@example.com"
              autoComplete="username"
              {...register('email', { required: t('forms.required'), pattern: { value: /^\S+@\S+$/i, message: t('forms.invalidEmail') } })}
              error={errors.email?.message}
              icon={<User className="w-5 h-5" />}
            />

            <Input
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password', { required: t('forms.required'), minLength: { value: 6, message: t('forms.passwordTooShort') } })}
              error={errors.password?.message}
              icon={<Lock className="w-5 h-5" />}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  className="text-gray-400 hover:text-tdop-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-tdop-primary"
                  defaultChecked
                />
                {t('auth.rememberMe')}
              </label>
              <Link to="/forgot-password" className="text-sm text-tdop-primary dark:text-tdop-cyan hover:underline">
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-tdop-royal hover:bg-tdop-royalLight disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold shadow-soft transition-colors"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {t('app.loading')}
                </span>
              ) : (
                t('auth.signInBtn')
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">{t('auth.or')}</span>
            <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={onSocial}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-tdop-primary hover:text-tdop-primary dark:hover:border-tdop-cyan dark:hover:text-tdop-cyan transition-colors"
            >
              <GoogleIcon />
              {t('auth.signInGoogle')}
            </button>
            <button
              type="button"
              onClick={onSocial}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-tdop-primary hover:text-tdop-primary dark:hover:border-tdop-cyan dark:hover:text-tdop-cyan transition-colors"
            >
              <FacebookIcon />
              {t('auth.signInFacebook')}
            </button>
          </div>
        </div>

        <div className="mt-4 bg-white dark:bg-gray-800/70 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-4 h-4 text-tdop-gold" />
            <h3 className="font-display font-bold text-sm text-tdop-royal dark:text-white">{t('auth.demoTitle')}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('auth.demoSubtitle')}</p>

          <div className="space-y-3">
            {[
              {
                icon: <ShieldCheck className="w-4 h-4 text-tdop-primary" />,
                label: t('auth.demoAdminLabel'),
                desc: t('auth.demoAdminDesc'),
                email: 'admin@tdop.go.tz',
                password: 'admin123',
                role: 'ADMIN',
                verified: true,
              },
              {
                icon: <Building2 className="w-4 h-4 text-tdop-primary" />,
                label: t('auth.demoOrgLabel'),
                desc: t('auth.demoOrgDesc'),
                email: 'info@tanzgold.com',
                password: 'org123',
                role: 'ORGANIZATION',
                verified: true,
              },
              {
                icon: <Users className="w-4 h-4 text-tdop-primary" />,
                label: t('auth.demoSeekerLabel'),
                desc: t('auth.demoSeekerDesc'),
                email: 'john.mwangi@email.com',
                password: 'seeker123',
                role: 'SEEKER',
                verified: true,
              },
            ].map((demo) => (
              <div
                key={demo.email}
                className="flex items-start gap-3 p-3 rounded-xl bg-tdop-light dark:bg-gray-900/60 border border-gray-50 dark:border-gray-800 hover:border-tdop-primary/40 dark:hover:border-tdop-cyan/40 transition-colors"
              >
                <span className="mt-0.5 shrink-0">{demo.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-800 dark:text-white">{demo.label}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-tdop-primary/10 text-tdop-primary dark:bg-tdop-cyan/10 dark:text-tdop-cyan">
                      {demo.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{demo.desc}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="text-gray-400 dark:text-gray-500">
                      <span className="font-medium text-gray-600 dark:text-gray-300">{t('auth.demoEmailLabel')}:</span> <span className="break-all">{demo.email}</span>
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">
                      <span className="font-medium text-gray-600 dark:text-gray-300">{t('auth.demoPasswordLabel')}:</span> {demo.password}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => useDemo(demo.email, demo.password)}
                    disabled={isSubmitting}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tdop-primary text-white text-xs font-semibold hover:bg-tdop-royal disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    {t('auth.demoTryIt')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500 text-center">{t('auth.demoNote')}</p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-tdop-primary dark:text-tdop-cyan hover:underline">
            {t('auth.signUpHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;