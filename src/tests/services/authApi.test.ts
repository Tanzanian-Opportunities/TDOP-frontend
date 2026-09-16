import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from '@/services/api/authApi';
import axiosInstance from '@/services/api/axiosInstance';
import { LoginCredentials, RegisterData, User, AuthTokens } from '@/types/user';

vi.mock('@/services/api/axiosInstance', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockPost = vi.mocked(axiosInstance).post as unknown as ReturnType<typeof vi.fn>;
const mockGet = vi.mocked(axiosInstance).get as unknown as ReturnType<typeof vi.fn>;

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'seeker',
  isActive: true,
  isVerified: false,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const mockTokens: AuthTokens = {
  accessToken: 'access.token.here',
  refreshToken: 'refresh.token.here',
};

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login posts credentials and returns user and tokens', async () => {
    mockPost.mockResolvedValue({ data: { success: true, data: { user: mockUser, tokens: mockTokens } } });

    const credentials: LoginCredentials = { email: 'test@example.com', password: 'password123' };
    const result = await authApi.login(credentials);

    expect(mockPost).toHaveBeenCalledWith('/auth/login', credentials);
    expect(result.data?.user).toEqual(mockUser);
    expect(result.data?.tokens).toEqual(mockTokens);
  });

  it('register posts data and returns user and tokens', async () => {
    mockPost.mockResolvedValue({ data: { success: true, data: { user: mockUser, tokens: mockTokens } } });

    const data: RegisterData = {
      email: 'new@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
      role: 'seeker',
    };
    const result = await authApi.register(data);

    expect(mockPost).toHaveBeenCalledWith('/auth/register', {
      email: 'new@example.com',
      password: 'password123',
      fullName: 'New User',
      role: 'SEEKER',
    });
    expect(result.data?.user).toEqual(mockUser);
  });

  it('refresh posts refresh request and returns tokens', async () => {
    mockPost.mockResolvedValue({ data: { success: true, tokens: mockTokens } });

    const result = await authApi.refresh();

    expect(mockPost).toHaveBeenCalledWith('/auth/refresh');
    expect(result).toEqual(mockTokens);
  });

  it('logout posts logout request', async () => {
    mockPost.mockResolvedValue({ data: { success: true } });

    await authApi.logout();

    expect(mockPost).toHaveBeenCalledWith('/auth/logout');
  });

  it('getMe fetches current user profile', async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: mockUser } });

    const result = await authApi.getMe();

    expect(mockGet).toHaveBeenCalledWith('/auth/me');
    expect(result.data).toEqual(mockUser);
  });

  it('forgotPassword posts email for password reset', async () => {
    mockPost.mockResolvedValue({ data: { success: true } });

    const result = await authApi.forgotPassword('test@example.com');

    expect(mockPost).toHaveBeenCalledWith('/auth/forgot-password', { email: 'test@example.com' });
    expect(result.success).toBe(true);
  });

  it('resetPassword posts token and new password', async () => {
    mockPost.mockResolvedValue({ data: { success: true } });

    const result = await authApi.resetPassword('reset-token-123', 'newpassword123');

    expect(mockPost).toHaveBeenCalledWith('/auth/reset-password', {
      token: 'reset-token-123',
      password: 'newpassword123',
    });
    expect(result.success).toBe(true);
  });

  it('login handles error response', async () => {
    mockPost.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });

    await expect(authApi.login({ email: 'test@example.com', password: 'wrong' }))
      .rejects.toMatchObject({ response: { data: { message: 'Invalid credentials' } } });
  });
});
