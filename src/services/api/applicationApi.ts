import axiosInstance from './axiosInstance';
import { Application, ApplicationCreate, ApplicationUpdate, ApplicationsList } from '@/types/application';
import { ApiResponse } from '@/types/api';

export const applicationApi = {
  apply: async (data: ApplicationCreate): Promise<ApiResponse<Application>> => {
    const { data: response } = await axiosInstance.post('/applications', data);
    return response;
  },
  getApplications: async (params?: { page?: number; limit?: number }): Promise<ApplicationsList> => {
    const { data } = await axiosInstance.get('/applications', { params });
    return data;
  },
  getApplication: async (id: string): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.get(`/applications/${id}`);
    return data;
  },
  updateApplication: async (id: string, data: ApplicationUpdate): Promise<ApiResponse<Application>> => {
    const { data: response } = await axiosInstance.put(`/applications/${id}`, data);
    return response;
  },
  withdrawApplication: async (id: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.post(`/applications/${id}/withdraw`);
    return data;
  },
  getMyApplications: async (): Promise<ApplicationsList> => {
    const { data } = await axiosInstance.get('/applications/my');
    return data;
  },
  getApplicants: async (opportunityId: string): Promise<ApiResponse<Application[]>> => {
    const { data } = await axiosInstance.get(`/opportunities/${opportunityId}/applicants`);
    return data;
  },
};
