import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { PageError } from '@/components/ui/PageStates';
import { applicationApi } from '@/services/api/applicationApi';
import { formatDate } from '@/utils/formatDate';
import { FileText, Eye, Clock, Search, ArrowRight } from 'lucide-react';

interface Application {
  id: string;
  opportunityTitle?: string;
  title?: string;
  applicantName?: string;
  seekerName?: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'warning',
  submitted: 'info',
  reviewed: 'info',
  shortlisted: 'success',
  accepted: 'success',
  rejected: 'danger',
  withdrawn: 'gray',
};

const OrgMyApplicationsPage: React.FC = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await applicationApi.getApplications();
      const list = data?.applications || (Array.isArray(data) ? data : []);
      setApplications(list);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications.filter(app => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.opportunityTitle?.toLowerCase().includes(q) ||
      app.title?.toLowerCase().includes(q) ||
      app.applicantName?.toLowerCase().includes(q) ||
      app.seekerName?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <PageError message="Failed to load applications. Please try again." onRetry={fetchApplications} />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <FileText className="w-8 h-8 text-tdop-primary" />
          {t('application.title')}
        </h1>
        <p className="text-gray-500 mt-1">Applications received for your opportunities</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by applicant or opportunity..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
        />
      </div>

      <DashboardSection
        title="Applications"
        icon={<FileText className="w-4 h-4" />}
        empty={filtered.length === 0}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8 text-gray-300" />}
            title={searchQuery ? "No matching applications" : "No applications yet"}
            description={searchQuery
              ? "Try a different search term."
              : "Applications to your opportunities will appear here."}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(app => (
              <div key={app.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-tdop-navy truncate">
                      {app.opportunityTitle || app.title || 'Application'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {app.applicantName || app.seekerName || 'Applicant'}
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
                  <Link
                    to={`/applications/${app.id}`}
                    className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-tdop-primary hover:text-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
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
