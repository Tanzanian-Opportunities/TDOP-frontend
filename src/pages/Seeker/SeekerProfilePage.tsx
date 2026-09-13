import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/components/profile/UserProfile';
import { ProfileEdit } from '@/components/profile/ProfileEdit';
import { SkillList } from '@/components/profile/SkillList';
import { EducationList } from '@/components/profile/EducationList';
import { InterestList } from '@/components/profile/InterestList';
import { ExperienceList } from '@/components/profile/ExperienceList';
import { CareerGoalList } from '@/components/profile/CareerGoalList';
import { profileApi } from '@/services/api/profileApi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { Edit3 } from 'lucide-react';

const SeekerProfilePage: React.FC = () => {
  const { user, profileData } = useAuth();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['profile'] });

  const handleAddSkill = async (data: { name: string; category: string; level: string }) => {
    await profileApi.addSkill(data);
    invalidate();
  };
  const handleRemoveSkill = async (id: string) => {
    await profileApi.removeSkill(id);
    invalidate();
  };
  const handleAddEducation = async (data: { institution: string; degree: string; fieldOfStudy: string }) => {
    await profileApi.addEducation(data);
    invalidate();
  };
  const handleRemoveEducation = async (id: string) => {
    await profileApi.removeEducation(id);
    invalidate();
  };
  const handleAddInterest = async (data: { category: string; subcategory: string }) => {
    await profileApi.addInterest({ category: data.category, description: data.subcategory });
    invalidate();
  };
  const handleRemoveInterest = async (id: string) => {
    await profileApi.removeInterest(id);
    invalidate();
  };
  const handleAddExperience = async (data: { company: string; title: string; location?: string; startDate?: string; endDate?: string; isCurrent?: boolean; description?: string }) => {
    await profileApi.addExperience(data);
    invalidate();
  };
  const handleRemoveExperience = async (id: string) => {
    await profileApi.removeExperience(id);
    invalidate();
  };
  const handleAddCareerGoal = async (data: { title: string; description?: string; targetIndustry?: string; targetRole?: string; timeline?: string }) => {
    await profileApi.addCareerGoal(data);
    invalidate();
  };
  const handleRemoveCareerGoal = async (id: string) => {
    await profileApi.removeCareerGoal(id);
    invalidate();
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-tdop-navy">{t('profile.title')}</h1>
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
            <SkillList
              skills={(profileData as any)?.skills || []}
              onAdd={handleAddSkill}
              onRemove={handleRemoveSkill}
            />
            <EducationList
              education={(profileData as any)?.education || []}
              onAdd={handleAddEducation}
              onRemove={handleRemoveEducation}
            />
          </div>

          <InterestList
            interests={(profileData as any)?.interests || []}
            onAdd={handleAddInterest}
            onRemove={handleRemoveInterest}
          />

          <ExperienceList
            experiences={(profileData as any)?.experiences || []}
            onAdd={handleAddExperience}
            onRemove={handleRemoveExperience}
          />

          <CareerGoalList
            careerGoals={(profileData as any)?.careerGoals || []}
            onAdd={handleAddCareerGoal}
            onRemove={handleRemoveCareerGoal}
          />
        </>
      )}
    </div>
  );
};

export default SeekerProfilePage;
