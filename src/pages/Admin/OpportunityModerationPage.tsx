import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { SearchBar } from '@/components/ui/SearchBar';
import { useOpportunities } from '@/hooks/useOpportunities';
import { CheckCircle, XCircle, AlertTriangle, Search } from 'lucide-react';

const OpportunityModerationPage: React.FC = () => {
  const { t } = useTranslation();
  const { opportunities, isLoading } = useOpportunities();
  const [searchQuery, setSearchQuery] = React.useState('');

  const pendingOpps = opportunities.filter(o => o.status === 'pending');
  const rejectedOpps = opportunities.filter(o => o.status === 'rejected');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-8 h-8 text-tdop-primary" />
          {t('admin.opportunities')}
        </h1>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={t('admin.searchOpportunities')} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding={false}>
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/10">
            <h2 className="font-semibold text-gray-900 dark:text-white">Pending Verification ({pendingOpps.length})</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {pendingOpps.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('admin.noPendingOpportunities')}</p>
            ) : (
              pendingOpps.slice(0, 10).map(opp => (
                <div key={opp.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{opp.title}</p>
                    <p className="text-sm text-gray-500">{opp.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-green-600"><CheckCircle className="w-4 h-4 mr-1" />Approve</Button>
                    <Button variant="ghost" size="sm" className="text-red-600"><XCircle className="w-4 h-4 mr-1" />Reject</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card padding={false}>
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-red-50 dark:bg-red-900/10">
            <h2 className="font-semibold text-gray-900 dark:text-white">Rejected</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {rejectedOpps.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('admin.noRejectedOpportunities')}</p>
            ) : (
              rejectedOpps.slice(0, 10).map(opp => (
                <div key={opp.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{opp.title}</p>
                    <p className="text-sm text-gray-500">{opp.company}</p>
                  </div>
                  <Badge variant="rejected">Rejected</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OpportunityModerationPage;
