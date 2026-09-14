import axiosInstance from './axiosInstance';
import { SeekerProfile, OrganizationProfile, ProfileUpdateData, OrganizationUpdateData } from '@/types/profile';
import { ApiResponse } from '@/types/api';

export const profileApi = {
  getProfile: async (): Promise<ApiResponse<SeekerProfile>> => {
    const { data } = await axiosInstance.get('/profile');
    return data;
  },
  getSeekerProfile: async (): Promise<ApiResponse<SeekerProfile>> => {
    const { data } = await axiosInstance.get('/profile');
    return data;
  },
  getOrganizationProfile: async (): Promise<ApiResponse<OrganizationProfile>> => {
    const { data } = await axiosInstance.get('/profile/organization');
    return data;
  },
  updateProfile: async (data: ProfileUpdateData): Promise<ApiResponse<SeekerProfile>> => {
    const { data: response } = await axiosInstance.put('/profile', data);
    return response;
  },
  updateOrganizationProfile: async (data: OrganizationUpdateData): Promise<ApiResponse<OrganizationProfile>> => {
    const { data: response } = await axiosInstance.put('/profile/organization', data);
    return response;
  },
  addSkill: async (data: { name: string; category: string; level: string }): Promise<ApiResponse<unknown>> => {
    const { data: response } = await axiosInstance.post('/profile/skills', data);
    return response;
  },
  removeSkill: async (skillId: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.delete(`/profile/skills/${skillId}`);
    return data;
  },
  addEducation: async (data: { institution: string; degree: string; fieldOfStudy: string }): Promise<ApiResponse<unknown>> => {
    const { data: response } = await axiosInstance.post('/profile/education', data);
    return response;
  },
  removeEducation: async (educationId: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.delete(`/profile/education/${educationId}`);
    return data;
  },
  addInterest: async (data: { category: string; description: string }): Promise<ApiResponse<unknown>> => {
    const { data: response } = await axiosInstance.post('/profile/interests', data);
    return response;
  },
  removeInterest: async (interestId: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.delete(`/profile/interests/${interestId}`);
    return data;
  },
  addExperience: async (data: { company: string; title: string; location?: string; startDate?: string; endDate?: string; isCurrent?: boolean; description?: string }): Promise<ApiResponse<unknown>> => {
    const { data: response } = await axiosInstance.post('/profile/experience', data);
    return response;
  },
  removeExperience: async (experienceId: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.delete(`/profile/experience/${experienceId}`);
    return data;
  },
  addCareerGoal: async (data: { title: string; description?: string; targetIndustry?: string; targetRole?: string; timeline?: string }): Promise<ApiResponse<unknown>> => {
    const { data: response } = await axiosInstance.post('/profile/career-goals', data);
    return response;
  },
  removeCareerGoal: async (goalId: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.delete(`/profile/career-goals/${goalId}`);
    return data;
  },
  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatar: string }>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await axiosInstance.post('/profile/avatar', formData);
    return data;
  },
  updateVisibility: async (visibility: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.put('/profile/visibility', { visibility });
    return data;
  },
  updateNotificationPreference: async (preference: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.put('/profile/notification-preference', { preference });
    return data;
  },
};
