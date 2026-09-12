import React from 'react';
import { useOpportunities } from '@/hooks/useOpportunities';
import { OpportunityCardList } from '@/components/opportunity/OpportunityCardList';
import { useTranslation } from 'react-i18next';
import { Bookmark } from 'lucide-react';

const SavedOpportunitiesPage: React.FC = () => {
  const { savedOpportunities, isLoading, total, unsaveOpportunity } = useOpportunities();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tdop-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-8 h-8 text-tdop-primary" />
          {t('opportunities.savedTitle')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {total} {t('opportunities.saved')} {t('opportunities.title')}
        </p>
      </div>

      <OpportunityCardList opportunities={savedOpportunities} isLoading={isLoading} />
    </div>
  );
};

export default SavedOpportunitiesPage;
