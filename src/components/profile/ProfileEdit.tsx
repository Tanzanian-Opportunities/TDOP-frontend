import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { profileApi } from '@/services/api/profileApi';
import { ProfileUpdateData } from '@/types/profile';
import { Save, Loader2 } from 'lucide-react';

export const ProfileEdit: React.FC = () => {
  const { t } = useTranslation();
  const { refreshUser } = useAuth();
  const { profileData } = useProfile();
  const profile = (profileData || {}) as Record<string, string | undefined>;
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileUpdateData>({
    defaultValues: {
      headline: profile.headline,
      summary: profile.summary,
      portfolioUrl: profile.portfolioUrl,
      linkedinUrl: profile.linkedinUrl,
      githubUrl: profile.githubUrl,
      websiteUrl: profile.websiteUrl,
    },
  });

  const onSubmit = async (data: ProfileUpdateData) => {
    try {
      await profileApi.updateProfile(data);
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy">{t('profile.edit')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('profile.settings')}</p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          Profile updated successfully!
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label={t('profile.headline')}
            placeholder={t('common.headlinePlaceholder')}
            {...register('headline')}
            error={errors.headline?.message}
          />
          <Input
            label={t('profile.summary')}
            as="textarea"
            placeholder={t('common.aboutYourself')}
            rows={4}
            {...register('summary')}
            error={errors.summary?.message}
          />
          <Input
            label="Portfolio URL"
            placeholder={t('common.portfolioUrl')}
            {...register('portfolioUrl')}
            error={errors.portfolioUrl?.message}
          />
          <Input
            label="LinkedIn"
            placeholder={t('common.linkedinUrl')}
            {...register('linkedinUrl')}
            error={errors.linkedinUrl?.message}
          />
          <Input
            label="GitHub"
            placeholder={t('common.githubUrl')}
            {...register('githubUrl')}
            error={errors.githubUrl?.message}
          />
          <Input
            label="Website"
            placeholder={t('common.websiteUrl')}
            {...register('websiteUrl')}
            error={errors.websiteUrl?.message}
          />
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => reset()}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
