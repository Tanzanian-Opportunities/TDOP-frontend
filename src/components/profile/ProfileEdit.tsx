import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { profileApi } from '@/services/api/profileApi';
import { Save, Eye, EyeOff, Building2, Lock, Bell, BellOff, Info } from 'lucide-react';

export const ProfileEdit: React.FC = () => {
  const { t } = useTranslation();
  const { refreshUser } = useAuth();
  const { profileData } = useProfile();
  const profile = (profileData || {}) as Record<string, any>;
  const [success, setSuccess] = useState(false);
  const [headline, setHeadline] = useState(profile.headline || '');
  const [summary, setSummary] = useState(profile.summary || '');
  const [visibility, setVisibility] = useState(profile.profileVisibility || 'PUBLIC');
  const [notifPref, setNotifPref] = useState(profile.notificationPreference || 'ALL');
  const [savingSection, setSavingSection] = useState<string | null>(null);

  const handleSaveProfile = async () => {
    try {
      setSavingSection('profile');
      await profileApi.updateProfile({ headline, summary });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { /* empty */ } finally {
      setSavingSection(null);
    }
  };

  const handleSaveVisibility = async (value: string) => {
    try {
      setSavingSection('visibility');
      await profileApi.updateVisibility(value);
      setVisibility(value);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { /* empty */ } finally {
      setSavingSection(null);
    }
  };

  const handleSaveNotifPref = async (value: string) => {
    try {
      setSavingSection('notif');
      await profileApi.updateNotificationPreference(value);
      setNotifPref(value);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { /* empty */ } finally {
      setSavingSection(null);
    }
  };

  const visOptions = [
    { value: 'PUBLIC', label: t('profile.visPublic', 'Public'), desc: t('profile.visPublicDesc', 'Anyone can see your name, education, skills, and experience'), icon: Eye },
    { value: 'ORGANIZATIONS_ONLY', label: t('profile.visOrg', 'Organizations Only'), desc: t('profile.visOrgDesc', 'Only verified organizations can see your profile'), icon: Building2 },
    { value: 'PRIVATE', label: t('profile.visPrivate', 'Private'), desc: t('profile.visPrivateDesc', 'Only you can see your full profile'), icon: Lock },
  ];

  const notifOptions = [
    { value: 'ALL', label: t('profile.notifAll', 'All Notifications'), desc: t('profile.notifAllDesc', 'Application updates, deadline reminders, and new opportunities'), icon: Bell },
    { value: 'IMPORTANT_ONLY', label: t('profile.notifImportant', 'Important Only'), desc: t('profile.notifImportantDesc', 'Only application status changes and deadline alerts'), icon: Info },
    { value: 'NONE', label: t('profile.notifNone', 'No Notifications'), desc: t('profile.notifNoneDesc', 'Turn off all in-app notifications'), icon: BellOff },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy">{t('profile.edit')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('profile.settings')}</p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          {t('profile.saveSuccess', 'Profile updated successfully!')}
        </div>
      )}

      <Card>
        <h3 className="font-semibold text-tdop-navy mb-4">{t('profile.basicInfo', 'Basic Information')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.headline')}</label>
            <input
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              placeholder={t('common.headlinePlaceholder')}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-tdop-navy focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.summary')}</label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder={t('common.aboutYourself')}
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-tdop-navy focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} loading={savingSection === 'profile'}>
              <Save className="w-4 h-4 mr-1.5" />
              {t('common.save')}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-tdop-primary" />
          <h3 className="font-semibold text-tdop-navy">{t('profile.visibility', 'Profile Visibility')}</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">{t('profile.visibilityDesc', 'Control who can see your profile information')}</p>
        <div className="space-y-2">
          {visOptions.map(opt => {
            const Icon = opt.icon;
            const isSelected = visibility === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSaveVisibility(opt.value)}
                disabled={savingSection === 'visibility'}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-tdop-primary bg-tdop-primary/5 ring-1 ring-tdop-primary/20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-tdop-primary text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className={`font-medium text-sm ${isSelected ? 'text-tdop-primary' : 'text-tdop-navy'}`}>{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
                {isSelected && (
                  <div className="ml-auto shrink-0">
                    <div className="w-5 h-5 rounded-full bg-tdop-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-tdop-accent" />
          <h3 className="font-semibold text-tdop-navy">{t('profile.notifPrefs', 'Notification Preferences')}</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">{t('profile.notifPrefsDesc', 'Choose which notifications you receive')}</p>
        <div className="space-y-2">
          {notifOptions.map(opt => {
            const Icon = opt.icon;
            const isSelected = notifPref === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSaveNotifPref(opt.value)}
                disabled={savingSection === 'notif'}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-tdop-accent bg-amber-50/50 ring-1 ring-tdop-accent/20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-tdop-accent text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className={`font-medium text-sm ${isSelected ? 'text-amber-700' : 'text-tdop-navy'}`}>{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
                {isSelected && (
                  <div className="ml-auto shrink-0">
                    <div className="w-5 h-5 rounded-full bg-tdop-accent flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
