import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens } from '@/types/user';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string | null> | null = null;

const getStoredTokens = (): AuthTokens | null => {
  const stored = localStorage.getItem('tdop-tokens');
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
};

const setStoredTokens = (tokens: AuthTokens) => {
  localStorage.setItem('tdop-tokens', JSON.stringify(tokens));
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = getStoredTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const storedTokens = getStoredTokens();
      if (!storedTokens?.refreshToken) {
        localStorage.removeItem('tdop-user');
        localStorage.removeItem('tdop-tokens');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const res = await axios.post<any>(
              `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'}/auth/refresh`,
              { email: '' },
              {
                headers: {
                  Authorization: `Bearer ${storedTokens.refreshToken}`,
                },
              }
            );
            const data = res.data || {};
            const newTokens = data.tokens || { accessToken: data.token, refreshToken: data.refreshToken };
            if (!newTokens?.accessToken) throw new Error('No tokens in refresh response');
            setStoredTokens(newTokens);
            return newTokens.accessToken;
          } catch (refreshError) {
            localStorage.removeItem('tdop-user');
            localStorage.removeItem('tdop-tokens');
            window.location.href = '/login';
            return null;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      try {
        const newToken = await refreshPromise;
        if (newToken && originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
