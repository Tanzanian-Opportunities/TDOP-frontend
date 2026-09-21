import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import Logo from '@/components/layout/Logo';
import { User, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login({ email, password });
      try {
        const stored = JSON.parse(localStorage.getItem('tdop-user') || '{}');
        const role = stored?.role;
        if (role === 'super_admin') {
          navigate('/super-admin');
        } else if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'moderator' || role === 'verification_officer') {
          navigate('/trust');
        } else if (role === 'organization' || role === 'organization_admin' || role === 'organization_member') {
          navigate('/my-jobs');
        } else {
          navigate('/dashboard');
        }
      } catch {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-tdop-navy">
            {t('auth.signInTitle')}
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            {t('auth.signInSubtitle')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-elevated border border-gray-100 p-7 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div role="alert" className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="emailOrPhone" className="block text-sm font-medium text-tdop-navy mb-1.5">{t('auth.emailOrPhone')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="emailOrPhone"
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-tdop-primary focus:ring-2 focus:ring-tdop-primary/20 outline-none transition-all duration-200 text-sm"
                  placeholder="name@example.com"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-tdop-navy mb-1.5">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-tdop-primary focus:ring-2 focus:ring-tdop-primary/20 outline-none transition-all text-sm"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-tdop-primary focus:ring-tdop-primary" defaultChecked />
                {t('auth.rememberMe')}
              </label>
              <Link to="/forgot-password" className="text-sm text-tdop-primary hover:underline">
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-tdop-primary hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold shadow-soft hover:shadow-elevated transition-all duration-200"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {t('app.loading')}
                </span>
              ) : (
                t('auth.signInBtn')
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-tdop-primary hover:underline">
            {t('auth.signUpHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
