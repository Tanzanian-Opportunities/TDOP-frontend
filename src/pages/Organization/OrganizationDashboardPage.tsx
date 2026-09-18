import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { opportunityApi } from '@/services/api/opportunityApi';
import { applicationApi } from '@/services/api/applicationApi';
import { profileApi } from '@/services/api/profileApi';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { QuickAction } from '@/components/dashboard/QuickAction';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { PageLoading } from '@/components/ui/PageStates';
import { formatDate } from '@/utils/formatDate';
import {
  Briefcase, Users, FileText, Eye, Plus, CheckCircle, Clock,
  ArrowRight, UsersRound, Building2, Shield, Settings, AlertTriangle,
} from 'lucide-react';

const statusBadge: Record<string, string> = {
  PUBLISHED: 'success',
  DRAFT: 'gray',
  SUBMITTED: 'info',
  UNDER_REVIEW: 'info',
  VERIFIED: 'success',
  APPROVED: 'success',
  REJECTED: 'danger',
  SUSPENDED: 'warning',
  EXPIRED: 'gray',
  ARCHIVED: 'gray',
  CLOSING_SOON: 'warning',
};

const appStatusBadge: Record<string, string> = {
  APPLIED: 'info',
  UNDER_REVIEW: 'info',
  SHORTLISTED: 'success',
  INTERVIEW: 'accent',
  ACCEPTED: 'success',
  REJECTED: 'danger',
  WITHDRAWN: 'gray',
  PREPARING: 'gray',
};

const OrganizationDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      const [oppRes, appRes, profileRes] = await Promise.allSettled([
        opportunityApi.getMyOpportunities(),
        applicationApi.getApplications(),
        profileApi.getOrganizationProfile(),
      ]);
      if (oppRes.status === 'fulfilled') setOpportunities(oppRes.value.data || []);
      if (appRes.status === 'fulfilled') setApplications(appRes.value.applications || []);
      if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoading text={t('common.loading')} />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{t('common.errorLoading')}</p>
          <button onClick={fetchData} className="text-tdop-primary hover:underline text-sm font-medium">
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  const totalViews = opportunities.reduce((acc: number, o: any) => acc + (o.viewCount || 0), 0);
  const totalApps = applications.length;
  const pendingReview = applications.filter((a: any) => a.status === 'APPLIED' || a.status === 'UNDER_REVIEW').length;

  const recentOpportunities = opportunities
    .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const recentApplications = applications.slice(0, 5);

  const now = new Date();
  const expiringThisWeek = opportunities.filter((o: any) => {
    if (!o.deadline || o.status !== 'PUBLISHED') return false;
    const d = new Date(o.deadline);
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  const attentionItems: Array<{ icon: React.ReactNode; label: string; action: string; actionLabel: string; color: string }> = [];
  if (pendingReview > 0) {
    attentionItems.push({
      icon: <FileText className="w-4 h-4" />,
      label: t('orgDashboard.applicationsNeedReview', { count: pendingReview }),
      action: '/organization/applications',
      actionLabel: t('orgDashboard.reviewApplications'),
      color: 'bg-amber-50 text-amber-600',
    });
  }
  if (expiringThisWeek.length > 0) {
    attentionItems.push({
      icon: <Clock className="w-4 h-4" />,
      label: t('orgDashboard.opportunitiesExpiringSoon', { count: expiringThisWeek.length }),
      action: '/my-jobs',
      actionLabel: t('orgDashboard.viewOpportunities'),
      color: 'bg-red-50 text-red-600',
    });
  }
  if (profile && !profile.verified) {
    attentionItems.push({
      icon: <Shield className="w-4 h-4" />,
      label: t('orgDashboard.verificationNeedsAttention'),
      action: '/organization/verification',
      actionLabel: t('orgDashboard.completeVerification'),
      color: 'bg-blue-50 text-tdop-primary',
    });
  }

  const stats = [
    { label: t('orgDashboard.totalPosted'), value: opportunities.length, icon: Briefcase, color: 'bg-tdop-primary/10 text-tdop-primary', trend: 'up' as const, to: '/my-jobs' },
    { label: t('orgDashboard.totalViews'), value: totalViews, icon: Eye, color: 'bg-emerald-50 text-tdop-secondary', trend: totalViews > 0 ? ('up' as const) : ('neutral' as const) },
    { label: t('orgDashboard.applicants'), value: totalApps, icon: Users, color: 'bg-purple-50 text-purple-600', trend: totalApps > 0 ? ('up' as const) : ('neutral' as const), to: '/organization/applications' },
    { label: t('orgDashboard.pendingReview'), value: pendingReview, icon: Clock, color: 'bg-amber-50 text-amber-600', trend: 'neutral' as const, to: '/organization/applications' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      {/* Welcome Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-tdop-primary to-blue-700 p-5 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">
              {t('orgDashboard.welcome', { name: user?.firstName || t('orgDashboard.organization') })}
            </h1>
            <p className="text-white/70 mt-1">{t('orgDashboard.subtitle')}</p>
          </div>
          <Link
            to="/create-opportunity"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-tdop-primary font-semibold text-sm hover:bg-white/90 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            {t('orgDashboard.newOpportunity')}
          </Link>
        </div>
      </div>

      {/* Attention Items */}
      {attentionItems.length > 0 && (
        <div className="space-y-2">
          {attentionItems.map((item, i) => (
            <Link
              key={i}
              to={item.action}
              className={`flex items-center justify-between p-3 rounded-xl ${item.color.split(' ')[0]} hover:opacity-80 transition-opacity`}
            >
              <div className="flex items-center gap-3">
                <div className={`${item.color}`}>{item.icon}</div>
                <span className={`text-sm font-medium ${item.color.split(' ')[1]}`}>{item.label}</span>
              </div>
              <span className={`text-xs font-medium ${item.color.split(' ')[1]} underline`}>{item.actionLabel}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={<Icon className="w-5 h-5" />}
              color={stat.color}
              trend={stat.trend}
              to={stat.to}
            />
          );
        })}
      </div>

      {/* Recent Opportunities + Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Opportunities */}
        <DashboardSection
          title={t('orgDashboard.yourOpportunities')}
          icon={<Briefcase className="w-4 h-4" />}
          action={{ label: t('common.seeAll'), to: '/my-jobs' }}
          empty={recentOpportunities.length === 0}
        >
          {recentOpportunities.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="w-8 h-8 text-gray-300" />}
              title={t('orgDashboard.noOpportunities')}
              description={t('orgDashboard.noOpportunitiesDesc')}
              action={{ label: t('orgDashboard.createOpportunity'), to: '/create-opportunity' }}
            />
          ) : (
            <div className="space-y-1 p-4">
              {recentOpportunities.map((opp: any) => (
                <Link
                  key={opp.id}
                  to={`/edit-opportunity/${opp.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-tdop-primary/10 text-tdop-primary flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-tdop-navy truncate">{opp.title}</h4>
                      <p className="text-xs text-gray-500">
                        {opp.viewCount || 0} {t('orgDashboard.views')} · {formatDate(opp.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={(statusBadge[opp.status] || 'gray') as any} size="sm">{opp.status}</Badge>
                </Link>
              ))}
            </div>
          )}
        </DashboardSection>

        {/* Recent Applications */}
        <DashboardSection
          title={t('orgDashboard.recentApplications')}
          icon={<FileText className="w-4 h-4" />}
          action={{ label: t('common.seeAll'), to: '/organization/applications' }}
          empty={recentApplications.length === 0}
        >
          {recentApplications.length === 0 ? (
            <EmptyState
              icon={<Users className="w-8 h-8 text-gray-300" />}
              title={t('orgDashboard.noApplications')}
              description={t('orgDashboard.noApplicationsDesc')}
            />
          ) : (
            <div className="space-y-1 p-4">
              {recentApplications.map((app: any) => (
                <ActivityItem
                  key={app.id}
                  icon={<FileText className="w-4 h-4" />}
                  iconColor={appStatusBadge[app.status] === 'success'
                    ? 'bg-emerald-50 text-emerald-600'
                    : appStatusBadge[app.status] === 'info'
                    ? 'bg-blue-50 text-tdop-primary'
                    : 'bg-gray-100 text-gray-500'}
                  title={app.opportunityTitle || app.title || t('orgDashboard.application')}
                  subtitle={app.applicantName || app.seekerName || ''}
                  time={app.createdAt ? formatDate(app.createdAt) : ''}
                />
              ))}
            </div>
          )}
        </DashboardSection>
      </div>

      {/* Quick Actions */}
      <DashboardSection title={t('orgDashboard.quickActions')} icon={<Settings className="w-4 h-4 text-gray-400" />}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
          <QuickAction
            label={t('orgDashboard.createOpportunity')}
            icon={<Plus className="w-5 h-5" />}
            to="/create-opportunity"
            color="bg-tdop-primary/10 text-tdop-primary"
          />
          <QuickAction
            label={t('orgDashboard.teamManagement')}
            icon={<UsersRound className="w-5 h-5" />}
            to="/organization/team"
            color="bg-purple-50 text-purple-600"
          />
          <QuickAction
            label={t('orgDashboard.verification')}
            icon={<CheckCircle className="w-5 h-5" />}
            to="/organization/verification"
            color="bg-emerald-50 text-tdop-secondary"
          />
          <QuickAction
            label={t('orgDashboard.orgProfile')}
            icon={<Building2 className="w-5 h-5" />}
            to="/organization/profile"
            color="bg-amber-50 text-amber-600"
          />
        </div>
      </DashboardSection>
    </div>
  );
};

export default OrganizationDashboardPage;
