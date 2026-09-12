import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { formatApplicationStatus } from '@/utils/formatRole';
import { FileText } from 'lucide-react';

const MyApplicationsPage: React.FC = () => {
  const { t } = useTranslation();

  const mockApplications = [
    { id: '1', opportunityTitle: 'Frontend Developer', company: 'Tech Corp', status: 'shortlisted' as const, createdAt: '2024-01-15' },
    { id: '2', opportunityTitle: 'UX Designer', company: 'Design Studio', status: 'pending' as const, createdAt: '2024-01-10' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-8 h-8 text-tdop-primary" />
          {t('application.title')}
        </h1>
      </div>

      {mockApplications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('application.noApplications')}</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockApplications.map(app => (
            <Card key={app.id} padding={false}>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{app.opportunityTitle}</h3>
                    <p className="text-sm text-gray-500">{app.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={app.status}>{formatApplicationStatus(app.status)}</Badge>
                      <span className="text-xs text-gray-400">{formatDate(app.createdAt)}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">{t('application.viewDetails')}</Button>
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
