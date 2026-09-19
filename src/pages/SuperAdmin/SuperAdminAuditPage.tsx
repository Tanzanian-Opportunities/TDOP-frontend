import React, { useEffect, useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, GovernanceChangeLog } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Eye } from 'lucide-react';

const SuperAdminAuditPage: React.FC = () => {
  const [data, setData] = useState<GovernanceChangeLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await superAdminApi.getGovernanceChangeLog();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch governance change log');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredChanges = useMemo(() => {
    if (!data?.changes) return [];
    if (!searchTerm) return data.changes;
    return data.changes.filter(
      (change) =>
        change.action.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.changes, searchTerm]);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;
  if (!data) return <PageError message="No data available" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Eye className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">Audit & Compliance</h1>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Filter by action..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md bg-background w-64"
        />
        <span className="text-sm text-muted-foreground">
          {filteredChanges.length} change(s) found
        </span>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">Action</th>
                <th className="pb-3 font-medium">Entity Type</th>
                <th className="pb-3 font-medium">Entity ID</th>
                <th className="pb-3 font-medium">Timestamp</th>
                <th className="pb-3 font-medium">Old Value</th>
                <th className="pb-3 font-medium">New Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredChanges.map((change, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-3">
                    <Badge variant="outline">{change.action}</Badge>
                  </td>
                  <td className="py-3">{change.entityType}</td>
                  <td className="py-3 font-mono text-xs">{change.entityId}</td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(change.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 max-w-xs truncate text-xs">
                    {change.oldValue ? (
                      <code className="bg-muted px-1 py-0.5 rounded">{change.oldValue}</code>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </td>
                  <td className="py-3 max-w-xs truncate text-xs">
                    {change.newValue ? (
                      <code className="bg-muted px-1 py-0.5 rounded">{change.newValue}</code>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredChanges.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-muted-foreground">
                    No changes match the filter
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

export default SuperAdminAuditPage;
