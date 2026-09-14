import React from 'react';
import { Link } from 'react-router-dom';
import { useApplications } from '@/hooks/useApplications';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { formatApplicationStatus } from '@/utils/formatRole';
import { FileText, Clock, ArrowRight } from 'lucide-react';

const MyApplicationsPage: React.FC = () => {
  const { applications, isLoading, withdraw } = useApplications();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tdop-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <FileText className="w-8 h-8 text-tdop-primary" />
          {t('application.title')}
        </h1>
        <p className="text-gray-500 mt-2">
          {applications.length} {t('application.status')}
        </p>
      </div>

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
      ) : (
        <div className="space-y-4">
          {applications.map(application => (
            <Card key={application.id} padding={false}>
              <div className="p-6">
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
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/applications/${application.id}`} className="inline-flex items-center gap-1">
                        {t('application.timeline', 'Timeline')} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/opportunities/${application.opportunityId}`}>{t('application.viewDetails')}</a>
                    </Button>
                    {application.status !== 'withdrawn' && application.status !== 'rejected' && (
                      <Button variant="ghost" size="sm" onClick={() => withdraw(application.id)}>
                        {t('application.withdraw')}
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
