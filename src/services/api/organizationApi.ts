import axiosInstance from './axiosInstance';

export const organizationApi = {
  getOrganizations: async (params?: { search?: string; industry?: string }): Promise<any> => {
    const { data } = await axiosInstance.get('/organization/profile/all', { params });
    return data;
  },
};
