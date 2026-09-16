import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useApplications } from '@/hooks/useApplications';
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
  ArrowRight, UsersRound, Building2, Shield, Settings,
} from 'lucide-react';

const statusBadge: Record<string, string> = {
  published: 'success',
  draft: 'gray',
  pending: 'warning',
  archived: 'gray',
  active: 'success',
  closed: 'danger',
  submitted: 'info',
};

const OrganizationDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { opportunities, total, isLoading: oppLoading } = useOpportunities();
  const { applications, total: totalApplicants, isLoading: appLoading } = useApplications();

  if (oppLoading || appLoading) return <PageLoading text="Loading dashboard..." />;

  const totalViews = opportunities.reduce((acc: number, o: any) => acc + (o.views || 0), 0);

  const recentOpportunities = opportunities
    .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const recentApplications = applications.slice(0, 5);

  const stats = [
    { label: 'Total posted', value: total, icon: Briefcase, color: 'bg-tdop-primary/10 text-tdop-primary', trend: 'up' as const, to: '/my-jobs' },
    { label: 'Total views', value: totalViews, icon: Eye, color: 'bg-emerald-50 text-tdop-secondary', trend: totalViews > 0 ? ('up' as const) : ('neutral' as const) },
    { label: 'Applicants', value: totalApplicants, icon: Users, color: 'bg-purple-50 text-purple-600', trend: totalApplicants > 0 ? ('up' as const) : ('neutral' as const), to: '/organization/applications' },
    { label: 'Applications', value: applications.length, icon: FileText, color: 'bg-amber-50 text-amber-600', trend: 'neutral' as const, to: '/organization/applications' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      {/* Welcome Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-tdop-primary to-blue-700 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">
              {user?.firstName || 'Organization'}'s Dashboard
            </h1>
            <p className="text-white/70 mt-1">Manage your opportunities and track applicants.</p>
          </div>
          <Link
            to="/create-opportunity"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-tdop-primary font-semibold text-sm hover:bg-white/90 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            New opportunity
          </Link>
        </div>
      </div>

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
          title="Your opportunities"
          icon={<Briefcase className="w-4 h-4" />}
          action={{ label: 'See all', to: '/my-jobs' }}
          empty={recentOpportunities.length === 0}
        >
          {recentOpportunities.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="w-8 h-8 text-gray-300" />}
              title="No opportunities yet"
              description="Create your first opportunity to start receiving applications."
              action={{ label: 'Create opportunity', to: '/create-opportunity' }}
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
                        {opp.views || 0} views · {formatDate(opp.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusBadge[opp.status] || 'gray'} size="sm">{opp.status}</Badge>
                </Link>
              ))}
            </div>
          )}
        </DashboardSection>

        {/* Recent Applications */}
        <DashboardSection
          title="Recent applications"
          icon={<FileText className="w-4 h-4" />}
          action={{ label: 'See all', to: '/organization/applications' }}
          empty={recentApplications.length === 0}
        >
          {recentApplications.length === 0 ? (
            <EmptyState
              icon={<Users className="w-8 h-8 text-gray-300" />}
              title="No applications yet"
              description="Applications from seekers will appear here."
            />
          ) : (
            <div className="space-y-1 p-4">
              {recentApplications.map((app: any) => (
                <ActivityItem
                  key={app.id}
                  icon={<FileText className="w-4 h-4" />}
                  iconColor={statusBadge[app.status] === 'success'
                    ? 'bg-emerald-50 text-emerald-600'
                    : statusBadge[app.status] === 'warning'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-gray-100 text-gray-500'}
                  title={app.opportunityTitle || app.title || 'Application'}
                  subtitle={app.applicantName || app.seekerName || ''}
                  time={app.createdAt ? formatDate(app.createdAt) : ''}
                />
              ))}
            </div>
          )}
        </DashboardSection>
      </div>

      {/* Quick Actions */}
      <DashboardSection title="Quick actions" icon={<Settings className="w-4 h-4 text-gray-400" />}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
          <QuickAction
            label="Create opportunity"
            icon={<Plus className="w-5 h-5" />}
            to="/create-opportunity"
            color="bg-tdop-primary/10 text-tdop-primary"
          />
          <QuickAction
            label="Team management"
            icon={<UsersRound className="w-5 h-5" />}
            to="/organization/team"
            color="bg-purple-50 text-purple-600"
          />
          <QuickAction
            label="Verification"
            icon={<CheckCircle className="w-5 h-5" />}
            to="/organization/verification"
            color="bg-emerald-50 text-tdop-secondary"
          />
          <QuickAction
            label="Organization profile"
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
