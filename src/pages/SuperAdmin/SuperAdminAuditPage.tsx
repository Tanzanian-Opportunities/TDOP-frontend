import React, { useEffect, useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, GovernanceChangeLog } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Eye } from 'lucide-react';

const SuperAdminAuditPage: React.FC = () => {
  const [data, setData] = useState<GovernanceChangeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    superAdminApi.getGovernanceChangeLog()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filteredChanges = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((change) => change.action.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <Eye className="w-7 h-7 text-tdop-primary" />
          Audit &amp; Compliance
        </h1>
        <p className="text-sm text-gray-500 mt-1">Governance change log</p>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Filter by action..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-tdop-primary focus:border-transparent"
        />
        <span className="text-sm text-gray-500">{filteredChanges.length} change(s) found</span>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Entity Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Entity ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Old Value</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">New Value</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredChanges.map((change, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><Badge variant="outline">{change.action}</Badge></td>
                  <td className="px-4 py-3 text-sm">{change.entityType}</td>
                  <td className="px-4 py-3 text-xs font-mono">{change.entityId}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{change.timestamp ? new Date(change.timestamp).toLocaleString() : 'N/A'}</td>
                  <td className="px-4 py-3 text-xs max-w-xs truncate">{change.oldValue || <span className="text-gray-400">N/A</span>}</td>
                  <td className="px-4 py-3 text-xs max-w-xs truncate">{change.newValue || <span className="text-gray-400">N/A</span>}</td>
                </tr>
              ))}
              {filteredChanges.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">No changes match the filter</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminAuditPage;
