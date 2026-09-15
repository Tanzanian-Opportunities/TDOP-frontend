import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/auth/LoginForm';
import { BrowserRouter } from 'react-router-dom';

const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockLogout = vi.fn();
const mockRefreshSession = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout,
    refreshSession: mockRefreshSession,
    updateUser: mockUpdateUser,
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    isAdmin: false,
    isOrganization: false,
    isSeeker: false,
    profileLoading: false,
    profileData: null,
  }),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with email and password fields', () => {
    render(
      <Wrapper>
        <LoginForm />
      </Wrapper>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    render(
      <Wrapper>
        <LoginForm />
      </Wrapper>
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls login when form is submitted with valid credentials', async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <LoginForm />
      </Wrapper>
    );

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
  });

  it('displays error message when login fails', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));

    const user = userEvent.setup();
    render(
      <Wrapper>
        <LoginForm />
      </Wrapper>
    );

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/login failed/i)).toBeInTheDocument();
  });

  it('shows loading state during submission', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {}));
    const { useAuth } = await import('@/hooks/useAuth');
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      refreshSession: vi.fn(),
      refreshUser: vi.fn(),
      updateUser: vi.fn(),
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,
      isAdmin: false,
      isOrganization: false,
      isSeeker: false,
      profileLoading: false,
      profileData: undefined,
    });

    render(
      <Wrapper>
        <LoginForm />
      </Wrapper>
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });
});
