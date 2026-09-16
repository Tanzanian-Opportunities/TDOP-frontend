import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '@/services/api/applicationApi';
import { Application, ApplicationCreate, ApplicationsList } from '@/types/application';
import { useNotificationContext } from '@/context/NotificationContext';

export const useApplications = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationContext();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['applications'],
    queryFn: () => applicationApi.getMyApplications(),
    refetchOnWindowFocus: false,
  });

  const applyMutation = useMutation({
    mutationFn: (data: ApplicationCreate) => applicationApi.apply(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      addNotification({ type: 'success', title: 'Applied!', message: 'Your application has been submitted.' });
    },
    onError: (error: any) => {
      addNotification({ type: 'error', title: 'Application Failed', message: error?.message || 'Failed to apply.' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => applicationApi.updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      addNotification({ type: 'success', title: 'Updated', message: 'Application updated.' });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (id: string) => applicationApi.withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      addNotification({ type: 'info', title: 'Withdrawn', message: 'Application withdrawn.' });
    },
  });

  const apply = useCallback(async (data: ApplicationCreate) => {
    return applyMutation.mutateAsync(data);
  }, [applyMutation]);

  const updateApplication = useCallback(async (id: string, data: any) => {
    return updateMutation.mutateAsync({ id, data });
  }, [updateMutation]);

  const withdraw = useCallback(async (id: string) => {
    return withdrawMutation.mutateAsync(id);
  }, [withdrawMutation]);

  return {
    applications: (data as ApplicationsList | null)?.applications || (Array.isArray(data) ? data : []),
    total: (data as ApplicationsList | null)?.total || 0,
    isLoading,
    isError,
    refetch,
    apply,
    updateApplication,
    withdraw,
    isApplying: applyMutation.isPending,
  };
};
