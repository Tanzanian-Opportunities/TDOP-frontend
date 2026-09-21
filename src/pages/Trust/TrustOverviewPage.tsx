import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { trustApi, TrustStats } from '@/services/api/trustApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { useNotificationContext } from '@/context/NotificationContext';
import {
  BarChart3, CheckCircle, Eye, Flag, AlertTriangle,
  TrendingUp, Clock, Shield
} from 'lucide-react';

const TrustOverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [stats, setStats] = useState<TrustStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await trustApi.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError(true);
      addNotification({ type: 'error', title: 'Error', message: t('trustOverview.failedToLoad') });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoading />;
  if (error || !stats) return <PageError />;

  const totalPending = stats.pendingVerifications + stats.pendingModeration + (stats.reportStats?.pending || 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-tdop-primary" />
          {t('trustOverview.title')}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('trustOverview.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" /> {t('trustOverview.pendingVerifications')}
          </div>
          <p className="text-3xl font-bold text-tdop-navy mt-2">{stats.pendingVerifications}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Eye className="w-4 h-4" /> {t('trustOverview.pendingModeration')}
          </div>
          <p className="text-3xl font-bold text-tdop-navy mt-2">{stats.pendingModeration}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Flag className="w-4 h-4" /> {t('trustOverview.pendingReports')}
          </div>
          <p className="text-3xl font-bold text-tdop-navy mt-2">{stats.reportStats?.pending || 0}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" /> {t('trustOverview.totalPending')}
          </div>
          <p className="text-3xl font-bold text-tdop-primary mt-2">{totalPending}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-tdop-navy mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-tdop-secondary" />
            {t('trustOverview.reportsOverview')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('trustOverview.totalReports')}</span>
              <span className="text-sm font-bold text-tdop-navy">{stats.reportStats?.total || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('trustOverview.pending')}</span>
              <span className="text-sm font-bold text-amber-600">{stats.reportStats?.pending || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('trustOverview.reviewed')}</span>
              <span className="text-sm font-bold text-tdop-primary">{stats.reportStats?.reviewed || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('trustOverview.actioned')}</span>
              <span className="text-sm font-bold text-tdop-secondary">{stats.reportStats?.actioned || 0}</span>
            </div>
          </div>
          {stats.reportStats?.total > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{t('trustOverview.resolutionRate')}</span>
                <span>{Math.round(((stats.reportStats?.actioned || 0) / stats.reportStats.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-tdop-secondary h-2 rounded-full" style={{ width: `${Math.round(((stats.reportStats?.actioned || 0) / stats.reportStats.total) * 100)}%` }} />
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-tdop-navy mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            {t('trustOverview.fraudOverview')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('trustOverview.highRisk')}</span>
              <span className="text-sm font-bold text-red-600">{stats.fraudStats?.highRisk || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('trustOverview.mediumRisk')}</span>
              <span className="text-sm font-bold text-amber-600">{stats.fraudStats?.mediumRisk || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('trustOverview.lowRisk')}</span>
              <span className="text-sm font-bold text-tdop-secondary">{stats.fraudStats?.lowRisk || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('trustOverview.unreviewed')}</span>
              <span className="text-sm font-bold text-tdop-primary">{stats.fraudStats?.unreviewed || 0}</span>
            </div>
          </div>
          {(stats.fraudStats?.highRisk || 0) > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {t('trustOverview.highRiskAttention', { count: stats.fraudStats.highRisk })}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TrustOverviewPage;
