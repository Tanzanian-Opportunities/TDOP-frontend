import axiosInstance from './axiosInstance';
import { User } from '@/types/user';
import { PaginatedApiResponse } from '@/types/opportunity';
import { ApiResponse } from '@/types/api';

export const adminApi = {
  getUsers: async (params?: { page?: number; limit?: number; role?: string }): Promise<PaginatedApiResponse<User>> => {
    const { data } = await axiosInstance.get('/admin/users', { params });
    return data;
  },
  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.get(`/admin/users/${id}`);
    return data;
  },
  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const { data: response } = await axiosInstance.put(`/admin/users/${id}`, data);
    return response;
  },
  deleteUser: async (id: string): Promise<ApiResponse<unknown>> => {
    await axiosInstance.delete(`/admin/users/${id}`);
    return { success: true };
  },
  verifyUser: async (id: string): Promise<ApiResponse<{ verified: boolean }>> => {
    const { data } = await axiosInstance.post(`/admin/users/${id}/verify`);
    return data;
  },
  getAnalytics: async (params?: { dateFrom?: string; dateTo?: string }): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.get('/admin/analytics', { params });
    return data;
  },
  verifyOpportunity: async (id: string): Promise<ApiResponse<{ verified: boolean }>> => {
    const { data } = await axiosInstance.post(`/admin/opportunities/${id}/verify`);
    return data;
  },
  rejectOpportunity: async (id: string, reason: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.post(`/admin/opportunities/${id}/reject`, { reason });
    return data;
  },
  getReports: async (params?: { page?: number; limit?: number }): Promise<PaginatedApiResponse<any>> => {
    const { data } = await axiosInstance.get('/admin/reports', { params });
    return data;
  },
  getAuditLog: async (params?: { page?: number; limit?: number }): Promise<PaginatedApiResponse<any>> => {
    const { data } = await axiosInstance.get('/admin/audit-log', { params });
    return data;
  },
};
