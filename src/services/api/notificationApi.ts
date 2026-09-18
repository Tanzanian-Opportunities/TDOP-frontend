import axiosInstance from './axiosInstance';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const { data } = await axiosInstance.get('/notifications');
    return Array.isArray(data) ? data : data?.data || [];
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await axiosInstance.get('/notifications/unread-count');
    return data?.count || 0;
  },

  markAsRead: async (id: string): Promise<void> => {
    await axiosInstance.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.post('/notifications/read-all');
  },
};
