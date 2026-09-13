import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/services/api/adminApi';
import { formatDate } from '@/utils/formatDate';
import {
  Users, Briefcase, FileText, TrendingUp,
  Calendar, Shield, BarChart3, Activity
} from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = React.useState({
    totalUsers: 1250,
    activeUsers: 980,
    totalOpportunities: 340,
    verifiedOpportunities: 280,
    pendingVerification: 60,
    totalApplications: 2100,
    totalReports: 15,
    pendingReports: 3,
  });

  const adminStats = [
    { label: t('admin.totalUsers'), value: stats.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: t('admin.activeUsers'), value: stats.activeUsers, icon: Activity, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
    { label: t('admin.totalOpportunities'), value: stats.totalOpportunities, icon: Briefcase, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: t('admin.verifiedOpportunities'), value: stats.verifiedOpportunities, icon: Shield, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { label: t('admin.pendingVerification'), value: stats.pendingVerification, icon: Calendar, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: t('admin.totalApplications'), value: stats.totalApplications, icon: FileText, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
    { label: t('admin.totalReports'), value: stats.totalReports, icon: FileText, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
    { label: t('admin.pendingReports'), value: stats.pendingReports, icon: AlertCircle, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  ];

  const recentActivity = [
    { action: 'New user registered', user: 'john@example.com', time: '2 min ago', type: 'info' },
    { action: 'Opportunity verified', user: 'Software Engineer at Tech Corp', time: '15 min ago', type: 'success' },
    { action: 'Report filed', user: 'Spam opportunity', time: '1 hour ago', type: 'warning' },
    { action: 'User deactivated', user: 'inactive_user', time: '2 hours ago', type: 'error' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy">{t('admin.title')}</h1>
        <p className="text-gray-500 mt-1">{t('admin.overview')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-tdop-navy">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-tdop-navy">{t('admin.recentActivity')}</h2>
          </div>
          <div className="p-6 space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-tdop-navy">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.user}</p>
                </div>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={false}>
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-tdop-navy">{t('admin.topOpportunities')}</h2>
          </div>
          <div className="p-6 space-y-3">
            {['Senior Developer', 'UX Designer', 'Data Scientist'].map((title, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-tdop-primary/10 text-tdop-primary rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-tdop-navy">{title}</p>
                    <p className="text-xs text-gray-500">{Math.floor(Math.random() * 100 + 10)} applicants</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const AlertCircle = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default AdminDashboardPage;
