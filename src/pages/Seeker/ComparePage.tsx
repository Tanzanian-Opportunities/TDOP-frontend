import React, { useState } from 'react';
import { useOpportunities } from '@/hooks/useOpportunities';
import { OpportunityCompare } from '@/components/opportunity/OpportunityCompare';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageLoading, PageError, PageEmpty } from '@/components/ui/PageStates';
import { Scale, ArrowRight } from 'lucide-react';

const ComparePage: React.FC = () => {
  const { t } = useTranslation();
  const { opportunities, savedOpportunities, isLoading, isError, refetch } = useOpportunities();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allOpps = [...savedOpportunities, ...opportunities];

  if (isLoading) return <PageLoading text="Loading opportunities..." />;
  if (isError) return <PageError message="Failed to load opportunities." onRetry={refetch} />;
  if (allOpps.length === 0) return <PageEmpty title="No opportunities to compare" description="Browse and save opportunities first to compare them." action={{ label: 'Browse Opportunities', to: '/browse' }} />;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(pid => pid !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const selectedOpps = allOpps.filter(opp => selectedIds.includes(opp.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <Scale className="w-8 h-8 text-tdop-primary" />
          {t('comparison.title')}
        </h1>
        <p className="text-gray-500 mt-2">{t('comparison.selectOpportunities')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allOpps.slice(0, 8).map(opp => (
          <Card
            key={opp.id}
            className={`cursor-pointer transition-all ${selectedIds.includes(opp.id) ? 'ring-2 ring-tdop-primary' : ''}`}
            onClick={() => toggleSelect(opp.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-tdop-navy">{opp.title}</h4>
                <p className="text-sm text-gray-500">{opp.company}</p>
              </div>
              {selectedIds.includes(opp.id) && (
                <Badge variant="primary">Selected</Badge>
              )}
            </div>
            {selectedIds.length >= 4 && !selectedIds.includes(opp.id) && (
              <p className="text-xs text-gray-400 mt-2">Max 4 selected</p>
            )}
          </Card>
        ))}
      </div>

      <OpportunityCompare
        opportunities={selectedOpps}
        onRemove={toggleSelect}
        onClearAll={() => setSelectedIds([])}
        onCompare={() => {}}
      />
    </div>
  );
};

export default ComparePage;
