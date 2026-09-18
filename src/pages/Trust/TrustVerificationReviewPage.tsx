import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import InputDialog from '@/components/ui/InputDialog';
import RejectDialog from '@/components/ui/RejectDialog';
import Pagination from '@/components/ui/Pagination';
import { trustApi } from '@/services/api/trustApi';
import { adminApi } from '@/services/api/adminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { useNotificationContext } from '@/context/NotificationContext';
import {
  CheckCircle, XCircle, Clock, FileText, ArrowLeft, Search,
  Building2, Shield, Eye, File, Download, ExternalLink
} from 'lucide-react';

interface VerificationDocument {
  id: number;
  documentUrl: string;
  documentType?: string;
  uploadedAt: string;
}

interface VerificationRequest {
  id: number;
  organization: { id: number; orgName: string; verified: boolean };
  document: string;
  status: string;
  notes?: string;
  createdAt: string;
}

const PAGE_SIZE = 10;

const TrustVerificationReviewPage: React.FC = () => {
  const { addNotification } = useNotificationContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const reviewId = searchParams.get('review');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<{ id: number; name: string } | null>(null);
  const [infoTarget, setInfoTarget] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    if (reviewId && requests.length > 0) {
      const found = requests.find(r => r.id === Number(reviewId));
      if (found) {
        setSelectedRequest(found);
        loadDocuments(found.id);
      }
    }
  }, [reviewId, requests]);

  const loadRequests = async () => {
    try {
      const queue = await adminApi.getVerificationQueue();
      setRequests(Array.isArray(queue) ? queue : []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (requestId: number) => {
    setLoadingDocs(true);
    try {
      const docs = await trustApi.getVerificationDocuments(String(requestId));
      setDocuments(Array.isArray(docs) ? docs : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(true);
    try {
      await trustApi.approveVerification(String(id));
      addNotification({ type: 'success', title: 'Approved', message: 'Verification approved successfully.' });
      setSelectedRequest(null);
      setDocuments([]);
      loadRequests();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to approve verification.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      await trustApi.rejectVerification(String(rejectTarget.id), reason);
      addNotification({ type: 'info', title: 'Rejected', message: 'Verification rejected.' });
      setRejectTarget(null);
      setSelectedRequest(null);
      setDocuments([]);
      loadRequests();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to reject verification.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestInfo = async (info: string) => {
    if (!infoTarget) return;
    setActionLoading(true);
    try {
      await trustApi.requestVerificationInfo(String(infoTarget.id), info);
      addNotification({ type: 'info', title: 'Info Requested', message: 'Additional information requested from organization.' });
      setInfoTarget(null);
      loadRequests();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to request information.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  const filtered = requests.filter(r => {
    const matchesSearch = !searchQuery || r.organization?.orgName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = {
    pending: requests.filter(r => r.status === 'PENDING').length,
    approved: requests.filter(r => r.status === 'APPROVED').length,
    rejected: requests.filter(r => r.status === 'REJECTED').length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {selectedRequest ? (
        <div className="space-y-6">
          <button
            onClick={() => { setSelectedRequest(null); setDocuments([]); setSearchParams({}); }}
            className="flex items-center gap-2 text-sm text-tdop-primary hover:underline focus:outline-none focus:ring-2 focus:ring-tdop-primary rounded"
            aria-label="Go back to verification queue"
          >
            <ArrowLeft className="w-4 h-4" /> Back to queue
          </button>

          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-tdop-navy">{selectedRequest.organization?.orgName}</h2>
                <p className="text-sm text-gray-500 mt-1">Verification request #{selectedRequest.id}</p>
              </div>
              <Badge variant={selectedRequest.status === 'PENDING' ? 'danger' : 'primary'}>
                {selectedRequest.status}
              </Badge>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Submitted Document</label>
                <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedRequest.document || 'No document provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Submitted</label>
                <p className="mt-1 text-sm text-gray-600">{selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString() : '—'}</p>
              </div>
            </div>

            {selectedRequest.notes && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <p className="mt-1 text-sm text-gray-600">{selectedRequest.notes}</p>
              </div>
            )}

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <File className="w-4 h-4" />
                Evidence Documents ({documents.length})
              </label>
              {loadingDocs ? (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-tdop-primary" />
                  Loading documents...
                </div>
              ) : documents.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <FileText className="w-5 h-5 text-tdop-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-tdop-navy truncate">
                          {doc.documentType || 'Document'} — {doc.documentUrl.split('/').pop()}
                        </p>
                        <p className="text-xs text-gray-400">
                          Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'}
                        </p>
                      </div>
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 p-2 text-tdop-primary hover:bg-teal-50 rounded-lg transition-colors"
                        aria-label={`Open document ${doc.documentUrl.split('/').pop()}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">No documents uploaded</p>
              )}
            </div>

            {selectedRequest.status === 'PENDING' && (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => handleApprove(selectedRequest.id)} disabled={actionLoading} className="bg-tdop-secondary hover:bg-teal-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button onClick={() => setRejectTarget({ id: selectedRequest.id, name: selectedRequest.organization?.orgName })} variant="danger" disabled={actionLoading}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button onClick={() => setInfoTarget({ id: selectedRequest.id, name: selectedRequest.organization?.orgName })} variant="outline" disabled={actionLoading}>
                  <FileText className="w-4 h-4 mr-2" /> Request Info
                </Button>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
              <Shield className="w-7 h-7 text-tdop-primary" />
              Verification Queue
            </h1>
            <p className="text-sm text-gray-500 mt-1">Review and process organization verification requests</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          </div>

          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by organization name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary focus:border-transparent"
                  aria-label="Search verification requests"
                />
              </div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </Card>

          <Card className="overflow-hidden">
            {paginated.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-medium">No verification requests</p>
              </div>
            ) : (
              <div className="divide-y" role="list" aria-label="Verification requests">
                {paginated.map(req => (
                  <button
                    key={req.id}
                    onClick={() => { setSelectedRequest(req); setSearchParams({ review: String(req.id) }); loadDocuments(req.id); }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-tdop-primary"
                    role="listitem"
                    aria-label={`Verification request for ${req.organization?.orgName || 'Unknown'}, status ${req.status}`}
                  >
                    <div className="p-2 bg-teal-50 rounded-lg shrink-0"><Building2 className="w-5 h-5 text-tdop-secondary" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-tdop-navy truncate">{req.organization?.orgName || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 truncate">{req.document || 'No document'}</p>
                    </div>
                    <Badge variant={req.status === 'PENDING' ? 'danger' : req.status === 'APPROVED' ? 'primary' : 'secondary'}>
                      {req.status}
                    </Badge>
                    <span className="text-xs text-gray-400 shrink-0">{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—'}</span>
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

      <RejectDialog
        open={!!rejectTarget}
        onCancel={() => setRejectTarget(null)}
        onConfirm={handleReject}
        title={`Reject Verification — ${rejectTarget?.name}`}
        loading={actionLoading}
      />

      <InputDialog
        open={!!infoTarget}
        onCancel={() => setInfoTarget(null)}
        onConfirm={handleRequestInfo}
        title={`Request Information — ${infoTarget?.name}`}
        label="Information needed"
        placeholder="Describe what information is needed..."
        loading={actionLoading}
      />
    </div>
  );
};

export default TrustVerificationReviewPage;
