import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageError } from '@/components/ui/PageStates';
import { adminApi } from '@/services/api/adminApi';
import { ScrollText, Shield, Edit, Trash2, Clock, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId?: number;
  userId?: number;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  timestamp: string;
}

const PAGE_SIZE = 20;

const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchAction, setSearchAction] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => { fetchLogs(); }, [page, activeFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAuditLog({ page, limit: PAGE_SIZE, action: activeFilter || undefined });
      setLogs(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => { setPage(0); setActiveFilter(searchAction); };

  const getActionIcon = (action: string) => {
    if (action.toLowerCase().includes('delete')) return <Trash2 className="w-4 h-4 text-red-500" />;
    if (action.toLowerCase().includes('create') || action.toLowerCase().includes('register')) return <Edit className="w-4 h-4 text-green-500" />;
    if (action.toLowerCase().includes('login')) return <Shield className="w-4 h-4 text-blue-500" />;
    if (action.toLowerCase().includes('update') || action.toLowerCase().includes('change')) return <Edit className="w-4 h-4 text-yellow-500" />;
    return <Shield className="w-4 h-4 text-gray-400" />;
  };

  const getActionColor = (action: string) => {
    if (action.toLowerCase().includes('delete')) return 'danger';
    if (action.toLowerCase().includes('create') || action.toLowerCase().includes('register')) return 'success';
    if (action.toLowerCase().includes('login')) return 'info';
    return 'default';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(10)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (error) return <PageError message="Failed to load audit logs." onRetry={fetchLogs} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <ScrollText className="w-8 h-8 text-tdop-primary" /> Audit Log
        </h1>
        <p className="text-gray-500 mt-1">{total.toLocaleString()} total entries</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Filter by action or entity..." value={searchAction}
            onChange={e => setSearchAction(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary" />
        </div>
        <Button variant="outline" size="sm" onClick={handleSearch}>Search</Button>
        <button onClick={() => { setSearchAction(''); setActiveFilter(''); setPage(0); }}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <Card padding={false}>
        <div className="divide-y divide-gray-100">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ScrollText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p>No audit logs found</p>
            </div>
          ) : logs.map(log => (
            <div key={log.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {getActionIcon(log.action)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-tdop-navy">{log.action}</p>
                    <Badge variant={getActionColor(log.action) as any}>{log.entityType}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {log.entityId && <span>Entity #{log.entityId}</span>}
                    {log.userId && <span> • User #{log.userId}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page + 1} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogPage;
