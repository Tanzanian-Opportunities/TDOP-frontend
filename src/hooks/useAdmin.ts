import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/services/api/adminApi';
import { useNotificationContext } from '@/context/NotificationContext';

export const useAdmin = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationContext();

  const usersQuery = useQuery({
    queryKey: ['admin/users'],
    queryFn: () => adminApi.getUsers(),
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const verifyUserMutation = useMutation({
    mutationFn: (id: string) => adminApi.verifyUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin/users'] });
      addNotification({ type: 'success', title: 'Verified', message: 'User verified.' });
    },
    onError: () => {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to verify user.' });
    },
  });

  return {
    users: usersQuery.data?.data || [],
    total: usersQuery.data?.pagination?.total || 0,
    isLoading: usersQuery.isLoading,
    verifyUser: verifyUserMutation.mutateAsync,
  };
};
