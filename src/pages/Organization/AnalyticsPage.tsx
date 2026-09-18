import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageError } from '@/components/ui/PageStates';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { StatCard } from '@/components/dashboard/StatCard';
import axiosInstance from '@/services/api/axiosInstance';
import { BarChart3, Users, Briefcase, Eye, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  totalOrganizations?: number;
  monthlyOpportunities?: number;
  totalUsers?: number;
  totalOpportunities?: number;
  totalApplications?: number;
}

const AnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: stats } = await axiosInstance.get('/public/stats');
      setData(stats);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><PageError message={t('common.errorLoading')} onRetry={fetchAnalytics} /></div>;

  const hasData = data && (data.totalOrganizations || data.monthlyOpportunities || data.totalUsers);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-tdop-primary" />
          {t('analytics.title')}
        </h1>
        <p className="text-gray-500 mt-1">{t('analytics.description')}</p>
      </div>

      {!hasData ? (
        <EmptyState
          icon={<BarChart3 className="w-8 h-8 text-gray-300" />}
          title={t('analytics.noData')}
          description={t('analytics.noDataDescription')}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.totalOrganizations !== undefined && (
              <StatCard icon={<Users className="w-5 h-5" />} label={t('analytics.totalOrganizations')} value={data.totalOrganizations} color="primary" />
            )}
            {data.monthlyOpportunities !== undefined && (
              <StatCard icon={<Briefcase className="w-5 h-5" />} label={t('analytics.monthlyOpportunities')} value={data.monthlyOpportunities} color="secondary" />
            )}
            {data.totalUsers !== undefined && (
              <StatCard icon={<TrendingUp className="w-5 h-5" />} label={t('analytics.totalUsers')} value={data.totalUsers} color="accent" />
            )}
          </div>

          <Card>
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-medium text-tdop-navy mb-1">{t('analytics.advancedComing')}</h3>
              <p className="text-sm text-gray-500">{t('analytics.advancedComingDescription')}</p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
