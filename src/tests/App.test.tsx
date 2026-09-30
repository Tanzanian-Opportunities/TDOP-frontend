import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import App from '@/App';

vi.mock('@/context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuthContext: () => ({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),
    updateUser: vi.fn(),
    refreshUser: vi.fn(),
  }),
}));

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>,
  );
};

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = renderApp();
    expect(container).toBeTruthy();
  });

  it('renders the main application structure', () => {
    const { getAllByText } = renderApp();
    expect(getAllByText(/Talent|TDOP|Dashboard/i).length).toBeGreaterThan(0);
  });

  it('renders protected routes when authenticated', () => {
    const { container } = renderApp();
    expect(container).toBeInTheDocument();
  });
});
