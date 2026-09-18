import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import RejectDialog from '@/components/ui/RejectDialog';
import Pagination from '@/components/ui/Pagination';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { PageError } from '@/components/ui/PageStates';
import { adminApi } from '@/services/api/adminApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { CheckCircle, XCircle, AlertTriangle, Search, Clock, Eye } from 'lucide-react';

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

const OpportunityModerationPage: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectTarget, setRejectTarget] = useState<{ id: number; title: string } | null>(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await adminApi.getPendingModeration();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await adminApi.verifyOpportunity(String(id), true);
      addNotification({ type: 'success', title: 'Approved', message: 'Opportunity approved.' });
      fetchItems();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to approve.' });
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    setRejectLoading(true);
    try {
      await adminApi.verifyOpportunity(String(rejectTarget.id), false, reason);
      addNotification({ type: 'info', title: 'Rejected', message: 'Opportunity rejected.' });
      setRejectTarget(null);
      fetchItems();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to reject.' });
    } finally {
      setRejectLoading(false);
    }
  };

  const filtered = items.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.title?.toLowerCase().includes(q) || item.createdBy?.orgName?.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) return <PageError message="Failed to load opportunities for moderation. Please try again." onRetry={fetchItems} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <AlertTriangle className="w-8 h-8 text-tdop-primary" />
          {t('admin.opportunities')}
        </h1>
        <p className="text-gray-500 mt-1">Review and moderate submitted opportunities</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search opportunities..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
        />
      </div>

      <DashboardSection
        title="Pending verification"
        icon={<Clock className="w-4 h-4 text-amber-500" />}
        empty={filtered.length === 0}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<CheckCircle className="w-8 h-8 text-emerald-400" />}
            title="All clear"
            description="No opportunities pending verification."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {paginated.map(item => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-tdop-navy">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                      {item.createdBy?.orgName && <span>{item.createdBy.orgName}</span>}
                      {item.category && <span>{item.category}</span>}
                      {item.location && <span>{item.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" onClick={() => handleApprove(item.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setRejectTarget({ id: item.id, title: item.title })}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardSection>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <RejectDialog
        open={!!rejectTarget}
        title={`Reject "${rejectTarget?.title || ''}"?`}
        onConfirm={handleReject}
        onCancel={() => setRejectTarget(null)}
        loading={rejectLoading}
      />
    </div>
  );
};

export default OpportunityModerationPage;
