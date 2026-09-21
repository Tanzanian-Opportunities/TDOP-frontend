import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertTriangle, SearchX, ShieldOff, Lock, Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

interface PageStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: { label: string; to: string; onClick?: () => void };
  onRetry?: () => void;
}

const PageStateBase: React.FC<PageStateProps> = ({ title, description, icon, action, onRetry }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center min-h-[300px]">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-tdop-navy mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button variant="primary" size="md" onClick={onRetry}>
            {t('pageStates.tryAgain')}
          </Button>
        )}
        {action && (
          <Link to={action.to}>
            <Button variant={onRetry ? 'outline' : 'primary'} size="md">
              {action.label}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export const PageLoading: React.FC<{ text?: string }> = ({ text }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[300px]" role="status" aria-live="polite">
      <Loader2 className="w-8 h-8 text-tdop-primary animate-spin mb-3" />
      <p className="text-sm text-gray-500">{text || t('pageStates.loading')}</p>
    </div>
  );
};

export const PageError: React.FC<{ title?: string; message?: string; onRetry?: () => void }> = ({
  title,
  message,
  onRetry,
}) => {
  const { t } = useTranslation();
  return (
    <PageStateBase
      title={title || t('pageStates.somethingWrong')}
      description={message || t('pageStates.errorMessage')}
      icon={<AlertTriangle className="w-8 h-8 text-red-500" />}
      onRetry={onRetry}
    />
  );
};

export const PageEmpty: React.FC<{
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: { label: string; to: string };
}> = ({
  title,
  description,
  icon,
  action,
}) => {
  const { t } = useTranslation();
  return (
    <PageStateBase
      title={title || t('pageStates.nothingHere')}
      description={description || t('pageStates.nothingHereDesc')}
      icon={icon || <Inbox className="w-8 h-8 text-gray-400" />}
      action={action}
    />
  );
};

export const PageNotFound: React.FC<{ action?: { label: string; to: string } }> = ({
  action,
}) => {
  const { t } = useTranslation();
  return (
    <PageStateBase
      title={t('pageStates.notFound')}
      description={t('pageStates.notFoundDesc')}
      icon={<SearchX className="w-8 h-8 text-gray-400" />}
      action={action || { label: t('pageStates.goHome'), to: '/' }}
    />
  );
};

export const PageForbidden: React.FC<{ action?: { label: string; to: string } }> = ({
  action,
}) => {
  const { t } = useTranslation();
  return (
    <PageStateBase
      title={t('pageStates.accessDenied')}
      description={t('pageStates.accessDeniedDesc')}
      icon={<ShieldOff className="w-8 h-8 text-red-400" />}
      action={action || { label: t('pageStates.goHome'), to: '/' }}
    />
  );
};

export const PageUnauthorized: React.FC<{ action?: { label: string; to: string } }> = ({
  action,
}) => {
  const { t } = useTranslation();
  return (
    <PageStateBase
      title={t('pageStates.signInRequired')}
      description={t('pageStates.signInRequiredDesc')}
      icon={<Lock className="w-8 h-8 text-gray-400" />}
      action={action || { label: t('pageStates.signIn'), to: '/login' }}
    />
  );
};
