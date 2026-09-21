import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import InputDialog from '@/components/ui/InputDialog';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Pagination from '@/components/ui/Pagination';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { StatCard } from '@/components/dashboard/StatCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { PageError } from '@/components/ui/PageStates';
import { CheckCircle, XCircle, Eye, AlertTriangle, Archive, Search, Building2, MapPin } from 'lucide-react';
import { adminApi } from '@/services/api/adminApi';
import { useNotificationContext } from '@/context/NotificationContext';

const PAGE_SIZE = 15;

interface ModerationItem {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  location: string;
  createdBy?: { orgName: string };
  createdAt: string;
}

const ModerationPage: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogTarget, setDialogTarget] = useState<{ type: string; id: number; title: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const data = await adminApi.getModerationQueue();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reason: string) => {
    if (!dialogTarget) return;
    setActionLoading(true);
    try {
      await adminApi.approveModeration(String(dialogTarget.id), reason || undefined);
      setDialogTarget(null);
      fetchQueue();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: t('adminModeration.failedApprove') });
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!dialogTarget) return;
    setActionLoading(true);
    try {
      await adminApi.rejectModeration(String(dialogTarget.id), reason);
      setDialogTarget(null);
      fetchQueue();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: t('adminModeration.failedReject') });
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async (reason: string) => {
    if (!dialogTarget) return;
    setActionLoading(true);
    try {
      await adminApi.suspendModeration(String(dialogTarget.id), reason);
      setDialogTarget(null);
      fetchQueue();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: t('adminModeration.failedSuspend') });
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = items.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.createdBy?.orgName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const statusCounts = {
    total: items.length,
    submitted: items.filter(i => i.status === 'SUBMITTED').length,
    underReview: items.filter(i => i.status === 'UNDER_REVIEW').length,
  };

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

  if (error) return <PageError message={t('adminModeration.failedToLoad')} onRetry={fetchQueue} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      {/* Welcome Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-tdop-navy to-tdop-primary p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-3xl font-bold font-display">{t('adminModeration.title')}</h1>
          <p className="text-white/70 mt-1">{t('adminModeration.subtitle')}</p>
          {statusCounts.total > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-sm font-medium">
              <Eye className="w-4 h-4" />
              {statusCounts.total} {t('adminModeration.itemsInQueue')}
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          value={statusCounts.total}
          label={t('adminModeration.totalInQueue')}
          icon={<Eye className="w-5 h-5" />}
          color="bg-tdop-primary/10 text-tdop-primary"
          trend="neutral"
        />
        <StatCard
          value={statusCounts.submitted}
          label={t('adminModeration.newSubmissions')}
          icon={<AlertTriangle className="w-5 h-5" />}
          color={statusCounts.submitted ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-tdop-secondary'}
          trend={statusCounts.submitted ? 'up' : 'neutral'}
        />
        <StatCard
          value={statusCounts.underReview}
          label={t('adminModeration.underReview')}
          icon={<Archive className="w-5 h-5" />}
          color={statusCounts.underReview ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-tdop-secondary'}
          trend="neutral"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('adminModeration.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {['all', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-white text-tdop-navy shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status === 'all' ? t('adminModeration.all') : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Moderation Queue */}
      <DashboardSection
        title={t('adminModeration.opportunitiesToModerate')}
        icon={<Eye className="w-4 h-4" />}
        empty={filtered.length === 0}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<CheckCircle className="w-8 h-8 text-emerald-400" />}
            title={t('adminModeration.allClear')}
            description={searchQuery || filterStatus !== 'all'
              ? t('adminModeration.noItemsMatch')
              : t('adminModeration.noItemsRightNow')}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {paginated.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-tdop-navy">{item.title}</h3>
                      <Badge
                        variant={item.status === 'SUBMITTED' ? 'info' : item.status === 'UNDER_REVIEW' ? 'warning' : item.status === 'APPROVED' ? 'success' : 'danger'}
                        size="sm"
                      >
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      {item.category && (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-tdop-primary" />
                          {item.category}
                        </span>
                      )}
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{item.location}
                        </span>
                      )}
                      {item.createdBy?.orgName && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />{item.createdBy.orgName}
                        </span>
                      )}
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" onClick={() => setDialogTarget({ type: 'approve', id: item.id, title: item.title })}>
                      <CheckCircle className="w-4 h-4 mr-1" /> {t('adminModeration.approve')}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setDialogTarget({ type: 'reject', id: item.id, title: item.title })}>
                      <XCircle className="w-4 h-4 mr-1" /> {t('adminModeration.reject')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDialogTarget({ type: 'suspend', id: item.id, title: item.title })}>
                      <Archive className="w-4 h-4 mr-1" /> {t('adminModeration.suspend')}
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
        open={!!dialogTarget && dialogTarget.type === 'approve'}
        title={`Approve "${dialogTarget?.title || ''}"?`}
        label={t('adminModeration.approvalNote')}
        placeholder={t('adminModeration.approvalPlaceholder')}
        required={false}
        onConfirm={handleApprove}
        onCancel={() => setDialogTarget(null)}
        loading={actionLoading}
      />
      <InputDialog
        open={!!dialogTarget && dialogTarget.type === 'reject'}
        title={`Reject "${dialogTarget?.title || ''}"?`}
        label={t('adminModeration.rejectionReason')}
        placeholder={t('adminModeration.rejectionPlaceholder')}
        multiline
        onConfirm={handleReject}
        onCancel={() => setDialogTarget(null)}
        loading={actionLoading}
      />
      <InputDialog
        open={!!dialogTarget && dialogTarget.type === 'suspend'}
        title={`Suspend "${dialogTarget?.title || ''}"?`}
        label={t('adminModeration.suspensionReason')}
        placeholder={t('adminModeration.suspensionPlaceholder')}
        multiline
        onConfirm={handleSuspend}
        onCancel={() => setDialogTarget(null)}
        loading={actionLoading}
      />
    </div>
  );
};

export default ModerationPage;
