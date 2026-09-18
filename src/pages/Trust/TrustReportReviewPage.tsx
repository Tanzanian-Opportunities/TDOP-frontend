import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import InputDialog from '@/components/ui/InputDialog';
import Pagination from '@/components/ui/Pagination';
import { trustApi } from '@/services/api/trustApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { useNotificationContext } from '@/context/NotificationContext';
import {
  Flag, CheckCircle, XCircle, Clock, ArrowLeft,
  Search, AlertTriangle, FileText, User, Eye
} from 'lucide-react';

interface Report {
  id: number;
  reason: string;
  description?: string;
  status: string;
  targetType: string;
  targetId: number;
  reporter?: { firstName: string; lastName: string; email: string };
  assignedTo?: { firstName: string; lastName: string };
  investigationNotes?: string;
  resolution?: string;
  createdAt: string;
}

const PAGE_SIZE = 10;

const TrustReportReviewPage: React.FC = () => {
  const { addNotification } = useNotificationContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const reviewId = searchParams.get('review');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [resolveTarget, setResolveTarget] = useState<{ id: number; reason: string } | null>(null);
  const [dismissTarget, setDismissTarget] = useState<{ id: number; reason: string } | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    if (reviewId && reports.length > 0) {
      const found = reports.find(r => r.id === Number(reviewId));
      if (found) setSelectedReport(found);
    }
  }, [reviewId, reports]);

  const loadReports = async () => {
    try {
      const allReports = await trustApi.getReports();
      setReports(Array.isArray(allReports) ? allReports : []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (resolution: string) => {
    if (!resolveTarget) return;
    setActionLoading(true);
    try {
      await trustApi.resolveReport(String(resolveTarget.id), resolution);
      addNotification({ type: 'success', title: 'Resolved', message: 'Report resolved successfully.' });
      setResolveTarget(null);
      setSelectedReport(null);
      loadReports();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to resolve report.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismiss = async () => {
    if (!dismissTarget) return;
    setActionLoading(true);
    try {
      await trustApi.dismissReport(String(dismissTarget.id));
      addNotification({ type: 'info', title: 'Dismissed', message: 'Report dismissed.' });
      setDismissTarget(null);
      setSelectedReport(null);
      loadReports();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to dismiss report.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  const filtered = reports.filter(r => {
    const matchesSearch = !searchQuery || r.reason?.toLowerCase().includes(searchQuery.toLowerCase()) || r.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = {
    pending: reports.filter(r => r.status === 'PENDING').length,
    reviewed: reports.filter(r => r.status === 'REVIEWED').length,
    actioned: reports.filter(r => r.status === 'ACTIONED').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return <Badge variant="danger">Pending</Badge>;
      case 'REVIEWED': return <Badge variant="primary">Reviewed</Badge>;
      case 'ACTIONED': return <Badge className="bg-tdop-secondary text-white">Actioned</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {selectedReport ? (
        <div className="space-y-6">
          <button onClick={() => { setSelectedReport(null); setSearchParams({}); }} className="flex items-center gap-2 text-sm text-tdop-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to reports
          </button>
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-tdop-navy flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-500" />
                  Report #{selectedReport.id}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{selectedReport.reason}</p>
              </div>
              {getStatusBadge(selectedReport.status)}
            </div>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Target Type</label>
                  <p className="mt-1 text-sm text-gray-600 capitalize">{selectedReport.targetType?.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Target ID</label>
                  <p className="mt-1 text-sm text-gray-600">#{selectedReport.targetId}</p>
                </div>
              </div>
              {selectedReport.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{selectedReport.description}</p>
                </div>
              )}
              {selectedReport.reporter && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Reported by</label>
                  <p className="mt-1 text-sm text-gray-600">{selectedReport.reporter.firstName} {selectedReport.reporter.lastName} ({selectedReport.reporter.email})</p>
                </div>
              )}
              {selectedReport.assignedTo && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned to</label>
                  <p className="mt-1 text-sm text-gray-600">{selectedReport.assignedTo.firstName} {selectedReport.assignedTo.lastName}</p>
                </div>
              )}
              {selectedReport.investigationNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Investigation Notes</label>
                  <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedReport.investigationNotes}</p>
                </div>
              )}
              {selectedReport.resolution && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Resolution</label>
                  <p className="mt-1 text-sm text-gray-600 bg-teal-50 p-3 rounded-lg">{selectedReport.resolution}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Created</label>
                <p className="mt-1 text-sm text-gray-600">{selectedReport.createdAt ? new Date(selectedReport.createdAt).toLocaleString() : '—'}</p>
              </div>
            </div>
            {selectedReport.status !== 'ACTIONED' && (
              <div className="mt-6 flex gap-3">
                <Button onClick={() => setResolveTarget({ id: selectedReport.id, reason: selectedReport.reason })} disabled={actionLoading} className="bg-tdop-secondary hover:bg-teal-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" /> Resolve
                </Button>
                <Button onClick={() => setDismissTarget({ id: selectedReport.id, reason: selectedReport.reason })} variant="outline" disabled={actionLoading}>
                  <XCircle className="w-4 h-4 mr-2" /> Dismiss
                </Button>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
              <Flag className="w-7 h-7 text-red-500" />
              Reports Center
            </h1>
            <p className="text-sm text-gray-500 mt-1">Review and act on user-submitted reports</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-600"><Clock className="w-5 h-5" /><span className="text-sm font-medium">Pending</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.pending}</p>
            </Card>
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 text-tdop-primary"><Eye className="w-5 h-5" /><span className="text-sm font-medium">Reviewed</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.reviewed}</p>
            </Card>
            <Card className="p-4 bg-teal-50 border border-teal-200">
              <div className="flex items-center gap-2 text-tdop-secondary"><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">Actioned</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.actioned}</p>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search reports..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary focus:border-transparent" />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="actioned">Actioned</option>
              </select>
            </div>
          </Card>

          <Card className="overflow-hidden">
            {paginated.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Flag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-medium">No reports found</p>
              </div>
            ) : (
              <div className="divide-y">
                {paginated.map(report => (
                  <button
                    key={report.id}
                    onClick={() => { setSelectedReport(report); setSearchParams({ review: String(report.id) }); }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="p-2 bg-red-50 rounded-lg"><Flag className="w-5 h-5 text-red-500" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-tdop-navy truncate">{report.reason}</p>
                      <p className="text-xs text-gray-500 truncate">{report.targetType?.replace('_', ' ')} • Report #{report.id}</p>
                    </div>
                    {getStatusBadge(report.status)}
                    <span className="text-xs text-gray-400 shrink-0">{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '—'}</span>
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

      <InputDialog open={!!resolveTarget} onCancel={() => setResolveTarget(null)} onConfirm={handleResolve} title="Resolve Report" label="Resolution details" placeholder="Describe the resolution taken..." loading={actionLoading} />
      <ConfirmDialog open={!!dismissTarget} onCancel={() => setDismissTarget(null)} onConfirm={handleDismiss} title="Dismiss Report" message={`Dismiss report: "${dismissTarget?.reason}"? This action cannot be undone.`} confirmLabel="Dismiss" loading={actionLoading} />
    </div>
  );
};

export default TrustReportReviewPage;
