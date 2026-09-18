import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi, Notification } from '@/services/api/notificationApi';
import { useNotificationContext } from '@/context/NotificationContext';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationContext();

  const { data, isLoading, isError, refetch } = useQuery({
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

  const notifications: Notification[] = Array.isArray(data) ? data : [];
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  return {
    notifications,
    unreadCount,
    total: notifications.length,
    isLoading,
    isError,
    refetch,
    markAsRead,
    markAllAsRead,
  };
};
