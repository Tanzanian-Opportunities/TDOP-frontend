import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, SecurityOverview } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Lock } from 'lucide-react';

const SuperAdminSecurityPage: React.FC = () => {
  const [data, setData] = useState<SecurityOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await superAdminApi.getSecurityOverview();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch security overview');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;
  if (!data) return <PageError message="No data available" />;

  const summaryCards = [
    { label: 'Total Users', value: data.totalUsers, variant: 'primary' as const },
    { label: 'Enabled', value: data.enabled, variant: 'accent' as const },
    { label: 'Disabled', value: data.disabled, variant: 'danger' as const },
    { label: 'Unverified', value: data.unverified, variant: 'secondary' as const },
    { label: 'High Risk', value: data.highRisk, variant: 'danger' as const },
    { label: 'Medium Risk', value: data.mediumRisk, variant: 'accent' as const },
    { label: 'Unreviewed Signals', value: data.unreviewedSignals, variant: 'outline' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Lock className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">Security Center</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="p-4 text-center">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <Badge variant={card.variant} className="mt-2 text-lg font-bold">
              {card.value}
            </Badge>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Audit Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">Action</th>
                <th className="pb-3 font-medium">Entity Type</th>
                <th className="pb-3 font-medium">Entity ID</th>
                <th className="pb-3 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.recentAuditLogs?.map((log, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-3">
                    <Badge variant="outline">{log.action}</Badge>
                  </td>
                  <td className="py-3">{log.entityType}</td>
                  <td className="py-3 font-mono text-xs">{log.entityId}</td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
              {(!data.recentAuditLogs || data.recentAuditLogs.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-muted-foreground">
                    No recent audit logs
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminSecurityPage;
