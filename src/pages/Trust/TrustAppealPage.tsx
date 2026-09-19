import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import InputDialog from '@/components/ui/InputDialog';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Pagination from '@/components/ui/Pagination';
import { trustApi } from '@/services/api/trustApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { useNotificationContext } from '@/context/NotificationContext';
import {
  Scale, CheckCircle, XCircle, Clock, Search,
  Shield, MessageSquare, AlertTriangle
} from 'lucide-react';

interface Appeal {
  id: number;
  targetType: string;
  targetId: number;
  reason: string;
  description?: string;
  status: string;
  appellant?: { firstName: string; lastName: string; email: string };
  reviewedBy?: { firstName: string; lastName: string; email: string };
  reviewNotes?: string;
  resolution?: string;
  reviewedAt?: string;
  createdAt: string;
}

const PAGE_SIZE = 10;

const TrustAppealPage: React.FC = () => {
  const { addNotification } = useNotificationContext();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [upholdTarget, setUpholdTarget] = useState<{ id: number; reason: string } | null>(null);
  const [overruleTarget, setOverruleTarget] = useState<{ id: number; reason: string } | null>(null);
  const [dismissTarget, setDismissTarget] = useState<{ id: number; reason: string } | null>(null);

  useEffect(() => { loadAppeals(); }, []);

  const loadAppeals = async () => {
    try {
      const data = await trustApi.getAppeals();
      setAppeals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUphold = async (resolution: string) => {
    if (!upholdTarget) return;
    setActionLoading(true);
    try {
      await trustApi.upholdAppeal(String(upholdTarget.id), resolution);
      addNotification({ type: 'success', title: 'Upheld', message: 'Appeal upheld.' });
      setUpholdTarget(null);
      setSelectedAppeal(null);
      loadAppeals();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to uphold.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleOverrule = async (resolution: string) => {
    if (!overruleTarget) return;
    setActionLoading(true);
    try {
      await trustApi.overruleAppeal(String(overruleTarget.id), resolution);
      addNotification({ type: 'info', title: 'Overruled', message: 'Appeal overruled.' });
      setOverruleTarget(null);
      setSelectedAppeal(null);
      loadAppeals();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to overrule.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismiss = async () => {
    if (!dismissTarget) return;
    setActionLoading(true);
    try {
      await trustApi.dismissAppeal(String(dismissTarget.id));
      addNotification({ type: 'info', title: 'Dismissed', message: 'Appeal dismissed.' });
      setDismissTarget(null);
      setSelectedAppeal(null);
      loadAppeals();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to dismiss.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  const filtered = appeals.filter(a => {
    const matchesSearch = !searchQuery || a.reason?.toLowerCase().includes(searchQuery.toLowerCase()) || a.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || a.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = {
    pending: appeals.filter(a => a.status === 'PENDING').length,
    underReview: appeals.filter(a => a.status === 'UNDER_REVIEW').length,
    upheld: appeals.filter(a => a.status === 'UPHELD').length,
    overruled: appeals.filter(a => a.status === 'OVERRULED').length,
    dismissed: appeals.filter(a => a.status === 'DISMISSED').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return <Badge variant="danger">Pending</Badge>;
      case 'UNDER_REVIEW': return <Badge variant="primary">Under Review</Badge>;
      case 'UPHELD': return <Badge className="bg-tdop-secondary text-white">Upheld</Badge>;
      case 'OVERRULED': return <Badge variant="danger">Overruled</Badge>;
      case 'DISMISSED': return <Badge variant="secondary">Dismissed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {selectedAppeal ? (
        <div className="space-y-6">
          <button onClick={() => setSelectedAppeal(null)} className="flex items-center gap-2 text-sm text-tdop-primary hover:underline focus:outline-none focus:ring-2 focus:ring-tdop-primary rounded" aria-label="Go back">
            ← Back to appeals
          </button>
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-tdop-navy flex items-center gap-2">
                  <Scale className="w-5 h-5 text-tdop-primary" />
                  Appeal #{selectedAppeal.id}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{selectedAppeal.reason}</p>
              </div>
              {getStatusBadge(selectedAppeal.status)}
            </div>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Target</label>
                  <p className="mt-1 text-sm text-gray-600 capitalize">{selectedAppeal.targetType?.replace('_', ' ')} #{selectedAppeal.targetId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Created</label>
                  <p className="mt-1 text-sm text-gray-600">{selectedAppeal.createdAt ? new Date(selectedAppeal.createdAt).toLocaleString() : '—'}</p>
                </div>
              </div>
              {selectedAppeal.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{selectedAppeal.description}</p>
                </div>
              )}
              {selectedAppeal.appellant && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Appellant</label>
                  <p className="mt-1 text-sm text-gray-600">{selectedAppeal.appellant.firstName} {selectedAppeal.appellant.lastName} ({selectedAppeal.appellant.email})</p>
                </div>
              )}
              {selectedAppeal.reviewedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Reviewed by</label>
                  <p className="mt-1 text-sm text-gray-600">{selectedAppeal.reviewedBy.firstName} {selectedAppeal.reviewedBy.lastName}</p>
                </div>
              )}
              {selectedAppeal.reviewNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Review Notes</label>
                  <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedAppeal.reviewNotes}</p>
                </div>
              )}
              {selectedAppeal.resolution && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Resolution</label>
                  <p className="mt-1 text-sm text-gray-600 bg-teal-50 p-3 rounded-lg">{selectedAppeal.resolution}</p>
                </div>
              )}
            </div>
            {(selectedAppeal.status === 'PENDING' || selectedAppeal.status === 'UNDER_REVIEW') && (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => setUpholdTarget({ id: selectedAppeal.id, reason: selectedAppeal.reason })} disabled={actionLoading} className="bg-tdop-secondary hover:bg-teal-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" /> Uphold Appeal
                </Button>
                <Button onClick={() => setOverruleTarget({ id: selectedAppeal.id, reason: selectedAppeal.reason })} variant="danger" disabled={actionLoading}>
                  <XCircle className="w-4 h-4 mr-2" /> Overrule Appeal
                </Button>
                <Button onClick={() => setDismissTarget({ id: selectedAppeal.id, reason: selectedAppeal.reason })} variant="outline" disabled={actionLoading}>
                  Dismiss
                </Button>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
              <Scale className="w-7 h-7 text-tdop-primary" />
              Appeals
            </h1>
            <p className="text-sm text-gray-500 mt-1">Review and decide on user-submitted appeals</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="p-4 bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-600"><Clock className="w-5 h-5" /><span className="text-sm font-medium">Pending</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.pending}</p>
            </Card>
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 text-tdop-primary"><MessageSquare className="w-5 h-5" /><span className="text-sm font-medium">Review</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.underReview}</p>
            </Card>
            <Card className="p-4 bg-teal-50 border border-teal-200">
              <div className="flex items-center gap-2 text-tdop-secondary"><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">Upheld</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.upheld}</p>
            </Card>
            <Card className="p-4 bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 text-red-600"><XCircle className="w-5 h-5" /><span className="text-sm font-medium">Overruled</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.overruled}</p>
            </Card>
            <Card className="p-4 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600"><Shield className="w-5 h-5" /><span className="text-sm font-medium">Dismissed</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.dismissed}</p>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search appeals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary focus:border-transparent"
                  aria-label="Search appeals"
                />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary" aria-label="Filter by status">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="upheld">Upheld</option>
                <option value="overruled">Overruled</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </Card>

          <Card className="overflow-hidden">
            {paginated.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Scale className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-medium">No appeals</p>
              </div>
            ) : (
              <div className="divide-y" role="list" aria-label="Appeals list">
                {paginated.map(a => (
                  <button key={a.id} onClick={() => setSelectedAppeal(a)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-tdop-primary"
                    role="listitem"
                    aria-label={`Appeal: ${a.reason}, status ${a.status}`}
                  >
                    <div className="p-2 bg-blue-50 rounded-lg shrink-0"><Scale className="w-5 h-5 text-tdop-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-tdop-navy truncate">{a.reason}</p>
                      <p className="text-xs text-gray-500 truncate">{a.targetType?.replace('_', ' ')} #{a.targetId}</p>
                    </div>
                    {getStatusBadge(a.status)}
                    <span className="text-xs text-gray-400 shrink-0">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}</span>
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

      <InputDialog open={!!upholdTarget} onCancel={() => setUpholdTarget(null)} onConfirm={handleUphold} title="Uphold Appeal" label="Resolution notes" placeholder="Explain why the appeal is upheld..." loading={actionLoading} />
      <InputDialog open={!!overruleTarget} onCancel={() => setOverruleTarget(null)} onConfirm={handleOverrule} title="Overrule Appeal" label="Resolution notes" placeholder="Explain why the appeal is overruled..." loading={actionLoading} />
      <ConfirmDialog open={!!dismissTarget} onCancel={() => setDismissTarget(null)} onConfirm={handleDismiss} title="Dismiss Appeal" message={`Dismiss: "${dismissTarget?.reason}"?`} confirmLabel="Dismiss" loading={actionLoading} />
    </div>
  );
};

export default TrustAppealPage;
