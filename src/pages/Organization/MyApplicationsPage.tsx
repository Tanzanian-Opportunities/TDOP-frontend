import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { PageError } from '@/components/ui/PageStates';
import { applicationApi } from '@/services/api/applicationApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { formatDate } from '@/utils/formatDate';
import { FileText, Eye, Clock, Search, Check, X } from 'lucide-react';

const statusColors: Record<string, string> = {
  APPLIED: 'info',
  UNDER_REVIEW: 'info',
  SHORTLISTED: 'success',
  INTERVIEW: 'accent',
  ACCEPTED: 'success',
  REJECTED: 'danger',
  WITHDRAWN: 'gray',
  PREPARING: 'gray',
};

const OrgMyApplicationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const data = await applicationApi.getApplications();
      const list = data?.applications || (Array.isArray(data) ? data : []);
      setApplications(list);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (appId: string) => {
    setActionLoading(appId);
    try {
      await applicationApi.shortlistApplication(appId);
      addNotification({ type: 'success', title: t('common.success'), message: t('application.shortlisted') });
      fetchApplications();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || 'Failed' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (appId: string) => {
    setActionLoading(appId);
    try {
      await applicationApi.rejectApplication(appId);
      addNotification({ type: 'success', title: t('common.success'), message: t('application.rejected') });
      fetchApplications();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || 'Failed' });
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = applications.filter(app => {
    const matchesSearch = !searchQuery ||
      app.opportunityTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.seekerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><PageError message={t('common.errorLoading')} onRetry={fetchApplications} /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <FileText className="w-8 h-8 text-tdop-primary" />
          {t('application.title')}
        </h1>
        <p className="text-gray-500 mt-1">{t('orgDashboard.recentApplications')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('admin.searchUsers')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
          options={[
            { value: 'ALL', label: t('common.all') },
            { value: 'APPLIED', label: t('application.applied') },
            { value: 'UNDER_REVIEW', label: t('application.pending') },
            { value: 'SHORTLISTED', label: t('application.shortlisted') },
            { value: 'INTERVIEW', label: t('application.interview') },
            { value: 'ACCEPTED', label: t('application.offer') },
            { value: 'REJECTED', label: t('application.rejected') },
          ]}
        />
      </div>

      <DashboardSection
        title={t('application.title')}
        icon={<FileText className="w-4 h-4" />}
        empty={filtered.length === 0}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8 text-gray-300" />}
            title={searchQuery || statusFilter !== 'ALL' ? t('common.noResults') : t('application.noApplications')}
            description={t('application.startApplying')}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(app => (
              <div key={app.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-tdop-navy truncate">
                      {app.opportunityTitle || app.title || t('application.title')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {app.applicantName || app.seekerName || ''}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant={(statusColors[app.status] || 'gray') as any} size="sm">
                        {app.status}
                      </Badge>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {app.createdAt ? formatDate(app.createdAt) : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {(app.status === 'APPLIED' || app.status === 'UNDER_REVIEW') && (
                      <>
                        <Button size="sm" onClick={() => handleShortlist(app.id)} disabled={actionLoading === app.id}>
                          <Check className="w-3 h-3 mr-1" /> {t('trust.approve')}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleReject(app.id)} disabled={actionLoading === app.id}>
                          <X className="w-3 h-3 mr-1" /> {t('trust.reject')}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardSection>
    </div>
  );
};

export default OrgMyApplicationsPage;
