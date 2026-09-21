import React from 'react';
import { OpportunityFilter, OpportunityType } from '@/types/opportunity';
import { SearchBar } from '@/components/ui/SearchBar';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from 'react-i18next';
import { Filter, X, SlidersHorizontal, Shield } from 'lucide-react';

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

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '' && v !== null && v !== false);

  const activeCount = Object.entries(filters).filter(([k, v]) =>
    v !== undefined && v !== '' && v !== null && v !== false && k !== 'page' && k !== 'limit'
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-tdop-navy">{t('oppFilters.filters')}</h2>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-tdop-primary/10 text-tdop-primary text-xs font-medium rounded-full">
              {activeCount} {t('oppFilters.active')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            <Filter className="w-4 h-4 mr-1" />
            {isExpanded ? t('oppFilters.lessFilters') : t('oppFilters.moreFilters')}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-1" />
              {t('oppFilters.clearAll')}
            </Button>
          )}
        </div>
      </div>

      <SearchBar
        value={filters.search || ''}
        onChange={(value) => onFilterChange('search', value)}
        placeholder={t('oppFilters.searchPlaceholder')}
        loading={isLoading}
      />

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          <Select
            label={t('oppFilters.type')}
            options={[
              { value: '', label: t('oppFilters.allTypes') },
              { value: 'internship', label: t('oppFilters.internship') },
              { value: 'full-time', label: t('oppFilters.fullTime') },
              { value: 'part-time', label: t('oppFilters.partTime') },
              { value: 'freelance', label: t('oppFilters.freelance') },
              { value: 'volunteer', label: t('oppFilters.volunteer') },
              { value: 'apprenticeship', label: t('oppFilters.apprenticeship') },
            ]}
            value={filters.type || ''}
            onChange={(e) => onFilterChange('type', e.target.value)}
          />
          <Select
            label={t('oppFilters.experience')}
            options={[
              { value: '', label: t('oppFilters.allLevels') },
              { value: 'entry', label: t('oppFilters.entryLevel') },
              { value: 'mid', label: t('oppFilters.midLevel') },
              { value: 'senior', label: t('oppFilters.seniorLevel') },
              { value: 'executive', label: t('oppFilters.executive') },
            ]}
            value={filters.experience || ''}
            onChange={(e) => onFilterChange('experience', e.target.value)}
          />
          <Select
            label={t('oppFilters.workMode')}
            options={[
              { value: '', label: t('oppFilters.allModes') },
              { value: 'remote', label: t('oppFilters.remote') },
              { value: 'on-site', label: t('oppFilters.onSite') },
              { value: 'hybrid', label: t('oppFilters.hybrid') },
            ]}
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
          />
          <Select
            label={t('oppFilters.category')}
            options={[
              { value: '', label: t('oppFilters.allCategories') },
              { value: 'technology', label: t('oppFilters.technology') },
              { value: 'business', label: t('oppFilters.business') },
              { value: 'design', label: t('oppFilters.design') },
              { value: 'marketing', label: t('oppFilters.marketing') },
              { value: 'engineering', label: t('oppFilters.engineering') },
              { value: 'healthcare', label: t('oppFilters.healthcare') },
              { value: 'education', label: t('oppFilters.education') },
              { value: 'finance', label: t('oppFilters.finance') },
              { value: 'agriculture', label: t('oppFilters.agriculture') },
              { value: 'government', label: t('oppFilters.government') },
            ]}
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
          />
          <Select
            label={t('oppFilters.educationLevel')}
            options={[
              { value: '', label: t('oppFilters.allLevels') },
              { value: 'certificate', label: t('oppFilters.certificate') },
              { value: 'diploma', label: t('oppFilters.diploma') },
              { value: 'bachelors', label: t('oppFilters.bachelors') },
              { value: 'masters', label: t('oppFilters.masters') },
              { value: 'phd', label: t('oppFilters.phd') },
            ]}
            value={filters.educationLevel || ''}
            onChange={(e) => onFilterChange('educationLevel', e.target.value)}
          />
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">{t('oppFilters.salaryRange')}</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={t('oppFilters.min')}
                value={filters.minSalary || ''}
                onChange={(e) => onFilterChange('minSalary', Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-tdop-navy focus:ring-2 focus:ring-tdop-primary focus:border-transparent"
              />
              <input
                type="number"
                placeholder={t('oppFilters.max')}
                value={filters.maxSalary || ''}
                onChange={(e) => onFilterChange('maxSalary', Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-tdop-navy focus:ring-2 focus:ring-tdop-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 w-full">
              <input
                type="checkbox"
                checked={filters.verified || false}
                onChange={(e) => onFilterChange('verified', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-tdop-primary focus:ring-tdop-primary"
              />
              <Shield className="w-4 h-4 text-tdop-secondary" />
              <span className="text-sm text-gray-700">{t('oppFilters.verifiedOnly')}</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
