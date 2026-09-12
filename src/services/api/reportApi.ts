import axiosInstance from './axiosInstance';
import { PaginatedApiResponse } from '@/types/opportunity';
import { ApiResponse } from '@/types/api';

export const reportApi = {
  createReport: async (data: {
    type: string;
    targetType: 'opportunity' | 'user' | 'application';
    targetId: string;
    reason: string;
    description?: string;
  }): Promise<ApiResponse<unknown>> => {
    const { data: response } = await axiosInstance.post('/reports', data);
    return response;
  },
  getReports: async (params?: { page?: number; limit?: number; status?: string }): Promise<PaginatedApiResponse<any>> => {
    const { data } = await axiosInstance.get('/reports', { params });
    return data;
  },
  getReport: async (id: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.get(`/reports/${id}`);
    return data;
  },
  updateReportStatus: async (id: string, status: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.put(`/reports/${id}/status`, { status });
    return data;
  },
  deleteReport: async (id: string): Promise<ApiResponse<unknown>> => {
    await axiosInstance.delete(`/reports/${id}`);
    return { success: true };
  },
};
