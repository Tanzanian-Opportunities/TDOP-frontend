import React from 'react';
import { OpportunityFilter, OpportunityType } from '@/types/opportunity';
import { SearchBar } from '@/components/ui/SearchBar';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from 'react-i18next';
import { Filter, X, SlidersHorizontal } from 'lucide-react';

interface OpportunityFiltersProps {
  filters: OpportunityFilter;
  onFilterChange: (key: keyof OpportunityFilter, value: any) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export const OpportunityFilters: React.FC<OpportunityFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '' && v !== null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="font-semibold text-gray-900 dark:text-white">{t('opportunities.filters')}</h2>
          {hasActiveFilters && (
            <Badge variant="primary" className="bg-tdop-primary/10 text-tdop-primary">
              {t('common.active')}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            <Filter className="w-4 h-4 mr-1" />
            {isExpanded ? t('common.seeLess') : t('common.seeMore')}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-1" />
              {t('opportunities.clearFilters')}
            </Button>
          )}
        </div>
      </div>

      <SearchBar
        value={filters.search || ''}
        onChange={(value) => onFilterChange('search', value)}
        placeholder={t('app.search')}
        loading={isLoading}
      />

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          <Select
            label={t('opportunities.typeLabel')}
            options={[
              { value: '', label: t('common.all') },
              { value: 'internship', label: t('opportunities.type.internship') },
              { value: 'full-time', label: t('opportunities.type.full-time') },
              { value: 'part-time', label: t('opportunities.type.part-time') },
              { value: 'freelance', label: t('opportunities.type.freelance') },
              { value: 'volunteer', label: t('opportunities.type.volunteer') },
              { value: 'apprenticeship', label: t('opportunities.type.apprenticeship') },
            ]}
            value={filters.type || ''}
            onChange={(e) => onFilterChange('type', e.target.value)}
          />
          <Select
            label={t('opportunities.experience')}
            options={[
              { value: '', label: t('common.all') },
              { value: 'entry', label: t('common.entryLevel') },
              { value: 'mid', label: t('common.midLevel') },
              { value: 'senior', label: t('common.seniorLevel') },
              { value: 'executive', label: t('common.executive') },
            ]}
            value={filters.experience || ''}
            onChange={(e) => onFilterChange('experience', e.target.value)}
          />
          <Select
            label={t('common.location')}
            options={[
              { value: '', label: t('common.all') },
              { value: 'remote', label: t('opportunities.remote') },
              { value: 'on-site', label: t('opportunities.onSite') },
              { value: 'hybrid', label: t('opportunities.hybrid') },
            ]}
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
          />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">{t('opportunities.salary')}</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={t('common.min')}
                value={filters.minSalary || ''}
                onChange={(e) => onFilterChange('minSalary', Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-tdop-primary focus:border-transparent"
              />
              <input
                type="number"
                placeholder={t('common.max')}
                value={filters.maxSalary || ''}
                onChange={(e) => onFilterChange('maxSalary', Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-tdop-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
