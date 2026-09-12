import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useApplications } from '@/hooks/useApplications';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';
import {
  Briefcase, Users, FileText, TrendingUp, Plus, ArrowRight,
  Eye, Calendar, DollarSign
} from 'lucide-react';

const OrganizationDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { opportunities, total } = useOpportunities();
  const { applications, total: totalApplicants } = useApplications();
  const { t } = useTranslation();

  const myOpps = opportunities;
  const stats = [
    { label: t('dashboard.stats.totalPosted'), value: total, icon: Briefcase, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: t('dashboard.stats.totalViews'), value: myOpps.reduce((acc: number, o: any) => acc + o.views, 0), icon: Eye, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
    { label: t('dashboard.stats.totalApplicants'), value: totalApplicants, icon: Users, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: 'Total Applications', value: applications.length, icon: FileText, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.welcome', { name: user?.firstName || 'Organization' })}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('organization.overview')}</p>
        </div>
        <Button asChild>
          <a href="/create-opportunity">
            <Plus className="w-4 h-4 mr-2" />
            {t('nav.create')}
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding={false}>
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('organization.postOpportunity')}</h2>
            <Button variant="outline" size="sm" asChild>
              <a href="/create-opportunity">{t('common.seeMore')}</a>
            </Button>
          </div>
          <div className="p-6">
            {myOpps.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('organization.noOpportunities')}</p>
            ) : (
              <div className="space-y-3">
                {myOpps.slice(0, 5).map(opp => (
                  <div key={opp.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{opp.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(opp.publishedAt)}</p>
                    </div>
                    <Badge variant={opp.status}>{opp.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card padding={false}>
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('organization.viewApplicants')}</h2>
            <Button variant="outline" size="sm" asChild>
              <a href="/applications">{t('common.seeMore')}</a>
            </Button>
          </div>
          <div className="p-6">
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              {t('organization.applicantsCount', { count: totalApplicants })}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationDashboardPage;
