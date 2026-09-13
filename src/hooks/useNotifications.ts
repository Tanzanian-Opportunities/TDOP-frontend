import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/services/api/notificationApi';
import { NotificationData } from '@/context/NotificationContext';
import { useNotificationContext } from '@/context/NotificationContext';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationContext();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(),
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAsRead = useCallback(async (id: string) => {
    await markAsReadMutation.mutateAsync(id);
  }, [markAsReadMutation]);

  const markAllAsRead = useCallback(async () => {
    await markAllAsReadMutation.mutateAsync();
  }, [markAllAsReadMutation]);

  const addNotificationToState = useCallback((notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => {
    addNotification(notification);
  }, [addNotification]);

  const notifications = data?.data || [];
  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: any) => !n.read).length : 0;

  return {
    notifications,
    unreadCount,
    total: data?.pagination?.total || 0,
    isLoading,
    refetch,
    markAsRead,
    markAllAsRead,
    addNotificationToState,
  };
};
