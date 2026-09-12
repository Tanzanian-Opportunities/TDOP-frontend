import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/services/api/profileApi';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile(),
    enabled: !!isAuthenticated,
    refetchOnWindowFocus: false,
  });

  return {
    profileData: data?.data,
    isLoading,
  };
};
