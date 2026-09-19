import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { superAdminApi, PlatformPulse } from '@/services/api/superAdminApi';
import { trustApi, TrustStats } from '@/services/api/trustApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Shield, CheckCircle, Eye, Flag, AlertTriangle } from 'lucide-react';

const SuperAdminTrustGovernancePage: React.FC = () => {
  const [pulse, setPulse] = useState<PlatformPulse | null>(null);
  const [stats, setStats] = useState<TrustStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [p, s] = await Promise.all([superAdminApi.getPlatformPulse(), trustApi.getStats()]);
      setPulse(p);
      setStats(s);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <Shield className="w-7 h-7 text-tdop-primary" />
          Trust Governance
        </h1>
        <p className="text-sm text-gray-500 mt-1">Oversight of verification, moderation, and trust operations</p>
      </div>
      <Card className="p-4 bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Governance View:</strong> Oversight of trust operations workload. For operational work, use <a href="/trust" className="underline">Trust Workspace</a>.
        </p>
      </Card>
      {pulse && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-gray-500"><CheckCircle className="w-4 h-4" /><span className="text-sm">Pending Verifications</span></div>
            <p className="text-2xl font-bold text-tdop-navy mt-2">{stats?.pendingVerifications || 0}</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-gray-500"><Eye className="w-4 h-4" /><span className="text-sm">Pending Moderation</span></div>
            <p className="text-2xl font-bold text-tdop-navy mt-2">{stats?.pendingModeration || 0}</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-gray-500"><Flag className="w-4 h-4" /><span className="text-sm">Open Reports</span></div>
            <p className="text-2xl font-bold text-red-600 mt-2">{stats?.reportStats?.pending || pulse.reports.pending}</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-gray-500"><AlertTriangle className="w-4 h-4" /><span className="text-sm">High Risk Signals</span></div>
            <p className="text-2xl font-bold text-tdop-accent mt-2">{stats?.fraudStats?.highRisk || 0}</p>
          </Card>
        </div>
      )}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-tdop-navy mb-3">Reports Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Total</span><span className="font-medium">{stats.reportStats.total}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Pending</span><span className="font-medium">{stats.reportStats.pending}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Reviewed</span><span className="font-medium">{stats.reportStats.reviewed}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Actioned</span><span className="font-medium">{stats.reportStats.actioned}</span></div>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-tdop-navy mb-3">Fraud Signals Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">High Risk</span><span className="font-medium text-red-600">{stats.fraudStats.highRisk}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Medium Risk</span><span className="font-medium text-amber-600">{stats.fraudStats.mediumRisk}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Low Risk</span><span className="font-medium">{stats.fraudStats.lowRisk}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Unreviewed</span><span className="font-medium">{stats.fraudStats.unreviewed}</span></div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SuperAdminTrustGovernancePage;
