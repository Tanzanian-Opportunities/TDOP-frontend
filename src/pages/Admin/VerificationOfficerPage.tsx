import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import InputDialog from '@/components/ui/InputDialog';
import Pagination from '@/components/ui/Pagination';
import { adminApi } from '@/services/api/adminApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { StatCard } from '@/components/dashboard/StatCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { PageError } from '@/components/ui/PageStates';
import { CheckCircle, XCircle, Clock, FileText, AlertTriangle, Search, ArrowRight } from 'lucide-react';

const PAGE_SIZE = 15;

interface VerificationRequest {
  id: number;
  organization: { id: number; orgName: string; verified: boolean };
  document: string;
  status: string;
  notes?: string;
  createdAt: string;
}

const VerificationOfficerPage: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState({ pending: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [rejectTarget, setRejectTarget] = useState<{ id: number; orgName: string } | null>(null);
  const [infoTarget, setInfoTarget] = useState<{ id: number; orgName: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [queue, statsData] = await Promise.all([
        adminApi.getVerificationQueue(),
        adminApi.getVerificationStats()
      ]);
      setRequests(Array.isArray(queue) ? queue : []);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await adminApi.approveVerification(String(id));
      addNotification({ type: 'success', title: 'Approved', message: 'Verification approved.' });
      fetchData();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: t('adminVerificationOfficer.failedApprove') });
      console.error(err);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      await adminApi.rejectVerification(String(rejectTarget.id), reason);
      setRejectTarget(null);
      fetchData();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: t('adminVerificationOfficer.failedReject') });
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestInfo = async (info: string) => {
    if (!infoTarget) return;
    setActionLoading(true);
    try {
      await adminApi.requestVerificationInfo(String(infoTarget.id), info);
      setInfoTarget(null);
      fetchData();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: t('adminVerificationOfficer.failedInfo') });
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = requests.filter(req => {
    const matchesSearch = searchQuery === '' ||
      req.organization?.orgName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.document?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const approved = requests.filter(r => r.status === 'APPROVED').length;
  const rejected = requests.filter(r => r.status === 'REJECTED').length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-3xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
          </div>
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) return <PageError message={t('adminVerificationOfficer.failedToLoad')} onRetry={fetchData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      {/* Welcome Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-tdop-navy to-tdop-primary p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-3xl font-bold font-display">{t('adminVerificationOfficer.title')}</h1>
          <p className="text-white/70 mt-1">{t('adminVerificationOfficer.subtitle')}</p>
          {stats.pending > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 text-sm font-medium">
              <Clock className="w-4 h-4" />
              {stats.pending} {t('adminVerificationOfficer.pendingReview')}
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          value={stats.pending}
          label={t('adminVerificationOfficer.pendingReview')}
          icon={<Clock className="w-5 h-5" />}
          color={stats.pending ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-tdop-secondary'}
          trend={stats.pending ? 'up' : 'neutral'}
        />
        <StatCard
          value={approved}
          label={t('adminVerificationOfficer.approved')}
          icon={<CheckCircle className="w-5 h-5" />}
          color="bg-emerald-50 text-tdop-secondary"
          trend="neutral"
        />
        <StatCard
          value={rejected}
          label={t('adminVerificationOfficer.rejected')}
          icon={<XCircle className="w-5 h-5" />}
          color="bg-red-50 text-red-600"
          trend="neutral"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('adminVerificationOfficer.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {['all', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-white text-tdop-navy shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status === 'all' ? t('adminVerificationOfficer.all') : status}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Queue */}
      <DashboardSection
        title={t('adminVerificationOfficer.verificationRequests')}
        icon={<FileText className="w-4 h-4" />}
        empty={filtered.length === 0}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<CheckCircle className="w-8 h-8 text-emerald-400" />}
            title={t('adminVerificationOfficer.allClear')}
            description={searchQuery || filterStatus !== 'all'
              ? t('adminVerificationOfficer.noRequestsMatch')
              : t('adminVerificationOfficer.noPendingRequests')}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {paginated.map((req) => (
              <div key={req.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-tdop-navy">{req.organization?.orgName || 'Unknown'}</h3>
                      <Badge
                        variant={req.status === 'PENDING' ? 'warning' : req.status === 'APPROVED' ? 'success' : 'danger'}
                        size="sm"
                      >
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('adminVerificationOfficer.document')} <span className="text-tdop-navy font-medium">{req.document}</span>
                    </p>
                    {req.notes && <p className="text-sm text-gray-500 mt-1">{t('adminVerificationOfficer.notes')} {req.notes}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {t('adminVerificationOfficer.submitted')} {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" onClick={() => handleApprove(req.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> {t('adminVerificationOfficer.approve')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setInfoTarget({ id: req.id, orgName: req.organization?.orgName || 'Unknown' })}>
                      <FileText className="w-4 h-4 mr-1" /> {t('adminVerificationOfficer.info')}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setRejectTarget({ id: req.id, orgName: req.organization?.orgName || 'Unknown' })}>
                      <XCircle className="w-4 h-4 mr-1" /> {t('adminVerificationOfficer.reject')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardSection>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <InputDialog
        open={!!rejectTarget}
        title={`Reject "${rejectTarget?.orgName || ''}"?`}
        label={t('adminVerificationOfficer.rejectionReason')}
        placeholder={t('adminVerificationOfficer.rejectionPlaceholder')}
        multiline
        onConfirm={handleReject}
        onCancel={() => setRejectTarget(null)}
        loading={actionLoading}
      />
      <InputDialog
        open={!!infoTarget}
        title={`Request info from "${infoTarget?.orgName || ''}"`}
        label={t('adminVerificationOfficer.infoNeeded')}
        placeholder={t('adminVerificationOfficer.infoPlaceholder')}
        multiline
        onConfirm={handleRequestInfo}
        onCancel={() => setInfoTarget(null)}
        loading={actionLoading}
      />
    </div>
  );
};

export default VerificationOfficerPage;
