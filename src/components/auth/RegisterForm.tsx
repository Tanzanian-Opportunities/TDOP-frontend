import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import Logo from '@/components/layout/Logo';
import { ArrowLeft, User, Building2, Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const RegisterForm: React.FC = () => {
  const { register: authRegister } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'seeker' as 'seeker' | 'organization',
    organizationName: '',
  });

  const selectedRole = form.role;

  const chooseRole = (role: 'seeker' | 'organization') => {
    setForm({ ...form, role });
    setStep('details');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError(t('forms.passwordsDoNotMatch') || 'Passwords do not match');
      return;
    }
    try {
      setError('');
      await authRegister({
        firstName: form.firstName,
        lastName: form.lastName || ' ',
        email: form.email,
        password: form.password,
        role: form.role,
        organizationName: form.organizationName,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || t('auth.registerFailed'));
    }
  };

  const cardBase = 'w-full text-left rounded-2xl border-2 p-6 transition-all cursor-pointer';
  const roleCards = [
    { role: 'seeker' as const, title: t('auth.individualTitle'), subtitle: t('auth.individualSubtitle'), icon: User, activeRing: 'border-tdop-primary bg-tdop-primary/5', idleRing: 'border-gray-200 hover:border-tdop-primary/50 bg-gray-50' },
    { role: 'organization' as const, title: t('auth.orgTitle'), subtitle: t('auth.orgSubtitle'), icon: Building2, activeRing: 'border-tdop-secondary bg-tdop-secondary/5', idleRing: 'border-gray-200 hover:border-tdop-secondary/50 bg-gray-50' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-6">
          {step === 'details' ? (
            <button onClick={() => setStep('role')} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-tdop-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />{t('auth.back')}
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-tdop-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />{t('auth.signIn')}
            </button>
          )}
        </div>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3"><Logo size="lg" /></div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-tdop-navy">{t('auth.chooseAccountType')}</h1>
        </div>

        {step === 'role' ? (
          <div className="bg-white rounded-2xl shadow-elevated border border-gray-100 p-7 sm:p-8 space-y-4">
            {roleCards.map(card => {
              const Icon = card.icon;
              const active = selectedRole === card.role;
              return (
                <button key={card.role} onClick={() => chooseRole(card.role)} className={`${cardBase} ${active ? card.activeRing : card.idleRing}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${active ? 'bg-white text-tdop-primary' : 'text-gray-400'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-tdop-navy">{card.title}</h3>
                      <p className="mt-0.5 text-sm text-gray-500">{card.subtitle}</p>
                    </div>
                    {active && <CheckCircle2 className="w-6 h-6 text-tdop-primary shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-elevated border border-gray-100 p-7 sm:p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              {error && (
                <div role="alert" className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-500">
                {selectedRole === 'seeker' ? <User className="w-4 h-4 text-tdop-primary" /> : <Building2 className="w-4 h-4 text-tdop-secondary" />}
                {selectedRole === 'seeker' ? t('auth.individualTitle') : t('auth.orgTitle')}
              </div>

              <div>
                <label className="block text-sm font-medium text-tdop-navy mb-1.5">{t('auth.fullName')}</label>
                <input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-tdop-primary focus:ring-2 focus:ring-tdop-primary/20 outline-none transition-all text-sm" placeholder="Juma Mushi" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-tdop-navy mb-1.5">{t('auth.email')}</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-tdop-primary focus:ring-2 focus:ring-tdop-primary/20 outline-none transition-all text-sm" placeholder="name@example.com" required />
              </div>

              {selectedRole === 'organization' && (
                <div>
                  <label className="block text-sm font-medium text-tdop-navy mb-1.5">{t('auth.organizationName')}</label>
                  <input type="text" value={form.organizationName} onChange={e => setForm({ ...form, organizationName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-tdop-primary focus:ring-2 focus:ring-tdop-primary/20 outline-none transition-all text-sm" placeholder="Your Organization" required />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-tdop-navy mb-1.5">{t('auth.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-tdop-primary focus:ring-2 focus:ring-tdop-primary/20 outline-none transition-all text-sm" placeholder="••••••••" required minLength={8} />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-tdop-navy mb-1.5">{t('auth.confirmPassword')}</label>
                <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-tdop-primary focus:ring-2 focus:ring-tdop-primary/20 outline-none transition-all text-sm" placeholder="••••••••" required minLength={8} />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-tdop-primary hover:bg-blue-700 text-white font-semibold shadow-soft hover:shadow-elevated transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                {t('auth.continueBtn')}
              </button>
            </form>

            <div className="text-center mt-5 text-sm text-gray-600">
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="font-semibold text-tdop-primary hover:underline">{t('auth.signInHere')}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
