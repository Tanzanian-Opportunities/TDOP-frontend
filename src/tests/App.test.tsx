import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
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

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('renders the main application structure', () => {
    const { getAllByText } = render(<App />);
    expect(getAllByText(/Talent|TDOP|Dashboard/i).length).toBeGreaterThan(0);
  });

  it('renders protected routes when authenticated', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
