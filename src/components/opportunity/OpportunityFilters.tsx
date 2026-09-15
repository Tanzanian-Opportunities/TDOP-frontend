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
          <h2 className="font-semibold text-tdop-navy">Filters</h2>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-tdop-primary/10 text-tdop-primary text-xs font-medium rounded-full">
              {activeCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            <Filter className="w-4 h-4 mr-1" />
            {isExpanded ? 'Less filters' : 'More filters'}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      <SearchBar
        value={filters.search || ''}
        onChange={(value) => onFilterChange('search', value)}
        placeholder="Search opportunities..."
        loading={isLoading}
      />

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          <Select
            label="Type"
            options={[
              { value: '', label: 'All types' },
              { value: 'internship', label: 'Internship' },
              { value: 'full-time', label: 'Full-time' },
              { value: 'part-time', label: 'Part-time' },
              { value: 'freelance', label: 'Freelance' },
              { value: 'volunteer', label: 'Volunteer' },
              { value: 'apprenticeship', label: 'Apprenticeship' },
            ]}
            value={filters.type || ''}
            onChange={(e) => onFilterChange('type', e.target.value)}
          />
          <Select
            label="Experience"
            options={[
              { value: '', label: 'All levels' },
              { value: 'entry', label: 'Entry level' },
              { value: 'mid', label: 'Mid level' },
              { value: 'senior', label: 'Senior level' },
              { value: 'executive', label: 'Executive' },
            ]}
            value={filters.experience || ''}
            onChange={(e) => onFilterChange('experience', e.target.value)}
          />
          <Select
            label="Work mode"
            options={[
              { value: '', label: 'All modes' },
              { value: 'remote', label: 'Remote' },
              { value: 'on-site', label: 'On-site' },
              { value: 'hybrid', label: 'Hybrid' },
            ]}
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
          />
          <Select
            label="Category"
            options={[
              { value: '', label: 'All categories' },
              { value: 'technology', label: 'Technology' },
              { value: 'business', label: 'Business' },
              { value: 'design', label: 'Design' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'engineering', label: 'Engineering' },
              { value: 'healthcare', label: 'Healthcare' },
              { value: 'education', label: 'Education' },
              { value: 'finance', label: 'Finance' },
              { value: 'agriculture', label: 'Agriculture' },
              { value: 'government', label: 'Government' },
            ]}
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
          />
          <Select
            label="Education"
            options={[
              { value: '', label: 'All levels' },
              { value: 'certificate', label: 'Certificate' },
              { value: 'diploma', label: 'Diploma' },
              { value: 'bachelors', label: "Bachelor's degree" },
              { value: 'masters', label: "Master's degree" },
              { value: 'phd', label: 'PhD' },
            ]}
            value={filters.educationLevel || ''}
            onChange={(e) => onFilterChange('educationLevel', e.target.value)}
          />
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Salary range (TZS)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minSalary || ''}
                onChange={(e) => onFilterChange('minSalary', Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-tdop-navy focus:ring-2 focus:ring-tdop-primary focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
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
              <span className="text-sm text-gray-700">Verified only</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
