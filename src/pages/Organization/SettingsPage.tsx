import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { PageError } from '@/components/ui/PageStates';
import { profileApi } from '@/services/api/profileApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { Settings, Bell, Globe, Shield, Save } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [notifPreference, setNotifPreference] = useState('ALL');

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLanguage(i18n.language || 'en');
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('tdop-language', lang);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (visibility) await profileApi.updateVisibility(visibility);
      if (notifPreference) await profileApi.updateNotificationPreference(notifPreference);
      addNotification({ type: 'success', title: t('common.success'), message: t('settings.saveSuccess') });
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || t('settings.saveFailed') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) return <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><PageError message={t('common.errorLoading')} onRetry={fetchSettings} /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <Settings className="w-8 h-8 text-tdop-primary" />
          {t('settings.title')}
        </h1>
        <p className="text-gray-500 mt-1">{t('settings.description')}</p>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-tdop-navy font-semibold">
            <Globe className="w-4 h-4" /> {t('settings.language')}
          </div>
          <Select
            value={language}
            onChange={(e: any) => handleLanguageChange(e.target.value)}
            options={[
              { value: 'en', label: 'English' },
              { value: 'sw', label: 'Kiswahili' },
            ]}
          />
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-tdop-navy font-semibold">
            <Shield className="w-4 h-4" /> {t('settings.profileVisibility')}
          </div>
          <p className="text-sm text-gray-500">{t('settings.visibilityDescription')}</p>
          <Select
            value={visibility}
            onChange={(e: any) => setVisibility(e.target.value)}
            options={[
              { value: 'PUBLIC', label: t('settings.visibilityPublic') },
              { value: 'ORGANIZATIONS_ONLY', label: t('settings.visibilityOrgs') },
              { value: 'PRIVATE', label: t('settings.visibilityPrivate') },
            ]}
          />
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-tdop-navy font-semibold">
            <Bell className="w-4 h-4" /> {t('settings.notificationPreferences')}
          </div>
          <p className="text-sm text-gray-500">{t('settings.notifDescription')}</p>
          <Select
            value={notifPreference}
            onChange={(e: any) => setNotifPreference(e.target.value)}
            options={[
              { value: 'ALL', label: t('settings.notifAll') },
              { value: 'IMPORTANT_ONLY', label: t('settings.notifImportant') },
              { value: 'NONE', label: t('settings.notifNone') },
            ]}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving}>
          <Save className="w-4 h-4 mr-2" /> {t('common.save')}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
