import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, SecurityOverview } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Lock, CheckCircle, XCircle } from 'lucide-react';

const SuperAdminSecurityPage: React.FC = () => {
  const [data, setData] = useState<SecurityOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    superAdminApi.getSecurityOverview()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (error || !data) return <PageError />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <Lock className="w-7 h-7 text-tdop-primary" />
          Security Center
        </h1>
        <p className="text-sm text-gray-500 mt-1">Security events and risk signals</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Total Users', value: data.totalUsers, variant: 'primary' as const },
          { label: 'Enabled', value: data.enabledUsers, variant: 'secondary' as const },
          { label: 'Disabled', value: data.disabledUsers, variant: 'danger' as const },
          { label: 'Unverified', value: data.unverifiedUsers, variant: 'outline' as const },
          { label: 'High Risk', value: data.highRiskSignals, variant: 'danger' as const },
          { label: 'Medium Risk', value: data.mediumRiskSignals, variant: 'accent' as const },
          { label: 'Unreviewed', value: data.unreviewedSignals, variant: 'outline' as const },
        ].map((card) => (
          <Card key={card.label} className="p-4">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className="text-xl font-bold text-tdop-navy mt-1">{card.value}</p>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="text-sm font-semibold text-tdop-navy">Recent Audit Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Entity Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Entity ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.recentAuditLogs?.map((log: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><Badge variant="outline">{log.action}</Badge></td>
                  <td className="px-4 py-3 text-sm">{log.entityType}</td>
                  <td className="px-4 py-3 text-xs font-mono">{log.entityId}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
              {(!data.recentAuditLogs || data.recentAuditLogs.length === 0) && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">No recent audit logs</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminSecurityPage;
