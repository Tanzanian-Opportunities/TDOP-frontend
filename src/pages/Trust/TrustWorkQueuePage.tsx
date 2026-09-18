import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import RejectDialog from '@/components/ui/RejectDialog';
import Pagination from '@/components/ui/Pagination';
import { trustApi, TrustQueueData } from '@/services/api/trustApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { useNotificationContext } from '@/context/NotificationContext';
import {
  ClipboardList, CheckCircle, Eye, Flag, AlertTriangle,
  ChevronRight, Clock, Square, CheckSquare, Trash2
} from 'lucide-react';

type QueueTab = 'all' | 'verification' | 'moderation' | 'reports' | 'fraud';
const PAGE_SIZE = 10;

interface QueueItem {
  type: string;
  id: number;
  title: string;
  status: string;
  date: string;
  data: any;
}

const TrustWorkQueuePage: React.FC = () => {
  const { addNotification } = useNotificationContext();
  const [data, setData] = useState<TrustQueueData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<QueueTab>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [bulkRejectTarget, setBulkRejectTarget] = useState<{ type: string; count: number } | null>(null);

  useEffect(() => { loadQueue(); }, []);

  const loadQueue = async () => {
    try {
      const result = await trustApi.getQueue('all');
      setData(result);
    } catch (err) {
      console.error(err);
      setError(true);
      addNotification({ type: 'error', title: 'Error', message: 'Failed to load work queue.' });
    } finally {
      setLoading(false);
    }
  };

  const getAllItems = useCallback((): QueueItem[] => [
    ...(data.verifications || []).map(v => ({ type: 'verification', id: v.id, title: v.organization?.orgName || 'Verification Request', status: v.status, date: v.createdAt, data: v })),
    ...(data.moderation || []).map(m => ({ type: 'moderation', id: m.id, title: m.title || 'Opportunity', status: m.status, date: m.createdAt, data: m })),
    ...(data.reports || []).map(r => ({ type: 'report', id: r.id, title: r.reason || 'Report', status: r.status, date: r.createdAt, data: r })),
    ...(data.fraudSignals || []).map(f => ({ type: 'fraud', id: f.id, title: f.description || 'Fraud Signal', status: f.reviewed ? 'REVIEWED' : 'PENDING', date: f.createdAt, data: f })),
  ], [data]);

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  const allItems = getAllItems();
  const filteredItems = activeTab === 'all' ? allItems : allItems.filter(i => {
    if (activeTab === 'verification') return i.type === 'verification';
    if (activeTab === 'moderation') return i.type === 'moderation';
    if (activeTab === 'reports') return i.type === 'report';
    if (activeTab === 'fraud') return i.type === 'fraud';
    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const tabs: { key: QueueTab; label: string; count: number; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', count: allItems.length, icon: <ClipboardList className="w-4 h-4" /> },
    { key: 'verification', label: 'Verifications', count: data.verifications?.length || 0, icon: <CheckCircle className="w-4 h-4" /> },
    { key: 'moderation', label: 'Moderation', count: data.moderation?.length || 0, icon: <Eye className="w-4 h-4" /> },
    { key: 'reports', label: 'Reports', count: data.reports?.length || 0, icon: <Flag className="w-4 h-4" /> },
    { key: 'fraud', label: 'Fraud', count: data.fraudSignals?.length || 0, icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return <Badge variant="danger">Pending</Badge>;
      case 'REVIEWED': return <Badge variant="primary">Reviewed</Badge>;
      case 'APPROVED': return <Badge className="bg-tdop-secondary text-white">Approved</Badge>;
      case 'REJECTED': return <Badge variant="danger">Rejected</Badge>;
      case 'ACTIONED': return <Badge variant="primary">Actioned</Badge>;
      default: return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
    }
  };

  const getReviewLink = (type: string, id: number) => {
    if (type === 'verification') return `/trust/verifications?review=${id}`;
    if (type === 'moderation') return `/trust/moderation?review=${id}`;
    if (type === 'report') return `/trust/reports?review=${id}`;
    return `/trust/work-queue`;
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedItems.map(i => `${i.type}-${i.id}`)));
    }
  };

  const toggleSelectItem = (key: string) => {
    const next = new Set(selectedIds);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelectedIds(next);
  };

  const handleBulkApprove = async () => {
    setBulkActionLoading(true);
    let successCount = 0;
    for (const key of selectedIds) {
      const [type, id] = key.split('-');
      try {
        if (type === 'verification') { await trustApi.approveVerification(id); successCount++; }
        if (type === 'moderation') { await trustApi.approveModeration(id); successCount++; }
      } catch { /* skip failed */ }
    }
    addNotification({ type: 'success', title: 'Bulk Approved', message: `${successCount} item(s) approved.` });
    setSelectedIds(new Set());
    setBulkActionLoading(false);
    loadQueue();
  };

  const handleBulkReject = async (reason: string) => {
    setBulkActionLoading(true);
    let successCount = 0;
    for (const key of selectedIds) {
      const [type, id] = key.split('-');
      try {
        if (type === 'verification') { await trustApi.rejectVerification(id, reason); successCount++; }
        if (type === 'moderation') { await trustApi.rejectModeration(id, reason); successCount++; }
      } catch { /* skip failed */ }
    }
    addNotification({ type: 'info', title: 'Bulk Rejected', message: `${successCount} item(s) rejected.` });
    setBulkRejectTarget(null);
    setSelectedIds(new Set());
    setBulkActionLoading(false);
    loadQueue();
  };

  const selectableItems = paginatedItems.filter(i => i.type === 'verification' || i.type === 'moderation');
  const allSelected = selectableItems.length > 0 && selectableItems.every(i => selectedIds.has(`${i.type}-${i.id}`));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-tdop-primary" />
            Work Queue
          </h1>
          <p className="text-sm text-gray-500 mt-1">{filteredItems.length} items across all queues</p>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 bg-tdop-primary/10 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-tdop-primary">{selectedIds.size} selected</span>
            <Button size="sm" onClick={handleBulkApprove} disabled={bulkActionLoading} className="bg-tdop-secondary hover:bg-teal-700 text-white">
              <CheckCircle className="w-3 h-3 mr-1" /> Approve All
            </Button>
            <Button size="sm" variant="danger" onClick={() => setBulkRejectTarget({ type: 'bulk', count: selectedIds.size })} disabled={bulkActionLoading}>
              Reject All
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Queue filters">
        {tabs.map(tab => (
          <button key={tab.key} role="tab" aria-selected={activeTab === tab.key}
            onClick={() => { setActiveTab(tab.key); setCurrentPage(1); setSelectedIds(new Set()); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key ? 'bg-tdop-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.icon} {tab.label}
            <Badge variant={tab.count > 0 ? 'danger' : 'secondary'} className="ml-1">{tab.count}</Badge>
          </button>
        ))}
      </div>

      {selectableItems.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
          <button onClick={toggleSelectAll} className="flex items-center gap-2 text-sm text-gray-600 hover:text-tdop-primary focus:outline-none"
            aria-label={allSelected ? 'Deselect all' : 'Select all'}
          >
            {allSelected ? <CheckSquare className="w-4 h-4 text-tdop-primary" /> : <Square className="w-4 h-4" />}
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
        </div>
      )}

      <Card className="overflow-hidden">
        {paginatedItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium">No items in queue</p>
            <p className="text-sm mt-1">All items have been processed.</p>
          </div>
        ) : (
          <div className="divide-y" role="list" aria-label="Work queue items">
            {paginatedItems.map(item => {
              const itemKey = `${item.type}-${item.id}`;
              const isSelectable = item.type === 'verification' || item.type === 'moderation';
              const isSelected = selectedIds.has(itemKey);
              return (
                <div key={itemKey} className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-tdop-primary/5' : ''}`}>
                  {isSelectable && (
                    <button onClick={(e) => { e.stopPropagation(); toggleSelectItem(itemKey); }}
                      className="shrink-0 focus:outline-none"
                      aria-label={isSelected ? `Deselect ${item.title}` : `Select ${item.title}`}
                    >
                      {isSelected ? <CheckSquare className="w-5 h-5 text-tdop-primary" /> : <Square className="w-5 h-5 text-gray-400" />}
                    </button>
                  )}
                  <Link to={getReviewLink(item.type, item.id)} className="flex-1 flex items-center gap-4 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      item.type === 'verification' ? 'bg-teal-50 text-tdop-secondary' :
                      item.type === 'moderation' ? 'bg-blue-50 text-tdop-primary' :
                      item.type === 'report' ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {item.type === 'verification' && <CheckCircle className="w-5 h-5" />}
                      {item.type === 'moderation' && <Eye className="w-5 h-5" />}
                      {item.type === 'report' && <Flag className="w-5 h-5" />}
                      {item.type === 'fraud' && <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-tdop-navy truncate">{item.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{item.type} request</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {getStatusBadge(item.status)}
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {item.date ? new Date(item.date).toLocaleDateString() : '—'}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <RejectDialog open={!!bulkRejectTarget} onCancel={() => setBulkRejectTarget(null)} onConfirm={handleBulkReject}
        title={`Bulk Reject ${bulkRejectTarget?.count || 0} items`} loading={bulkActionLoading} />
    </div>
  );
};

export default TrustWorkQueuePage;
