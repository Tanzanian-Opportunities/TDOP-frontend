import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { trustApi, TrustStats } from '@/services/api/trustApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { useNotificationContext } from '@/context/NotificationContext';
import {
  BarChart3, CheckCircle, Eye, Flag, AlertTriangle,
  TrendingUp, Clock, Shield
} from 'lucide-react';

const TrustOverviewPage: React.FC = () => {
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
      addNotification({ type: 'error', title: 'Error', message: 'Failed to load overview stats.' });
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
          Operational Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">Real-time metrics for trust & quality operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" /> Pending Verifications
          </div>
          <p className="text-3xl font-bold text-tdop-navy mt-2">{stats.pendingVerifications}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Eye className="w-4 h-4" /> Pending Moderation
          </div>
          <p className="text-3xl font-bold text-tdop-navy mt-2">{stats.pendingModeration}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Flag className="w-4 h-4" /> Pending Reports
          </div>
          <p className="text-3xl font-bold text-tdop-navy mt-2">{stats.reportStats?.pending || 0}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" /> Total Pending
          </div>
          <p className="text-3xl font-bold text-tdop-primary mt-2">{totalPending}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-tdop-navy mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-tdop-secondary" />
            Reports Overview
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Reports</span>
              <span className="text-sm font-bold text-tdop-navy">{stats.reportStats?.total || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-bold text-amber-600">{stats.reportStats?.pending || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Reviewed</span>
              <span className="text-sm font-bold text-tdop-primary">{stats.reportStats?.reviewed || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Actioned</span>
              <span className="text-sm font-bold text-tdop-secondary">{stats.reportStats?.actioned || 0}</span>
            </div>
          </div>
          {stats.reportStats?.total > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Resolution rate</span>
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
            Fraud Signals Overview
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High Risk</span>
              <span className="text-sm font-bold text-red-600">{stats.fraudStats?.highRisk || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Medium Risk</span>
              <span className="text-sm font-bold text-amber-600">{stats.fraudStats?.mediumRisk || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low Risk</span>
              <span className="text-sm font-bold text-tdop-secondary">{stats.fraudStats?.lowRisk || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Unreviewed</span>
              <span className="text-sm font-bold text-tdop-primary">{stats.fraudStats?.unreviewed || 0}</span>
            </div>
          </div>
          {(stats.fraudStats?.highRisk || 0) > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {stats.fraudStats.highRisk} high-risk signal{stats.fraudStats.highRisk !== 1 ? 's' : ''} require attention
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TrustOverviewPage;
