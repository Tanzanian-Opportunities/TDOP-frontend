import React from 'react';
import { useTranslation } from 'react-i18next';
import { SeekerProfile, OrganizationProfile } from '@/types/profile';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { Edit, Briefcase, MapPin, Calendar, Mail, Phone } from 'lucide-react';

interface UserProfileProps {
  profile?: SeekerProfile | OrganizationProfile;
  isOrganization?: boolean;
  onEdit?: () => void;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ profile, isOrganization = false, onEdit, className = '' }) => {
  const { t } = useTranslation();

  if (!profile) {
    return (
      <div className="text-center py-16">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-tdop-navy mb-2">{t('profile.title')}</h3>
        <p className="text-gray-500 mb-4">{t('profile.noSkills')}</p>
        {onEdit && <Button onClick={onEdit}>{t('profile.edit')}</Button>}
      </div>
    );
  }

  const getName = () => isOrganization ? (profile as OrganizationProfile).organizationName : `${(profile as SeekerProfile).headline}`;
  const getLocation = () => isOrganization ? (profile as OrganizationProfile).location : '';

  return (
    <div className={`space-y-6 ${className}`}>
      <Card padding={false}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-tdop-primary rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {isOrganization ? (profile as OrganizationProfile).organizationName?.[0] : (profile as SeekerProfile).headline?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-tdop-navy">{getName()}</h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {getLocation() || 'Location not specified'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {isOrganization && (profile as OrganizationProfile).isVerified && (
                  <Badge variant="verified">Verified</Badge>
                )}
              </div>
            </div>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-1" />
                {t('profile.edit')}
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {isOrganization ? (
            <OrganizationProfileContent profile={profile as OrganizationProfile} />
          ) : (
            <SeekerProfileContent profile={profile as SeekerProfile} />
          )}
        </div>
      </Card>
    </div>
  );
};

const OrganizationProfileContent: React.FC<{ profile: OrganizationProfile }> = ({ profile }) => {
  const { t } = useTranslation();
  return (
    <>
      {profile.description && <p className="text-gray-600">{profile.description}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase">{t('profile.industry')}</p>
          <p className="text-sm text-tdop-navy">{profile.industry || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">{t('common.companySize')}</p>
          <p className="text-sm text-tdop-navy">{profile.companySize || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">{t('common.foundedYear')}</p>
          <p className="text-sm text-tdop-navy">{profile.foundedYear ? String(profile.foundedYear) : 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">{t('profile.verificationStatus')}</p>
          <p className="text-sm text-tdop-navy capitalize">{profile.verificationStatus}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        {t('profile.memberSince', { date: formatDate(profile.createdAt) })}
      </div>
    </>
  );
};

const SeekerProfileContent: React.FC<{ profile: SeekerProfile }> = ({ profile }) => {
  const { t } = useTranslation();
  return (
    <>
      {profile.headline && <p className="text-lg text-gray-600">{profile.headline}</p>}
      {profile.summary && <p className="text-gray-600">{profile.summary}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase">{t('profile.skills')}</p>
          <p className="text-sm text-tdop-navy">{profile.skills.length} {t('profile.skills')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">{t('profile.education')}</p>
          <p className="text-sm text-tdop-navy">{profile.education.length} {t('profile.education')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">{t('profile.experience')}</p>
          <p className="text-sm text-tdop-navy">{profile.workExperience?.length || 0}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">{t('profile.interests')}</p>
          <p className="text-sm text-tdop-navy">{profile.interests.length}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        {t('profile.memberSince', { date: formatDate(profile.createdAt) })}
      </div>
    </>
  );
};
