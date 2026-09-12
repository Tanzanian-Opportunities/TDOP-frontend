import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, LoginCredentials, RegisterData, AuthTokens, AuthState } from '@/types/user';
import { authApi } from '@/services/api/authApi';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('tdop-user');
    const storedTokens = localStorage.getItem('tdop-tokens');
    try {
      const user = storedUser ? JSON.parse(storedUser) : null;
      const tokens = storedTokens ? JSON.parse(storedTokens) : null;
      if (user && tokens) {
        setState({ user, tokens, isAuthenticated: true, isLoading: false });
        return;
      }
    } catch {
      localStorage.removeItem('tdop-user');
      localStorage.removeItem('tdop-tokens');
    }
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    const { user, tokens } = response?.data || {};
    if (!user || !tokens) return;
    localStorage.setItem('tdop-user', JSON.stringify(user));
    localStorage.setItem('tdop-tokens', JSON.stringify(tokens));
    setState({ user, tokens, isAuthenticated: true, isLoading: false });
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = await authApi.register(data);
    const { user, tokens } = response?.data || {};
    if (!user || !tokens) return;
    localStorage.setItem('tdop-user', JSON.stringify(user));
    localStorage.setItem('tdop-tokens', JSON.stringify(tokens));
    setState({ user, tokens, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('tdop-user');
      localStorage.removeItem('tdop-tokens');
      setState({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const tokens = await authApi.refresh();
    localStorage.setItem('tdop-tokens', JSON.stringify(tokens));
    setState(prev => ({ ...prev, tokens }));
  }, []);

  const updateUser = useCallback((user: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...user };
      localStorage.setItem('tdop-user', JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshSession, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
