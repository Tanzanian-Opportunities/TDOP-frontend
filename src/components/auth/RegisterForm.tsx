import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { RegisterData } from '@/types/user';
import { Input } from '@/components/ui/Input';
import Logo from '@/components/layout/Logo';
import { ArrowLeft, User, Building2, Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface RegisterFormValues extends RegisterData {
  confirmPassword?: string;
}

type Step = 'role' | 'details';

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<RegisterFormValues>({
    defaultValues: { email: '', password: '', firstName: '', lastName: '', role: 'seeker', organizationName: '', confirmPassword: '' },
  });
  const { register: authRegister } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('role');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const selectedRole = watch('role');
  const password = watch('password');

  const chooseRole = (role: 'seeker' | 'organization') => {
    setValue('role', role, { shouldValidate: true });
    setStep('details');
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError('');
      const parts = data.firstName.trim().split(/\s+/);
      const payload = {
        ...data,
        firstName: parts.shift() || data.firstName,
        lastName: parts.join(' ') || (data.lastName || ''),
      };
      await authRegister(payload);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || t('auth.registerFailed'));
    }
  };

  const cardBase = 'w-full text-left rounded-2xl border-2 p-6 transition-all cursor-pointer';
  const roleCards = [
    {
      role: 'seeker' as const,
      title: t('auth.individualTitle'),
      subtitle: t('auth.individualSubtitle'),
      icon: User,
      activeRing: 'border-tdop-primary bg-tdop-pastel-jobs',
      idleRing: 'border-gray-200 hover:border-tdop-primary/50 bg-tdop-pastel-jobs/40',
    },
    {
      role: 'organization' as const,
      title: t('auth.orgTitle'),
      subtitle: t('auth.orgSubtitle'),
      icon: Building2,
      activeRing: 'border-tdop-gold bg-tdop-pastel-tenders',
      idleRing: 'border-gray-200 hover:border-tdop-gold/60 bg-tdop-pastel-tenders/40',
    },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-tdop-light dark:bg-tdop-dark">
      <div className="w-full max-w-md">
        <div className="mb-6">
          {step === 'details' ? (
            <button
              onClick={() => setStep('role')}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-tdop-primary dark:hover:text-tdop-cyan transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('auth.back')}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-tdop-primary dark:hover:text-tdop-cyan transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('auth.signIn')}
            </button>
          )}
        </div>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="lg" dark={false} />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-tdop-royal dark:text-white">
            {t('auth.chooseAccountType')}
          </h1>
        </div>

        {step === 'role' ? (
          <div className="bg-white dark:bg-gray-800/70 rounded-2xl shadow-soft dark:border dark:border-gray-700 border border-gray-100 p-7 sm:p-8 space-y-4">
            {roleCards.map(card => {
              const Icon = card.icon;
              const active = selectedRole === card.role;
              return (
                <button
                  key={card.role}
                  onClick={() => chooseRole(card.role)}
                  className={`${cardBase} ${active ? card.activeRing : card.idleRing}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${active ? 'bg-white text-tdop-royal' : 'text-tdop-royalLight'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-tdop-royal dark:text-white">{card.title}</h3>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{card.subtitle}</p>
                    </div>
                    {active && <CheckCircle2 className="w-6 h-6 text-tdop-primary dark:text-tdop-cyan shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800/70 rounded-2xl shadow-soft dark:border dark:border-gray-700 border border-gray-100 p-7 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                {selectedRole === 'seeker' ? <User className="w-4 h-4 text-tdop-primary" /> : <Building2 className="w-4 h-4 text-tdop-gold" />}
                {selectedRole === 'seeker' ? t('auth.individualTitle') : t('auth.orgTitle')}
              </div>

              <Input
                label={t('auth.fullName')}
                type="text"
                placeholder="Juma Mushi"
                autoComplete="name"
                {...register('firstName', { required: t('forms.required') })}
                error={errors.firstName?.message}
                icon={<User className="w-5 h-5" />}
              />
              <input type="hidden" {...register('lastName')} />

              <Input
                label={t('auth.email')}
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                {...register('email', { required: t('forms.required'), pattern: { value: /^\S+@\S+$/i, message: t('forms.invalidEmail') } })}
                error={errors.email?.message}
                icon={<Mail className="w-5 h-5" />}
              />

              {selectedRole === 'organization' && (
                <Input
                  label={t('auth.organizationName')}
                  type="text"
                  placeholder="Your Organization"
                  {...register('organizationName', { required: selectedRole === 'organization' ? t('forms.required') : false })}
                  error={errors.organizationName?.message}
                  icon={<Building2 className="w-5 h-5" />}
                />
              )}

              <Input
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('password', { required: t('forms.required'), minLength: { value: 8, message: t('forms.passwordTooShort') } })}
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

              <Input
                label={t('auth.confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: t('forms.required'),
                  validate: value => value === password || t('forms.passwordsDoNotMatch'),
                })}
                error={errors.confirmPassword?.message}
                icon={<Lock className="w-5 h-5" />}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-tdop-accent hover:bg-tdop-goldDark text-tdop-navy font-semibold shadow-gold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-tdop-navy/30 border-t-tdop-navy rounded-full animate-spin" />
                    {t('app.loading')}
                  </span>
                ) : (
                  t('auth.continueBtn')
                )}
              </button>
            </form>

            <div className="text-center mt-5 text-sm text-gray-600 dark:text-gray-400">
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="font-semibold text-tdop-primary dark:text-tdop-cyan hover:underline">
                {t('auth.signInHere')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;