import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import RejectDialog from '@/components/ui/RejectDialog';
import InputDialog from '@/components/ui/InputDialog';
import Pagination from '@/components/ui/Pagination';
import { trustApi } from '@/services/api/trustApi';
import { adminApi } from '@/services/api/adminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { useNotificationContext } from '@/context/NotificationContext';
import {
  CheckCircle, XCircle, Eye, Pause, ArrowLeft,
  Search, Briefcase, Clock, FileText, History
} from 'lucide-react';

interface ModerationItem {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  description?: string;
  companyName?: string;
  organization?: { orgName: string };
  createdByUser?: { firstName: string; lastName: string };
}

interface ModerationHistoryEntry {
  id: number;
  action: string;
  reason?: string;
  details?: string;
  moderator?: { firstName: string; lastName: string; email: string };
  createdAt: string;
}

const PAGE_SIZE = 10;

const TrustOpportunityReviewPage: React.FC = () => {
  const { addNotification } = useNotificationContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const reviewId = searchParams.get('review');
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [history, setHistory] = useState<ModerationHistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<{ id: number; title: string } | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<{ id: number; title: string } | null>(null);
  const [infoTarget, setInfoTarget] = useState<{ id: number; title: string } | null>(null);

  useEffect(() => { loadItems(); }, []);

  useEffect(() => {
    if (reviewId && items.length > 0) {
      const found = items.find(i => i.id === Number(reviewId));
      if (found) {
        setSelectedItem(found);
        loadHistory(found.id);
      }
    }
  }, [reviewId, items]);

  const loadItems = async () => {
    try {
      const queue = await adminApi.getModerationQueue();
      setItems(Array.isArray(queue) ? queue : []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (oppId: number) => {
    setLoadingHistory(true);
    try {
      const h = await trustApi.getModerationHistory(String(oppId));
      setHistory(Array.isArray(h) ? h : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(true);
    try {
      await trustApi.approveModeration(String(id));
      addNotification({ type: 'success', title: 'Approved', message: 'Opportunity approved and published.' });
      setSelectedItem(null);
      setHistory([]);
      loadItems();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to approve opportunity.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      await trustApi.rejectModeration(String(rejectTarget.id), reason);
      addNotification({ type: 'info', title: 'Rejected', message: 'Opportunity rejected.' });
      setRejectTarget(null);
      setSelectedItem(null);
      setHistory([]);
      loadItems();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to reject opportunity.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async (reason: string) => {
    if (!suspendTarget) return;
    setActionLoading(true);
    try {
      await trustApi.suspendModeration(String(suspendTarget.id), reason);
      addNotification({ type: 'warning', title: 'Suspended', message: 'Opportunity suspended.' });
      setSuspendTarget(null);
      setSelectedItem(null);
      setHistory([]);
      loadItems();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to suspend opportunity.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestInfo = async (details: string) => {
    if (!infoTarget) return;
    setActionLoading(true);
    try {
      await trustApi.requestModerationInfo(String(infoTarget.id), details);
      addNotification({ type: 'info', title: 'Info Requested', message: 'Additional information requested.' });
      setInfoTarget(null);
      loadItems();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to request information.' });
    } finally {
      setActionLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'APPROVE': return <CheckCircle className="w-4 h-4 text-tdop-secondary" />;
      case 'REJECT': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'SUSPEND': return <Pause className="w-4 h-4 text-amber-500" />;
      case 'REQUEST_INFORMATION': return <FileText className="w-4 h-4 text-tdop-primary" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'APPROVE': return 'border-tdop-secondary bg-teal-50';
      case 'REJECT': return 'border-red-300 bg-red-50';
      case 'SUSPEND': return 'border-amber-300 bg-amber-50';
      case 'REQUEST_INFORMATION': return 'border-tdop-primary bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  const filtered = items.filter(i => {
    const matchesSearch = !searchQuery || i.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || i.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = {
    pending: items.filter(i => i.status === 'PENDING_REVIEW' || i.status === 'UNDER_REVIEW').length,
    approved: items.filter(i => i.status === 'APPROVED').length,
    rejected: items.filter(i => i.status === 'REJECTED').length,
    suspended: items.filter(i => i.status === 'SUSPENDED').length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {selectedItem ? (
        <div className="space-y-6">
          <button
            onClick={() => { setSelectedItem(null); setHistory([]); setSearchParams({}); }}
            className="flex items-center gap-2 text-sm text-tdop-primary hover:underline focus:outline-none focus:ring-2 focus:ring-tdop-primary rounded"
            aria-label="Go back to moderation queue"
          >
            <ArrowLeft className="w-4 h-4" /> Back to queue
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-tdop-navy">{selectedItem.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedItem.companyName || selectedItem.organization?.orgName || 'Unknown organization'}
                    </p>
                  </div>
                  <Badge variant={
                    selectedItem.status === 'PENDING_REVIEW' || selectedItem.status === 'UNDER_REVIEW' ? 'danger' : 'primary'
                  }>
                    {selectedItem.status?.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="mt-6 space-y-4">
                  {selectedItem.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{selectedItem.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Created</label>
                      <p className="mt-1 text-sm text-gray-600">{selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : '—'}</p>
                    </div>
                    {selectedItem.createdByUser && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Submitted by</label>
                        <p className="mt-1 text-sm text-gray-600">{selectedItem.createdByUser.firstName} {selectedItem.createdByUser.lastName}</p>
                      </div>
                    )}
                  </div>
                </div>
                {(selectedItem.status === 'PENDING_REVIEW' || selectedItem.status === 'UNDER_REVIEW') && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button onClick={() => handleApprove(selectedItem.id)} disabled={actionLoading} className="bg-tdop-secondary hover:bg-teal-700 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button onClick={() => setRejectTarget({ id: selectedItem.id, title: selectedItem.title })} variant="danger" disabled={actionLoading}>
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button onClick={() => setSuspendTarget({ id: selectedItem.id, title: selectedItem.title })} variant="outline" disabled={actionLoading} className="border-amber-300 text-amber-700 hover:bg-amber-50">
                      <Pause className="w-4 h-4 mr-2" /> Suspend
                    </Button>
                    <Button onClick={() => setInfoTarget({ id: selectedItem.id, title: selectedItem.title })} variant="outline" disabled={actionLoading}>
                      <FileText className="w-4 h-4 mr-2" /> Request Info
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-tdop-navy flex items-center gap-2 mb-4">
                  <History className="w-5 h-5 text-tdop-primary" />
                  Case History
                </h3>
                {loadingHistory ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-tdop-primary" />
                    Loading history...
                  </div>
                ) : history.length > 0 ? (
                  <div className="space-y-3" role="list" aria-label="Moderation history timeline">
                    {history.map(entry => (
                      <div key={entry.id} className={`relative pl-6 pb-4 border-l-2 ${getActionColor(entry.action)} rounded-r-lg p-3`} role="listitem">
                        <div className="absolute -left-2 top-3 w-4 h-4 rounded-full bg-white border-2 border-current flex items-center justify-center">
                          {getActionIcon(entry.action)}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{entry.action?.replace('_', ' ')}</Badge>
                          <span className="text-xs text-gray-400">
                            {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : '—'}
                          </span>
                        </div>
                        {entry.reason && <p className="text-xs text-gray-600 mt-1">{entry.reason}</p>}
                        {entry.details && <p className="text-xs text-gray-600 mt-1">{entry.details}</p>}
                        {entry.moderator && (
                          <p className="text-xs text-gray-400 mt-1">
                            by {entry.moderator.firstName} {entry.moderator.lastName}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No history records
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
              <Eye className="w-7 h-7 text-tdop-primary" />
              Moderation Queue
            </h1>
            <p className="text-sm text-gray-500 mt-1">Review and moderate pending opportunities</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-600"><Clock className="w-5 h-5" /><span className="text-sm font-medium">Pending</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.pending}</p>
            </Card>
            <Card className="p-4 bg-teal-50 border border-teal-200">
              <div className="flex items-center gap-2 text-tdop-secondary"><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">Approved</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.approved}</p>
            </Card>
            <Card className="p-4 bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 text-red-600"><XCircle className="w-5 h-5" /><span className="text-sm font-medium">Rejected</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.rejected}</p>
            </Card>
            <Card className="p-4 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600"><Pause className="w-5 h-5" /><span className="text-sm font-medium">Suspended</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.suspended}</p>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search by title..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary focus:border-transparent"
                  aria-label="Search moderation items"
                />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </Card>

          <Card className="overflow-hidden">
            {paginated.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Eye className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-medium">No items in moderation queue</p>
              </div>
            ) : (
              <div className="divide-y" role="list" aria-label="Moderation queue items">
                {paginated.map(item => (
                  <button key={item.id}
                    onClick={() => { setSelectedItem(item); setSearchParams({ review: String(item.id) }); loadHistory(item.id); }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-tdop-primary"
                    role="listitem"
                    aria-label={`${item.title || 'Untitled'}, status ${item.status?.replace('_', ' ')}`}
                  >
                    <div className="p-2 bg-blue-50 rounded-lg shrink-0"><Briefcase className="w-5 h-5 text-tdop-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-tdop-navy truncate">{item.title || 'Untitled'}</p>
                      <p className="text-xs text-gray-500 truncate">{item.companyName || item.organization?.orgName || 'Unknown'}</p>
                    </div>
                    <Badge variant={
                      item.status === 'PENDING_REVIEW' || item.status === 'UNDER_REVIEW' ? 'danger' :
                      item.status === 'APPROVED' ? 'primary' : 'secondary'
                    }>
                      {item.status?.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-gray-400 shrink-0">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</span>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </>
      )}

      <RejectDialog open={!!rejectTarget} onCancel={() => setRejectTarget(null)} onConfirm={handleReject} title={`Reject Opportunity — ${rejectTarget?.title}`} loading={actionLoading} />
      <InputDialog open={!!suspendTarget} onCancel={() => setSuspendTarget(null)} onConfirm={handleSuspend} title={`Suspend Opportunity — ${suspendTarget?.title}`} label="Reason for suspension" placeholder="Describe the reason..." loading={actionLoading} />
      <InputDialog open={!!infoTarget} onCancel={() => setInfoTarget(null)} onConfirm={handleRequestInfo} title={`Request Information — ${infoTarget?.title}`} label="Information needed" placeholder="Describe what information is needed..." loading={actionLoading} />
    </div>
  );
};

export default TrustOpportunityReviewPage;
