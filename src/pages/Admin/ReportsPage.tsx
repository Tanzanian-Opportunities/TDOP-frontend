import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { reportApi } from '@/services/api/reportApi';
import { formatDate } from '@/utils/formatDate';
import { Flag, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');

  const mockReports = [
    { id: '1', type: 'opportunity', targetType: 'opportunity', targetId: '1', reason: 'Inappropriate content', status: 'open', createdAt: '2024-01-15', reportedBy: 'john@example.com' },
    { id: '2', type: 'user', targetType: 'user', targetId: '2', reason: 'Spam', status: 'resolved', createdAt: '2024-01-14', reportedBy: 'jane@example.com' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <Flag className="w-8 h-8 text-tdop-primary" />
          {t('admin.reports')}
        </h1>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={t('admin.searchReports')} />

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-4 text-sm font-medium text-gray-500">{t('admin.reportedBy')}</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Reason</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">{t('common.status')}</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {mockReports.map(report => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-4 text-sm text-tdop-navy">{report.reportedBy}</td>
                  <td className="p-4"><Badge variant="info">{report.targetType}</Badge></td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{report.reason}</td>
                  <td className="p-4"><Badge variant={report.status === 'open' ? 'warning' : 'verified'}>{report.status}</Badge></td>
                  <td className="p-4 text-sm text-gray-500">{formatDate(report.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {mockReports.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('admin.noReports')}</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
