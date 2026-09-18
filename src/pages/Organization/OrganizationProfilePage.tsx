import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProfileEdit } from '@/components/profile/ProfileEdit';
import { PageError } from '@/components/ui/PageStates';
import { profileApi } from '@/services/api/profileApi';
import { Edit3, Shield, MapPin, Calendar, Building2, Globe, Users, Briefcase } from 'lucide-react';

const OrganizationProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await profileApi.getOrganizationProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    fetchProfile();
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

  if (error) return <PageError message="Failed to load organization profile. Please try again." onRetry={fetchProfile} />;

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
        <>
          {/* Profile Header */}
          {profile && (
            <Card>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {profile.logo ? (
                    <img src={profile.logo} alt={profile.orgName} className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-tdop-primary/10 text-tdop-primary flex items-center justify-center">
                      <Building2 className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-tdop-navy">{profile.orgName}</h2>
                      {profile.verified && <Badge variant="success">Verified</Badge>}
                    </div>
                    <p className="text-gray-500 mt-1">{profile.description || 'No description yet'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {profile.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {profile.location}
                    </div>
                  )}
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
                  {profile.foundedYear && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Est. {profile.foundedYear}
                    </div>
                  )}
                </div>

                {profile.mission && (
                  <div className="p-4 bg-tdop-light rounded-xl">
                    <h3 className="text-sm font-semibold text-tdop-navy mb-1">Mission</h3>
                    <p className="text-sm text-gray-600">{profile.mission}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Verification Status */}
          <Card>
            <h2 className="text-lg font-semibold text-tdop-navy mb-4">{t('organization.verification')}</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-tdop-light rounded-xl">
                <span className="text-gray-600">Status</span>
                <Badge variant={profile?.verified ? 'success' : 'warning'}>
                  {profile?.verified ? 'verified' : 'pending'}
                </Badge>
              </div>
              {profile?.verifiedAt && (
                <div className="flex items-center justify-between p-3 bg-tdop-light rounded-xl">
                  <span className="text-gray-600">Verified on</span>
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
