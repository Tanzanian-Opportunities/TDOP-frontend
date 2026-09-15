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

  const suspendUserMutation = useMutation({
    mutationFn: (id: string) => adminApi.suspendUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin/users'] });
      addNotification({ type: 'success', title: 'Suspended', message: 'User suspended.' });
    },
    onError: () => {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to suspend user.' });
    },
  });

  return {
    users: usersQuery.data?.data || [],
    total: usersQuery.data?.pagination?.total || 0,
    isLoading: usersQuery.isLoading,
    suspendUser: suspendUserMutation.mutateAsync,
  };
};
