import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { AuthContext } from '@/context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const mockAuthContext = {
  user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User', role: 'seeker' as const, isActive: true, isVerified: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  tokens: { accessToken: 'access.token', refreshToken: 'refresh.token' },
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refreshSession: vi.fn(),
  updateUser: vi.fn(),
};

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthContext}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns user data when authenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toEqual(mockAuthContext.user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('returns admin role when user is admin', () => {
    const adminContext = { ...mockAuthContext, user: { ...mockAuthContext.user, role: 'admin' as const } };
    const { result } = renderHook(() => useAuth(), { wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={adminContext}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    )});
    expect(result.current.isAdmin).toBe(true);
  });

  it('returns seeker role when user is a seeker', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isSeeker).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  it('returns organization role when user is organization', () => {
    const orgContext = { ...mockAuthContext, user: { ...mockAuthContext.user, role: 'organization' as const } };
    const { result } = renderHook(() => useAuth(), { wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={orgContext}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    )});
    expect(result.current.isOrganization).toBe(true);
  });

  it('provides login function that calls mutation', async () => {
    const login = vi.fn().mockResolvedValue({ user: mockAuthContext.user, tokens: mockAuthContext.tokens });
    const context = { ...mockAuthContext, login };
    const { result } = renderHook(() => useAuth(), { wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={context}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    )});

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' });
    });

    expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
  });

  it('provides logout function', async () => {
    const logout = vi.fn().mockResolvedValue(undefined);
    const context = { ...mockAuthContext, logout };
    const { result } = renderHook(() => useAuth(), { wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={context}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    )});

    await act(async () => {
      await result.current.logout();
    });

    expect(logout).toHaveBeenCalled();
  });

  it('returns profile loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.profileLoading).toBe(false);
  });

  it('returns isLoading state when not authenticated', () => {
    const unauthContext = { ...mockAuthContext, isAuthenticated: false, isLoading: true };
    const { result } = renderHook(() => useAuth(), { wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={unauthContext}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    )});
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });
});
