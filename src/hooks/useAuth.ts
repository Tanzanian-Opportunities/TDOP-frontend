import { useAuthContext } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/api/authApi';
import { useNotificationContext } from '@/context/NotificationContext';

export const useAuth = () => {
  const { user, tokens, isAuthenticated, isLoading, login, register, logout, refreshSession, updateUser, refreshUser } = useAuthContext();
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationContext();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries();
      addNotification({ type: 'success', title: 'Welcome!', message: 'Successfully logged in.' });
    },
    onError: (error: any) => {
      addNotification({ type: 'error', title: 'Login Failed', message: error?.message || 'Login failed.' });
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries();
      addNotification({ type: 'success', title: 'Account Created!', message: 'Successfully registered.' });
    },
    onError: (error: any) => {
      addNotification({ type: 'error', title: 'Registration Failed', message: error?.message || 'Registration failed.' });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      addNotification({ type: 'info', title: 'Logged Out', message: 'You have been logged out.' });
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await authApi.getMe();
      return response?.data || null;
    },
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === 'admin',
    isOrganization: user?.role === 'organization',
    isSeeker: user?.role === 'seeker',
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refreshSession,
    updateUser,
    refreshUser,
    profileLoading: profileQuery.isLoading,
    profileData: profileQuery.data,
  };
};
