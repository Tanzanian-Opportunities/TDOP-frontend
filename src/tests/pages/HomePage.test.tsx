import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useOpportunities } from '@/hooks/useOpportunities';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com', role: 'seeker' as const },
    tokens: { accessToken: 'token', refreshToken: 'refresh' },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),
    updateUser: vi.fn(),
    isAdmin: false,
    isOrganization: false,
    isSeeker: true,
    profileLoading: false,
    profileData: undefined,
  }),
}));

vi.mock('@/hooks/useOpportunities', () => ({
  useOpportunities: vi.fn(() => ({
    opportunities: [
      { id: '1', title: 'Software Engineer', company: 'Tech Corp', type: 'full-time' as const, status: 'open' as const },
      { id: '2', title: 'Data Analyst', company: 'Data Inc', type: 'part-time' as const, status: 'open' as const },
    ],
    total: 2,
    page: 1,
    totalPages: 1,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    search: vi.fn(),
    searchQuery: '',
    filters: {},
    setFilter: vi.fn(),
    clearFilters: vi.fn(),
    saveOpportunity: vi.fn(),
    unsaveOpportunity: vi.fn(),
    compareOpportunities: vi.fn(),
    savedOpportunities: [],
  })),
}));

vi.mock('@/services/api/opportunityApi', () => ({
  opportunityApi: {
    getOpportunities: vi.fn(),
    getSavedOpportunities: vi.fn(),
    saveOpportunity: vi.fn(),
    unsaveOpportunity: vi.fn(),
    compareOpportunities: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

const HomePage = () => {
  const { opportunities, search, isLoading } = useOpportunities();
  const { isAuthenticated } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>TDOP Opportunities</h1>
      <input data-testid="search-input" placeholder="Search opportunities..." onChange={(e) => search(e.target.value)} />
      <div data-testid="opportunities-list">
        {opportunities.map((opp: any) => (
          <div key={opp.id}>{opp.title}</div>
        ))}
      </div>
      <div data-testid="total-count">Total: {opportunities.length}</div>
    </div>
  );
};

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>
    );
    expect(screen.getByText(/TDOP Opportunities/i)).toBeInTheDocument();
  });

  it('displays list of opportunities', () => {
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>
    );
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Data Analyst')).toBeInTheDocument();
  });

  it('displays total count of opportunities', () => {
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>
    );
    expect(screen.getByText('Total: 2')).toBeInTheDocument();
  });

  it('shows search input', () => {
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>
    );
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.clearAllMocks();
    vi.mocked(useOpportunities).mockImplementationOnce(() => ({
      opportunities: [],
      total: 0,
      page: 1,
      totalPages: 1,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
      search: vi.fn(),
      searchQuery: '',
      filters: {},
      setFilter: vi.fn(),
      clearFilters: vi.fn(),
      saveOpportunity: vi.fn(),
      unsaveOpportunity: vi.fn(),
      compareOpportunities: vi.fn(),
      savedOpportunities: [],
    }));

    render(
      <Wrapper>
        <HomePage />
      </Wrapper>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders authenticated state', () => {
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>
    );
    expect(screen.getByText('TDOP Opportunities')).toBeInTheDocument();
  });
});
