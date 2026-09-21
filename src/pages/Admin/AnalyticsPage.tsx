import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageError } from '@/components/ui/PageStates';
import { adminApi } from '@/services/api/adminApi';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { StatCard } from '@/components/dashboard/StatCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
  BarChart3, Calendar, TrendingUp, Users, Briefcase, FileText,
  RefreshCw, Building2, CheckCircle, AlertTriangle,
} from 'lucide-react';

interface AnalyticsData {
  users?: { total?: number; active?: number; newThisWeek?: number };
  opportunities?: { total?: number; active?: number; newThisWeek?: number };
  applications?: { total?: number; newThisWeek?: number };
  organizations?: { total?: number; verified?: number };
}

const AnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsData, statsData] = await Promise.all([
        adminApi.getAnalytics().catch(() => null),
        adminApi.getDashboardStats().catch(() => null),
      ]);
      setAnalytics(analyticsData);
      setDashboardStats(statsData);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = async () => {
    if (!dateFrom && !dateTo) return fetchData();
    try {
      setLoading(true);
      const data = await adminApi.getAnalytics({
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics && !dashboardStats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <PageError message={t('adminAnalytics.failedToLoad')} onRetry={fetchData} />;

  const statCards = [
    {
      label: t('adminAnalytics.totalUsers'),
      value: dashboardStats?.totalUsers || analytics?.users?.total || 0,
      icon: <Users className="w-5 h-5" />,
      color: 'bg-tdop-primary/10 text-tdop-primary',
      sub: analytics?.users?.active ? `${analytics.users.active} ${t('adminAnalytics.active')}` : undefined,
    },
    {
      label: t('adminAnalytics.organizations'),
      value: dashboardStats?.totalOrganizations || analytics?.organizations?.total || 0,
      icon: <Building2 className="w-5 h-5" />,
      color: 'bg-purple-50 text-purple-600',
      sub: analytics?.organizations?.verified ? `${analytics.organizations.verified} ${t('adminAnalytics.verified')}` : undefined,
    },
    {
      label: t('adminAnalytics.opportunities'),
      value: dashboardStats?.totalOpportunities || analytics?.opportunities?.total || 0,
      icon: <Briefcase className="w-5 h-5" />,
      color: 'bg-emerald-50 text-tdop-secondary',
      sub: analytics?.opportunities?.newThisWeek ? `${analytics.opportunities.newThisWeek} ${t('adminAnalytics.newThisWeek')}` : undefined,
    },
    {
      label: t('adminAnalytics.applications'),
      value: dashboardStats?.totalApplications || analytics?.applications?.total || 0,
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-amber-50 text-amber-600',
      sub: analytics?.applications?.newThisWeek ? `${analytics.applications.newThisWeek} ${t('adminAnalytics.newThisWeek')}` : undefined,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-tdop-primary" />
            {t('adminAnalytics.title')}
          </h1>
          <p className="text-gray-500 mt-1">{t('adminAnalytics.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm text-tdop-navy border-none outline-none"
            />
            <span className="text-gray-400">{t('adminAnalytics.to')}</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm text-tdop-navy border-none outline-none"
            />
          </div>
          <button
            onClick={handleDateFilter}
            className="px-3 py-2 bg-tdop-primary text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            {t('adminAnalytics.filter')}
          </button>
          <button
            onClick={fetchData}
            className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(stat => (
          <StatCard
            key={stat.label}
            value={stat.value}
            label={stat.label}
            icon={stat.icon}
            color={stat.color}
            trend="neutral"
          />
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardSection title={t('adminAnalytics.userGrowth')} icon={<Users className="w-4 h-4" />}>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-tdop-light rounded-xl">
              <span className="text-sm text-gray-600">{t('adminAnalytics.totalRegistered')}</span>
              <span className="font-bold text-tdop-navy">{statCards[0].value}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-tdop-light rounded-xl">
              <span className="text-sm text-gray-600">{t('adminAnalytics.activeUsers')}</span>
              <span className="font-bold text-tdop-navy">{analytics?.users?.active || '—'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-tdop-light rounded-xl">
              <span className="text-sm text-gray-600">{t('adminAnalytics.newUsersThisWeek')}</span>
              <span className="font-bold text-tdop-secondary">{analytics?.users?.newThisWeek || '—'}</span>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection title={t('adminAnalytics.platformActivity')} icon={<TrendingUp className="w-4 h-4" />}>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-tdop-light rounded-xl">
              <span className="text-sm text-gray-600">{t('adminAnalytics.activeOpportunities')}</span>
              <span className="font-bold text-tdop-navy">{dashboardStats?.activeOpportunities || '—'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-tdop-light rounded-xl">
              <span className="text-sm text-gray-600">{t('adminAnalytics.verifiedOrganizations')}</span>
              <span className="font-bold text-tdop-secondary">{dashboardStats?.verifiedOrganizations || '—'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-tdop-light rounded-xl">
              <span className="text-sm text-gray-600">{t('adminAnalytics.pendingModeration')}</span>
              <span className={`font-bold ${dashboardStats?.pendingModeration ? 'text-amber-600' : 'text-tdop-secondary'}`}>
                {dashboardStats?.pendingModeration || 0}
              </span>
            </div>
          </div>
        </DashboardSection>
      </div>
    </div>
  );
};

export default AnalyticsPage;
