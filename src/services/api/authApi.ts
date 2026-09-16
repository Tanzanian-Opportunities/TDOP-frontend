import axiosInstance from './axiosInstance';
import { LoginCredentials, RegisterData, User, AuthTokens, UserRole } from '@/types/user';
import { ApiResponse } from '@/types/api';

interface BackendAuthResponse {
  token?: string;
  refreshToken?: string;
  email?: string;
  fullName?: string;
  role?: string;
}

const ROLE_MAP: Record<string, UserRole> = {
  ADMIN: 'admin',
  ORGANIZATION: 'organization',
  SEEKER: 'seeker',
};

const toUser = (res: BackendAuthResponse): User => {
  const fullName = (res.fullName || res.email || '').trim();
  const [firstName = '', ...rest] = fullName.split(/\s+/);
  return {
    id: res.email || '',
    email: res.email || '',
    firstName,
    lastName: rest.join(' ') || '',
    role: ROLE_MAP[(res.role || '').toUpperCase()] || 'seeker',
    isActive: true,
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const toTokens = (res: BackendAuthResponse): AuthTokens => ({
  accessToken: res.token || '',
  refreshToken: res.refreshToken || '',
});

const normalizeAuthPayload = (body: any): ApiResponse<{ user: User; tokens: AuthTokens }> => {
  if (body?.data?.user && body?.data?.tokens) return body;

  const flat: BackendAuthResponse = body?.data || body || {};
  if (flat.token || flat.email) {
    return {
      success: true,
      data: {
        user: toUser(flat),
        tokens: toTokens(flat),
      },
    };
  }
  return body;
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> => {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    return normalizeAuthPayload(data);
  },
  register: async (data: RegisterData): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> => {
    const payload = {
      email: data.email,
      password: data.password,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      role: data.role.toUpperCase(),
    };
    const { data: response } = await axiosInstance.post('/auth/register', payload);
    return normalizeAuthPayload(response);
  },
  refresh: async (): Promise<AuthTokens> => {
    const { data } = await axiosInstance.post('/auth/refresh');
    if (data?.tokens) return data.tokens;
    return toTokens(data || {});
  },
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
  getMe: async (): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.get('/auth/me');
    return data;
  },
  forgotPassword: async (email: string): Promise<ApiResponse<{ success: boolean }>> => {
    const { data } = await axiosInstance.post('/auth/forgot-password', { email });
    return data;
  },
  resetPassword: async (token: string, password: string): Promise<ApiResponse<{ success: boolean }>> => {
    const { data } = await axiosInstance.post('/auth/reset-password', { token, password });
    return data;
  },
};
