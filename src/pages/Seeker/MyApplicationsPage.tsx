import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApplications } from '@/hooks/useApplications';
import { PageError } from '@/components/ui/PageStates';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { formatApplicationStatus } from '@/utils/formatRole';
import { FileText, Clock, ArrowRight, Filter, Search } from 'lucide-react';

type StatusFilter = 'all' | 'pending' | 'under_review' | 'shortlisted' | 'interview' | 'accepted' | 'rejected' | 'withdrawn';

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const MyApplicationsPage: React.FC = () => {
  const { applications, isLoading, isError, withdraw, refetch } = useApplications();
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return applications.filter(app => {
      const matchesStatus = statusFilter === 'all' || app.status?.toLowerCase() === statusFilter;
      const matchesSearch = !searchQuery || 
        app.opportunityTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [applications, statusFilter, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: applications.length };
    applications.forEach(app => {
      const s = app.status?.toLowerCase() || 'pending';
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [applications]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tdop-primary" />
      </div>
    );
  }

  if (isError) return <PageError message="Failed to load applications. Please try again." onRetry={refetch} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <FileText className="w-8 h-8 text-tdop-primary" />
          {t('application.title')}
        </h1>
        <p className="text-gray-500 mt-2">
          {filtered.length} application{filtered.length !== 1 ? 's' : ''}
          {statusFilter !== 'all' && ` (${formatApplicationStatus(statusFilter)})`}
        </p>
      </div>

      {applications.length > 0 && (
        <div className="space-y-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            {statusFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  statusFilter === f.value
                    ? 'bg-tdop-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
                {statusCounts[f.value] !== undefined && f.value !== 'all' && (
                  <span className="ml-1 opacity-70">({statusCounts[f.value]})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-tdop-navy mb-2">{t('application.noApplications')}</h3>
            <p className="text-gray-500 mb-4">{t('application.startApplying')}</p>
            <Button asChild>
              <a href="/browse">{t('opportunities.browseTitle')}</a>
            </Button>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-tdop-navy mb-2">No matching applications</h3>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(application => (
            <Card key={application.id} padding={false}>
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-tdop-navy">{application.opportunityTitle}</h3>
                    <p className="text-sm text-gray-500">{application.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={application.status}>{formatApplicationStatus(application.status)}</Badge>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(application.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/applications/${application.id}`} className="inline-flex items-center gap-1">
                        Timeline <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/opportunities/${application.opportunityId}`}>Details</a>
                    </Button>
                    {application.status !== 'withdrawn' && application.status !== 'rejected' && (
                      <Button variant="ghost" size="sm" onClick={() => withdraw(application.id)}>
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
