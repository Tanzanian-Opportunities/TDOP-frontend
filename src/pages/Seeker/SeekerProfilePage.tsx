import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/components/profile/UserProfile';
import { ProfileEdit } from '@/components/profile/ProfileEdit';
import { SkillList } from '@/components/profile/SkillList';
import { EducationList } from '@/components/profile/EducationList';
import { InterestList } from '@/components/profile/InterestList';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { Edit3 } from 'lucide-react';

const SeekerProfilePage: React.FC = () => {
  const { user, profileData } = useAuth();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</h1>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          <Edit3 className="w-4 h-4 mr-2" />
          {isEditing ? t('common.cancel') : t('profile.edit')}
        </Button>
      </div>

      {isEditing ? (
        <ProfileEdit />
      ) : (
        <>
          <UserProfile
            profile={profileData as any}
            isOrganization={false}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('profile.skills')}</h3>
              <SkillList
                skills={(profileData as any)?.skills || []}
              />
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('profile.education')}</h3>
              <EducationList
                education={(profileData as any)?.education || []}
              />
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('profile.interests')}</h3>
            <InterestList
              interests={(profileData as any)?.interests || []}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default SeekerProfilePage;
