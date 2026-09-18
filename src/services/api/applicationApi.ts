import axiosInstance from './axiosInstance';
import { Application, ApplicationCreate, ApplicationUpdate, ApplicationsList } from '@/types/application';
import { ApiResponse } from '@/types/api';

const normalizeList = (list: Application[]): ApplicationsList => {
  const arr = Array.isArray(list) ? list : [];
  return { applications: arr, total: arr.length, page: 1, limit: arr.length };
};

export const applicationApi = {
  apply: async (data: ApplicationCreate): Promise<ApiResponse<Application>> => {
    const { data: response } = await axiosInstance.post('/applications', {
      coverLetter: data.coverLetter,
      resumeUrl: data.resumeUrl,
    }, {
      params: { oppId: data.opportunityId },
    });
    return { success: true, data: response };
  },
  getApplications: async (params?: { page?: number; limit?: number }): Promise<ApplicationsList> => {
    const { data } = await axiosInstance.get('/organization/applications', { params });
    return normalizeList(data);
  },
  getApplication: async (id: string): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.get(`/applications/${id}`);
    return { success: true, data };
  },
  updateApplication: async (id: string, data: ApplicationUpdate): Promise<ApiResponse<Application>> => {
    const { data: response } = await axiosInstance.put(`/applications/${id}/status`, null, {
      params: { status: data.status },
    });
    return { success: true, data: response };
  },
  withdrawApplication: async (id: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.post(`/applications/${id}/withdraw`);
    return { success: true, data };
  },
  getMyApplications: async (): Promise<ApplicationsList> => {
    const { data } = await axiosInstance.get('/applications/me');
    return normalizeList(data);
  },
  getApplicants: async (opportunityId: string): Promise<ApiResponse<Application[]>> => {
    const { data } = await axiosInstance.get(`/organization/opportunities/${opportunityId}/applicants`);
    return { success: true, data };
  },
  shortlistApplication: async (applicationId: string): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.post(`/organization/opportunities/applications/${applicationId}/shortlist`);
    return { success: true, data };
  },
  rejectApplication: async (applicationId: string, reason?: string): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.post(`/organization/opportunities/applications/${applicationId}/reject`, null, {
      params: reason ? { reason } : {},
    });
    return { success: true, data };
  },
  submitOpportunity: async (id: string): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.post(`/organization/opportunities/${id}/submit`);
    return { success: true, data };
  },
  publishOpportunity: async (id: string): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.post(`/organization/opportunities/${id}/publish`);
    return { success: true, data };
  },
};