import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/services/api/adminApi';
import { formatDate } from '@/utils/formatDate';
import { BarChart3, Calendar, TrendingUp, Users, Briefcase, FileText } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = React.useState({ from: '', to: '' });

  const mockAnalytics = {
    users: { total: 1250, active: 980 },
    opportunities: { total: 340, newThisWeek: 12 },
    applications: { total: 2100, thisWeek: 156 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-tdop-primary" />
          {t('admin.analytics')}
        </h1>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-tdop-navy">{mockAnalytics.users.total}</p>
              <p className="text-sm text-gray-500">{t('admin.totalUsers')}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-tdop-navy">{mockAnalytics.opportunities.total}</p>
              <p className="text-sm text-gray-500">{t('admin.totalOpportunities')}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-tdop-navy">{mockAnalytics.applications.total}</p>
              <p className="text-sm text-gray-500">{t('admin.totalApplications')}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card padding={false}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-tdop-navy">{t('admin.dateRange')}</h2>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>{t('admin.chartPlaceholder')}</p>
              <p className="text-xs mt-1">{t('admin.topOpportunities')}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
