import axiosInstance from './axiosInstance';
import { NotificationData } from '@/context/NotificationContext';
import { PaginatedApiResponse } from '@/types/opportunity';
import { ApiResponse } from '@/types/api';

export const notificationApi = {
  getNotifications: async (params?: { page?: number; limit?: number }): Promise<PaginatedApiResponse<NotificationData>> => {
    const { data } = await axiosInstance.get('/notifications', { params });
    return data;
  },
  markAsRead: async (id: string): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.post(`/notifications/${id}/read`);
    return data;
  },
  markAllAsRead: async (): Promise<ApiResponse<unknown>> => {
    const { data } = await axiosInstance.post('/notifications/read-all');
    return data;
  },
  deleteNotification: async (id: string): Promise<ApiResponse<unknown>> => {
    await axiosInstance.delete(`/notifications/${id}`);
    return { success: true };
  },
};
