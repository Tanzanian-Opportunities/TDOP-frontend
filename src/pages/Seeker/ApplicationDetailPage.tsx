import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api/axiosInstance';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { formatApplicationStatus } from '@/utils/formatRole';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, CheckCircle2, Circle, FileText, Building2, MapPin, Calendar } from 'lucide-react';

const statusColors: Record<string, string> = {
  APPLIED: 'bg-tdop-primary/10 text-tdop-primary',
  UNDER_REVIEW: 'bg-blue-50 text-blue-600',
  SHORTLISTED: 'bg-amber-50 text-amber-600',
  INTERVIEW: 'bg-purple-50 text-purple-600',
  ACCEPTED: 'bg-emerald-50 text-emerald-600',
  REJECTED: 'bg-red-50 text-red-600',
  WITHDRAWN: 'bg-gray-100 text-gray-600',
};

const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { data: appData, isLoading } = useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/applications/${id}`);
      return data?.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tdop-primary" />
      </div>
    );
  }

  if (!appData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-tdop-navy mb-2">{t('application.notFound', 'Application not found')}</h3>
          <Link to="/applications">
            <Button variant="outline" className="mt-4">{t('application.backToList', 'Back to Applications')}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const history = appData.statusHistory || [];
  const sortedHistory = [...history].sort((a: any, b: any) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <Link to="/applications" className="inline-flex items-center gap-1.5 text-tdop-primary text-sm font-medium hover:gap-2.5 transition-all">
        <ArrowLeft className="w-4 h-4" />
        {t('application.backToList', 'Back to Applications')}
      </Link>

      <div className="rounded-3xl bg-tdop-primary p-8 text-white shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold">{appData.opportunityTitle || 'Application'}</h1>
            <p className="text-white/70 mt-1">{appData.company || ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={appData.status}>{formatApplicationStatus(appData.status)}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <h3 className="font-semibold text-tdop-navy mb-3">{t('application.details', 'Application Details')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span>{appData.company || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{t('application.applied', 'Applied')}: {formatDate(appData.appliedAt || appData.createdAt)}</span>
              </div>
              {appData.shortlisted && (
                <div className="flex items-center gap-2 text-amber-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('application.shortlisted', 'Shortlisted')}</span>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <Button variant="outline" className="w-full" asChild>
              <a href={`/opportunities/${appData.opportunityId}`}>{t('application.viewOpportunity', 'View Opportunity')}</a>
            </Button>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <h3 className="font-semibold text-tdop-navy mb-4">{t('application.timeline', 'Application Timeline')}</h3>
            {sortedHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">{t('application.noHistory', 'No status history available')}</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                <div className="space-y-6">
                  {sortedHistory.map((entry: any, idx: number) => {
                    const isFirst = idx === 0;
                    return (
                      <div key={entry.id} className="relative flex items-start gap-4">
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isFirst
                            ? 'bg-tdop-primary text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isFirst ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0 pb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {entry.oldStatus && (
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[entry.oldStatus] || 'bg-gray-100 text-gray-600'}`}>
                                {formatApplicationStatus(entry.oldStatus)}
                              </span>
                            )}
                            {entry.oldStatus && <span className="text-gray-400 text-xs">→</span>}
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[entry.newStatus] || 'bg-gray-100 text-gray-600'}`}>
                              {formatApplicationStatus(entry.newStatus)}
                            </span>
                          </div>
                          {entry.notes && (
                            <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(entry.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
