import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { trustApi } from '@/services/api/trustApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { useNotificationContext } from '@/context/NotificationContext';
import { Clock, Search, Filter, User, Activity } from 'lucide-react';

interface AuditEntry {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  description?: string;
  userId?: number;
  userEmail?: string;
  createdAt: string;
}

const PAGE_SIZE = 15;

const TrustActivityPage: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadAuditLog();
  }, []);

  const loadAuditLog = async () => {
    try {
      const data = await trustApi.getAuditLog();
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(true);
      addNotification({ type: 'error', title: 'Error', message: t('trustActivity.failedToLoad') });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  const filtered = entries.filter(e => {
    const matchesSearch = !searchQuery ||
      e.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.entityType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === 'all' || e.action?.toLowerCase() === filterAction;
    return matchesSearch && matchesAction;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const actionTypes = [...new Set(entries.map(e => e.action))].filter(Boolean);

  const getActionColor = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'CREATE': return 'bg-teal-50 text-tdop-secondary';
      case 'UPDATE': return 'bg-blue-50 text-tdop-primary';
      case 'DELETE': return 'bg-red-50 text-red-600';
      case 'APPROVE': return 'bg-teal-50 text-tdop-secondary';
      case 'REJECT': case 'SUSPEND': return 'bg-red-50 text-red-600';
      case 'LOGIN': case 'LOGOUT': return 'bg-gray-50 text-gray-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <Activity className="w-7 h-7 text-tdop-primary" />
          Activity Log
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('trustActivity.subtitle')}</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('trustActivity.searchPlaceholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary focus:border-transparent"
            />
          </div>
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">{t('trustActivity.allActions')}</option>
            {actionTypes.map(a => (
              <option key={a} value={a.toLowerCase()}>{a}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {paginated.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium">{t('trustActivity.noActivity')}</p>
          </div>
        ) : (
          <div className="divide-y">
            {paginated.map(entry => (
              <div key={entry.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg shrink-0 ${getActionColor(entry.action)}`}>
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{entry.action}</Badge>
                    <span className="text-xs text-gray-500 capitalize">{entry.entityType?.replace('_', ' ')}</span>
                    {entry.entityId && <span className="text-xs text-gray-400">#{entry.entityId}</span>}
                  </div>
                  {entry.description && (
                    <p className="text-sm text-gray-600 mt-1 truncate">{entry.description}</p>
                  )}
                  {entry.userEmail && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <User className="w-3 h-3" /> {entry.userEmail}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default TrustActivityPage;
