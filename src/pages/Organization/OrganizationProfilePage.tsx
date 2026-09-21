import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { PageError } from '@/components/ui/PageStates';
import { profileApi } from '@/services/api/profileApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { Edit3, Shield, MapPin, Calendar, Building2, Globe, Users, Briefcase, Save, Link as LinkIcon } from 'lucide-react';

const OrganizationProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    organizationName: '',
    description: '',
    websiteUrl: '',
    industry: '',
    companySize: '',
    logo: '',
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await profileApi.getOrganizationProfile();
      setProfile(data);
      setForm({
        organizationName: data?.organizationName || '',
        description: data?.description || '',
        websiteUrl: data?.websiteUrl || '',
        industry: data?.industry || '',
        companySize: data?.companySize || '',
        logo: data?.logo || '',
      });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileApi.updateOrganizationProfile(form);
      addNotification({ type: 'success', title: t('common.success'), message: t('orgProfile.updateSuccess') });
      setIsEditing(false);
      fetchProfile();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || t('orgProfile.updateFailed') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) return <PageError message={t('orgProfile.loadError')} onRetry={fetchProfile} />;

  const profileComplete = [
    profile?.organizationName,
    profile?.description,
    profile?.websiteUrl,
    profile?.industry,
    profile?.companySize,
    profile?.logo,
  ].filter(Boolean).length;
  const completionPct = Math.round((profileComplete / 6) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-tdop-navy">{t('organization.profile')}</h1>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          <Edit3 className="w-4 h-4 mr-2" />
          {isEditing ? t('common.cancel') : t('organization.editProfile')}
        </Button>
      </div>

      {isEditing ? (
        <Card>
          <div className="space-y-5">
            <Input
              label={t('orgProfile.orgName')}
              value={form.organizationName}
              onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
              placeholder={t('orgProfile.orgNamePlaceholder')}
            />
            <Input
              label={t('orgProfile.description')}
              as="textarea"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={t('orgProfile.descriptionPlaceholder')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('orgProfile.website')}
                value={form.websiteUrl}
                onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                placeholder="https://example.com"
              />
              <Input
                label={t('orgProfile.industry')}
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                placeholder={t('orgProfile.industryPlaceholder')}
              />
            </div>
            <Select
              label={t('orgProfile.companySize')}
              value={form.companySize}
              onChange={(e) => setForm({ ...form, companySize: e.target.value })}
              options={[
                { value: '1-10', label: '1-10' },
                { value: '11-50', label: '11-50' },
                { value: '51-200', label: '51-200' },
                { value: '201-500', label: '201-500' },
                { value: '500+', label: '500+' },
              ]}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>{t('common.cancel')}</Button>
              <Button onClick={handleSave} loading={saving}>
                <Save className="w-4 h-4 mr-2" />
                {t('common.save')}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Profile Completeness */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-tdop-navy">{t('orgProfile.profileCompleteness')}</span>
              <span className="text-sm font-bold text-tdop-primary">{completionPct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-tdop-primary h-2 rounded-full transition-all" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-500">
              <span className={profile?.organizationName ? 'text-tdop-secondary' : ''}>{profile?.organizationName ? '✓' : '⚠'} {t('orgProfile.orgName')}</span>
              <span className={profile?.description ? 'text-tdop-secondary' : ''}>{profile?.description ? '✓' : '⚠'} {t('orgProfile.description')}</span>
              <span className={profile?.websiteUrl ? 'text-tdop-secondary' : ''}>{profile?.websiteUrl ? '✓' : '⚠'} {t('orgProfile.website')}</span>
              <span className={profile?.industry ? 'text-tdop-secondary' : ''}>{profile?.industry ? '✓' : '⚠'} {t('orgProfile.industry')}</span>
              <span className={profile?.companySize ? 'text-tdop-secondary' : ''}>{profile?.companySize ? '✓' : '⚠'} {t('orgProfile.companySize')}</span>
              <span className={profile?.logo ? 'text-tdop-secondary' : ''}>{profile?.logo ? '✓' : '⚠'} {t('orgProfile.logo')}</span>
            </div>
          </Card>

          {/* Profile Header */}
          {profile && (
            <Card>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {profile.logo ? (
                    <img src={profile.logo} alt={profile.organizationName} className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-tdop-primary/10 text-tdop-primary flex items-center justify-center">
                      <Building2 className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-tdop-navy">{profile.organizationName}</h2>
                      {profile.isVerified && <Badge variant="success">{t('orgProfile.verified')}</Badge>}
                    </div>
                    <p className="text-gray-500 mt-1">{profile.description || t('orgProfile.noDescription')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {profile.industry && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      {profile.industry}
                    </div>
                  )}
                  {profile.companySize && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      {profile.companySize}
                    </div>
                  )}
                  {profile.websiteUrl && (
                    <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-tdop-primary hover:underline">
                      <LinkIcon className="w-4 h-4" />
                      {t('orgProfile.website')}
                    </a>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Verification Status */}
          <Card>
            <h2 className="text-lg font-semibold text-tdop-navy mb-4">{t('organization.verification')}</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-tdop-light rounded-xl">
                <span className="text-gray-600">{t('orgProfile.status')}</span>
                <Badge variant={profile?.isVerified ? 'success' : 'warning'}>
                  {profile?.isVerified ? t('orgProfile.verified') : t('orgProfile.pending')}
                </Badge>
              </div>
              {profile?.verifiedAt && (
                <div className="flex items-center justify-between p-3 bg-tdop-light rounded-xl">
                  <span className="text-gray-600">{t('orgProfile.verifiedOn')}</span>
                  <span className="text-sm text-tdop-navy">{new Date(profile.verifiedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default OrganizationProfilePage;
