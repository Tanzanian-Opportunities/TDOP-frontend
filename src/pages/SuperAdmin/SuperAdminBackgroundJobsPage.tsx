import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Clock, Info } from 'lucide-react';

const SuperAdminBackgroundJobsPage: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    superAdminApi.getBackgroundJobs()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (error || !data) return <PageError />;

  const jobs = data.jobs || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <Clock className="w-7 h-7 text-tdop-primary" />
          Background Jobs
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('superAdminDetail.scheduledTasks')}</p>
      </div>
      <Card className="p-4 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">{data.note}</p>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-sm text-gray-500">{t('superAdminDetail.totalJobs')}</p>
          <p className="text-2xl font-bold text-tdop-navy mt-2">{data.totalJobs}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">{t('superAdminDetail.activeJobs')}</p>
          <p className="text-2xl font-bold text-tdop-secondary mt-2">{data.activeJobs}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">{t('superAdminDetail.failedJobs')}</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{data.failedJobs}</p>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="text-sm font-semibold text-tdop-navy">{t('superAdminDetail.scheduledJobs')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.jobName')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.schedule')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.status')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.description')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jobs.map((job: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><span className="text-sm font-medium text-tdop-navy font-mono">{job.name}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{job.schedule}</td>
                  <td className="px-4 py-3">
                    <Badge variant={job.status === 'ACTIVE' || job.status === 'SCHEDULED' ? 'secondary' : 'danger'}>
                      {job.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-xs">{job.description}</td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">{t('superAdminDetail.noBackgroundJobs')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminBackgroundJobsPage;
