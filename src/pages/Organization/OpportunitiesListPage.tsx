import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { PageError } from '@/components/ui/PageStates';
import { opportunityApi } from '@/services/api/opportunityApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { formatDate } from '@/utils/formatDate';
import { Opportunity } from '@/types/opportunity';
import {
  Briefcase,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Send,
  XCircle,
  Clock,
  Filter,
  ArrowUpDown,
  ChevronDown,
} from 'lucide-react';

const STATUS_VARIANT: Record<string, string> = {
  DRAFT: 'gray',
  draft: 'gray',
  SUBMITTED: 'info',
  submitted: 'info',
  UNDER_REVIEW: 'warning',
  PUBLISHED: 'success',
  published: 'success',
  ACTIVE: 'success',
  open: 'success',
  CLOSED: 'danger',
  closed: 'danger',
  EXPIRED: 'gray',
  expired: 'gray',
  FILLED: 'purple',
  filled: 'purple',
  REJECTED: 'danger',
};

const OpportunitiesListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await opportunityApi.getMyOpportunities();
      const list = result?.data || [];
      setOpportunities(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    opportunities.forEach(o => {
      if (o.category) cats.add(o.category);
    });
    return Array.from(cats).sort();
  }, [opportunities]);

  const filtered = useMemo(() => {
    let result = [...opportunities];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => o.title?.toLowerCase().includes(q));
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(o => o.status?.toUpperCase() === statusFilter.toUpperCase());
    }

    if (categoryFilter !== 'ALL') {
      result = result.filter(o => o.category === categoryFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return (a.createdAt || '').localeCompare(b.createdAt || '');
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'newest':
        default:
          return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
    });

    return result;
  }, [opportunities, searchQuery, statusFilter, categoryFilter, sortBy]);

  const handleSubmitForReview = async (id: string) => {
    setActionLoading(id);
    try {
      await opportunityApi.submitOpportunity(id);
      addNotification({ type: 'success', title: t('common.success'), message: t('opportunities.submitted') });
      fetchOpportunities();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || t('opportunities.submitFailed') });
    } finally {
      setActionLoading(null);
    }
  };

  const handleClose = async (id: string) => {
    setActionLoading(id);
    try {
      const { default: axiosInstance } = await import('@/services/api/axiosInstance');
      await axiosInstance.put(`/organization/opportunities/${id}/close`);
      addNotification({ type: 'success', title: t('common.success'), message: t('opportunities.closed') });
      fetchOpportunities();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || t('opportunities.closeFailed') });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('opportunities.confirmDelete'))) return;
    setActionLoading(id);
    try {
      await opportunityApi.deleteOpportunity(id);
      addNotification({ type: 'success', title: t('common.success'), message: t('opportunities.deleted') });
      fetchOpportunities();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || t('opportunities.deleteFailed') });
    } finally {
      setActionLoading(null);
    }
  };

  const renderActions = (opp: Opportunity) => {
    const status = opp.status?.toUpperCase();
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/organization/opportunity/${opp.id}`)}
          title={t('common.view')}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/edit-opportunity/${opp.id}`)}
          title={t('common.edit')}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        {status === 'DRAFT' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleSubmitForReview(opp.id)}
            disabled={actionLoading === opp.id}
            title={t('opportunities.submitForReview')}
          >
            <Send className="w-4 h-4 text-tdop-primary" />
          </Button>
        )}
        {(status === 'PUBLISHED' || status === 'ACTIVE' || status === 'OPEN') && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleClose(opp.id)}
            disabled={actionLoading === opp.id}
            title={t('opportunities.close')}
          >
            <XCircle className="w-4 h-4 text-red-500" />
          </Button>
        )}
        {status === 'DRAFT' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(opp.id)}
            disabled={actionLoading === opp.id}
            title={t('common.delete')}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded-lg w-48" />
            <div className="h-10 bg-gray-200 rounded-lg w-36" />
            <div className="h-10 bg-gray-200 rounded-lg w-36" />
          </div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageError
          message={t('common.errorLoading')}
          onRetry={fetchOpportunities}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-tdop-primary" />
            {t('opportunities.myOpportunities')}
          </h1>
          <p className="text-gray-500 mt-1">
            {t('opportunities.manageDescription')}
          </p>
        </div>
        <Button onClick={() => navigate('/create-opportunity')}>
          <Plus className="w-4 h-4 mr-2" />
          {t('opportunities.create')}
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('opportunities.searchByTitle')}
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: t('common.all') },
              { value: 'DRAFT', label: t('opportunities.status.draft') },
              { value: 'SUBMITTED', label: t('opportunities.status.submitted') },
              { value: 'UNDER_REVIEW', label: t('opportunities.status.underReview') },
              { value: 'PUBLISHED', label: t('opportunities.status.published') },
              { value: 'ACTIVE', label: t('opportunities.status.active') },
              { value: 'EXPIRED', label: t('opportunities.status.expired') },
              { value: 'CLOSED', label: t('opportunities.status.closed') },
            ]}
          />
          <Select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            options={[
              { value: 'newest', label: t('opportunities.sort.newest') },
              { value: 'oldest', label: t('opportunities.sort.oldest') },
              { value: 'title', label: t('opportunities.sort.titleAZ') },
            ]}
          />
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            {t('common.filters')}
          </Button>
        </div>

        {/* Category filter - visible on larger screens or when toggled */}
        {(showFilters || categories.length > 0) && categories.length > 0 && (
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
            <Select
              value={categoryFilter}
              onChange={(e: any) => setCategoryFilter(e.target.value)}
              options={[
                { value: 'ALL', label: t('opportunities.allCategories') },
                ...categories.map(c => ({ value: c, label: c })),
              ]}
            />
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        {t('opportunities.showing', { count: filtered.length, total: opportunities.length })}
      </div>

      {/* Opportunity List */}
      {filtered.length === 0 ? (
        opportunities.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Briefcase className="w-8 h-8 text-gray-300" />}
              title={t('opportunities.noOpportunities')}
              description={t('opportunities.noOpportunitiesDescription')}
              action={{ label: t('opportunities.createFirst'), to: '/create-opportunity' }}
            />
          </Card>
        ) : (
          <Card>
            <EmptyState
              icon={<Search className="w-8 h-8 text-gray-300" />}
              title={t('opportunities.noMatchFilters')}
              description={t('opportunities.tryAdjusting')}
            />
          </Card>
        )
      ) : (
        <>
          {/* Desktop table-like layout */}
          <div className="hidden md:block space-y-3">
            {filtered.map(opp => (
              <Card key={opp.id} hover onClick={() => navigate(`/organization/opportunity/${opp.id}`)}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-tdop-navy truncate">{opp.title}</h3>
                      <Badge variant={(STATUS_VARIANT[opp.status] || 'gray') as any} size="sm">
                        {opp.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {opp.category && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {opp.category}
                        </span>
                      )}
                      {(opp.applicationDeadline || opp.deadline) && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t('opportunities.deadline')}: {formatDate(opp.applicationDeadline || opp.deadline || '')}
                        </span>
                      )}
                      {opp.applicationsCount !== undefined && opp.applicationsCount !== null && (
                        <span>{opp.applicationsCount} {t('opportunities.applications')}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(opp.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0" onClick={(e: any) => e.stopPropagation()}>
                    {renderActions(opp)}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Mobile stacked layout */}
          <div className="md:hidden space-y-3">
            {filtered.map(opp => (
              <Card key={opp.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="font-semibold text-tdop-navy cursor-pointer hover:text-tdop-primary"
                      onClick={() => navigate(`/organization/opportunity/${opp.id}`)}
                    >
                      {opp.title}
                    </h3>
                    <Badge variant={(STATUS_VARIANT[opp.status] || 'gray') as any} size="sm">
                      {opp.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    {opp.category && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {opp.category}
                      </span>
                    )}
                    {(opp.applicationDeadline || opp.deadline) && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(opp.applicationDeadline || opp.deadline || '')}
                      </span>
                    )}
                    {opp.applicationsCount !== undefined && opp.applicationsCount !== null && (
                      <span>{opp.applicationsCount} {t('opportunities.applications')}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      {t('opportunities.created')}: {formatDate(opp.createdAt)}
                    </span>
                    <div className="flex items-center gap-1" onClick={(e: any) => e.stopPropagation()}>
                      {renderActions(opp)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OpportunitiesListPage;
