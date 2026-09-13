import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UserProfile } from '@/components/profile/UserProfile';
import { ProfileEdit } from '@/components/profile/ProfileEdit';
import { Edit3, Shield, MapPin, Calendar } from 'lucide-react';

const OrganizationProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const mockProfile = {
    id: '1',
    userId: '1',
    organizationName: 'Tech Corp',
    slug: 'tech-corp',
    description: 'We are a leading technology company.',
    mission: 'Empowering developers worldwide.',
    location: 'San Francisco, CA',
    isVerified: true,
    verificationStatus: 'verified' as const,
    industry: 'Technology',
    companySize: '500+',
    foundedYear: 2010,
    createdAt: '2020-01-01',
    updatedAt: '2024-01-01',
  };

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
        <ProfileEdit />
      ) : (
        <UserProfile profile={mockProfile as any} isOrganization={true} />
      )}

      <Card>
        <h2 className="text-lg font-semibold text-tdop-navy mb-4">{t('organization.verification')}</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 bg-gray-50 rounded-lg">
            <span className="text-gray-600">{t('organization.verifiedStatus', { status: mockProfile.verificationStatus })}</span>
            {mockProfile.isVerified && <Badge variant="verified">Verified</Badge>}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrganizationProfilePage;
