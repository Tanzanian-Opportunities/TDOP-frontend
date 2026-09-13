import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOpportunities } from '@/hooks/useOpportunities';
import { OpportunityCardList } from '@/components/opportunity/OpportunityCardList';
import { OpportunityFilters } from '@/components/opportunity/OpportunityFilters';
import { SearchBar } from '@/components/ui/SearchBar';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';

const BrowseOpportunitiesPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { opportunities, isLoading, total, search, filters, setFilter, clearFilters } = useOpportunities();
  const [searchInput, setSearchInput] = React.useState('');

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy">{t('opportunities.browseTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('opportunities.showing', { shown: opportunities.length, total })}
        </p>
      </div>

      <OpportunityCardList opportunities={opportunities} isLoading={isLoading} />
    </div>
  );
};

export default BrowseOpportunitiesPage;
