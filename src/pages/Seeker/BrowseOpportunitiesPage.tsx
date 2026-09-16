import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOpportunities } from '@/hooks/useOpportunities';
import { PageError } from '@/components/ui/PageStates';
import { OpportunityCardList } from '@/components/opportunity/OpportunityCardList';
import { OpportunityFilters } from '@/components/opportunity/OpportunityFilters';
import { SearchBar } from '@/components/ui/SearchBar';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';
import { ArrowUpDown, Clock, TrendingUp, Calendar } from 'lucide-react';

type SortOption = 'newest' | 'deadline' | 'popular';

const sortLabels: Record<SortOption, string> = {
  newest: 'Newest first',
  deadline: 'Deadline soonest',
  popular: 'Most applicants',
};

const BrowseOpportunitiesPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { opportunities, isLoading, isError, total, search, filters, setFilter, clearFilters } = useOpportunities();
  const [searchInput, setSearchInput] = React.useState('');
  const [sortBy, setSortBy] = React.useState<SortOption>('newest');

  React.useEffect(() => {
    const state = location.state as { search?: string; location?: string } | null;
    if (state?.search) {
      setSearchInput(state.search);
      search(state.search);
    }
    if (state?.location && state.location !== 'all') {
      const map: Record<string, string> = {
        'dar-es-salaam': 'Dar es Salaam',
        'dodoma': 'Dodoma',
        'arusha': 'Arusha',
        'mwanza': 'Mwanza',
        'morogoro': 'Morogoro',
        'zanzibar': 'Zanzibar',
      };
      if (map[state.location]) setFilter('location', map[state.location]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    search(value);
  };

  const sorted = React.useMemo(() => {
    const list = [...opportunities];
    switch (sortBy) {
      case 'deadline':
        return list.sort((a, b) => {
          if (!a.applicationDeadline) return 1;
          if (!b.applicationDeadline) return -1;
          return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        });
      case 'popular':
        return list.sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0));
      case 'newest':
      default:
        return list.sort((a, b) => {
          if (!a.publishedAt) return 1;
          if (!b.publishedAt) return -1;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
    }
  }, [opportunities, sortBy]);

  if (isError) return <PageError message="Failed to load opportunities. Please try again." onRetry={() => {}} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy">{t('opportunities.browseTitle')}</h1>
        <p className="text-gray-500 mt-2">
          {t('opportunities.applyCount', { count: total })} {t('opportunities.title')}
        </p>
      </div>

      <SearchBar value={searchInput} onChange={handleSearch} loading={isLoading} />

      <OpportunityFilters
        filters={filters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        isLoading={isLoading}
      />

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          {t('opportunities.showing', { shown: opportunities.length, total })}
        </p>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-tdop-navy focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
          >
            <option value="newest">{sortLabels.newest}</option>
            <option value="deadline">{sortLabels.deadline}</option>
            <option value="popular">{sortLabels.popular}</option>
          </select>
        </div>
      </div>

      <OpportunityCardList opportunities={sorted} isLoading={isLoading} />
    </div>
  );
};

export default BrowseOpportunitiesPage;
