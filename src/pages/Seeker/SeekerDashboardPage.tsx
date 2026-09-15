import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useApplications } from '@/hooks/useApplications';
import { useNotifications } from '@/hooks/useNotifications';
import { useDocuments } from '@/hooks/useDocuments';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api/axiosInstance';
import Sidebar from '@/components/layout/Sidebar';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { QuickAction } from '@/components/dashboard/QuickAction';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
  Briefcase, Bookmark, FileText, Sparkles, MapPin, Calendar,
  ArrowRight, GraduationCap, BookOpen, Shield, CheckCircle2, Circle,
  Clock, AlertTriangle, Bell, TrendingUp, Zap, ChevronRight,
  Target, Award, Upload, Eye, ChevronRight as ChevronRightIcon,
} from 'lucide-react';

const SeekerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { opportunities, isLoading: oppLoading } = useOpportunities();
  const { applications } = useApplications();
  const { notifications, unreadCount } = useNotifications();
  const { documents } = useDocuments();

  const { data: savedData } = useQuery({
    queryKey: ['saved-count'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/saved');
      return data?.data || [];
    },
    refetchOnWindowFocus: false,
  });

  const { data: profileCompletion } = useQuery({
    queryKey: ['profile-completion'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/profile/completion');
      return data?.completion || 0;
    },
    refetchOnWindowFocus: false,
  });

  const { data: careerGoals } = useQuery({
    queryKey: ['career-goals'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/profile/career-goals');
      return data?.data || null;
    },
    refetchOnWindowFocus: false,
  });

  const { data: skills } = useQuery({
    queryKey: ['profile-skills'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/profile/skills');
      return data?.data || [];
    },
    refetchOnWindowFocus: false,
  });

  const completion = typeof profileCompletion === 'number' ? profileCompletion : 0;
  const savedCount = Array.isArray(savedData) ? savedData.length : 0;

  const completionSteps = [
    { key: 'Personal info', done: !!(user?.firstName && user?.lastName), to: '/profile' },
    { key: 'Education', done: completion >= 33, to: '/profile' },
    { key: 'Skills', done: completion >= 50, to: '/profile' },
    { key: 'Experience', done: completion >= 67, to: '/profile' },
    { key: 'CV uploaded', done: completion >= 80, to: '/documents' },
  ];

  const upcomingDeadlines = opportunities
    .filter(opp => {
      if (!opp.applicationDeadline) return false;
      const d = new Date(opp.applicationDeadline);
      const now = new Date();
      return d > now && (d.getTime() - now.getTime()) <= 30 * 24 * 60 * 60 * 1000;
    })
    .sort((a, b) => new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime())
    .slice(0, 5);

  const recommendations = opportunities.slice(0, 3);

  const activeApplications = applications.filter((app: any) =>
    ['pending', 'under_review', 'shortlisted'].includes(app.status)
  ).slice(0, 5);

  const quickLinks = [
    { label: 'Scholarships', search: 'scholarships', icon: GraduationCap, color: 'bg-emerald-50 text-tdop-secondary' },
    { label: 'Training', search: 'training', icon: BookOpen, color: 'bg-purple-50 text-purple-600' },
    { label: 'Government', search: 'government', icon: Shield, color: 'bg-teal-50 text-teal-600' },
    { label: 'Jobs', search: 'jobs', icon: Briefcase, color: 'bg-blue-50 text-tdop-primary' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8 items-start">
        <Sidebar />

        <main className="flex-1 min-w-0 space-y-6">
          {/* Welcome Hero */}
          <div className="rounded-3xl bg-gradient-to-r from-tdop-primary to-blue-700 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <h1 className="font-display text-3xl font-extrabold">
                Hello, {user?.firstName || 'there'}!
              </h1>
              <p className="mt-1 text-white/70 max-w-lg">
                {completion < 80
                  ? 'Complete your profile to unlock better recommendations.'
                  : 'Your profile is ready. Find your next opportunity.'}
              </p>
              <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                  <TrendingUp className="w-4 h-4 text-tdop-accent" />
                  <span className="text-sm font-medium">{applications.length} applications</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                  <Bookmark className="w-4 h-4 text-tdop-accent" />
                  <span className="text-sm font-medium">{savedCount} saved</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                  <Bell className="w-4 h-4 text-tdop-accent" />
                  <span className="text-sm font-medium">{unreadCount} unread</span>
                </div>
              </div>
            </div>
            {completion < 80 && (
              <div className="relative mt-6">
                <div className="flex items-center justify-between text-sm font-semibold mb-2">
                  <span className="text-white/80">Profile completion</span>
                  <span className="text-tdop-accent">{completion}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-tdop-accent transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              value={opportunities.length}
              label="Available opportunities"
              icon={<Briefcase className="w-5 h-5" />}
              color="bg-tdop-primary/10 text-tdop-primary"
              trend="up"
              to="/browse"
            />
            <StatCard
              value={savedCount}
              label="Saved opportunities"
              icon={<Bookmark className="w-5 h-5" />}
              color="bg-emerald-50 text-tdop-secondary"
              trend={savedCount > 0 ? 'up' : 'neutral'}
              to="/saved"
            />
            <StatCard
              value={applications.length}
              label="My applications"
              icon={<FileText className="w-5 h-5" />}
              color="bg-amber-50 text-amber-600"
              trend="neutral"
              to="/applications"
            />
            <StatCard
              value={unreadCount}
              label="Unread notifications"
              icon={<Bell className="w-5 h-5" />}
              color="bg-purple-50 text-purple-600"
              trend={unreadCount > 0 ? 'up' : 'neutral'}
              to="/notifications"
            />
          </div>

          {/* Pending Actions + Upcoming Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Actions */}
            {completion < 100 && (
              <DashboardSection title="Complete your profile" icon={<Zap className="w-4 h-4" />}>
                <div className="space-y-2 p-4">
                  {completionSteps.map(step => (
                    <Link
                      key={step.key}
                      to={step.to}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                        step.done
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-50 text-gray-600 hover:bg-tdop-primary/5 hover:text-tdop-primary'
                      }`}
                    >
                      {step.done
                        ? <CheckCircle2 className="w-4 h-4 shrink-0 text-tdop-secondary"/>
                        : <Circle className="w-4 h-4 shrink-0 text-gray-400"/>}
                      {step.key}
                    </Link>
                  ))}
                </div>
              </DashboardSection>
            )}

            {/* Upcoming Deadlines */}
            <DashboardSection
              title="Upcoming deadlines"
              icon={<Clock className="w-4 h-4 text-tdop-accent" />}
              action={upcomingDeadlines.length > 0 ? { label: 'Browse all', to: '/browse' } : undefined}
              empty={upcomingDeadlines.length === 0}
            >
              {upcomingDeadlines.length === 0 ? (
                <EmptyState
                  icon={<Calendar className="w-8 h-8 text-gray-300" />}
                  title="No upcoming deadlines"
                  description="Browse opportunities to find one with a deadline."
                />
              ) : (
                <div className="space-y-2 p-4">
                  {upcomingDeadlines.map(opp => {
                    const daysLeft = Math.ceil(
                      (new Date(opp.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );
                    const isUrgent = daysLeft <= 3;
                    return (
                      <Link
                        key={opp.id}
                        to={`/opportunities/${opp.id}`}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:shadow-soft ${
                          isUrgent
                            ? 'border-amber-200 bg-amber-50/50'
                            : 'border-gray-100 bg-white hover:border-tdop-primary/20'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isUrgent ? 'bg-amber-100 text-amber-600' : 'bg-tdop-primary/10 text-tdop-primary'
                          }`}>
                            {isUrgent ? <AlertTriangle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-sm text-tdop-navy truncate">{opp.title}</h4>
                            <p className="text-xs text-gray-500">{opp.type} · {opp.location}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className={`text-sm font-bold ${isUrgent ? 'text-amber-600' : 'text-tdop-primary'}`}>
                            {daysLeft}d
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </DashboardSection>
          </div>

          {/* Skills & Career Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardSection title="My skills" icon={<Target className="w-4 h-4 text-purple-500" />} action={{ label: 'Edit', to: '/profile' }}>
              {skills.length === 0 ? (
                <EmptyState
                  icon={<Award className="w-8 h-8 text-gray-300" />}
                  title="No skills added"
                  description="Add skills to get better recommendations."
                />
              ) : (
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {skills.slice(0, 8).map((skill: any, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-tdop-primary/10 text-tdop-primary text-xs font-medium rounded-full">
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))}
                    {skills.length > 8 && (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                        +{skills.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </DashboardSection>

            <DashboardSection title="Career goals" icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} action={{ label: 'Edit', to: '/profile' }}>
              {!careerGoals ? (
                <EmptyState
                  icon={<Target className="w-8 h-8 text-gray-300" />}
                  title="No career goals set"
                  description="Set goals to get matched with relevant opportunities."
                />
              ) : (
                <div className="p-4 space-y-2">
                  {careerGoals.desiredRoles && (
                    <div className="flex items-start gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-gray-600">{careerGoals.desiredRoles}</span>
                    </div>
                  )}
                  {careerGoals.desiredLocations && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-gray-600">{careerGoals.desiredLocations}</span>
                    </div>
                  )}
                  {careerGoals.industries && (
                    <div className="flex items-start gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-gray-600">{careerGoals.industries}</span>
                    </div>
                  )}
                </div>
              )}
            </DashboardSection>
          </div>

          {/* Documents & Saved Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardSection title="My documents" icon={<FileText className="w-4 h-4 text-tdop-primary" />} action={{ label: 'Manage', to: '/documents' }}>
              {documents.length === 0 ? (
                <EmptyState
                  icon={<Upload className="w-8 h-8 text-gray-300" />}
                  title="No documents uploaded"
                  description="Upload your CV and certificates to apply faster."
                />
              ) : (
                <div className="space-y-2 p-4">
                  {documents.slice(0, 3).map((doc: any) => (
                    <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50">
                      <div className="w-9 h-9 rounded-xl bg-tdop-primary/10 text-tdop-primary flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-tdop-navy truncate">{doc.name || doc.fileName}</p>
                        <p className="text-xs text-gray-400">{doc.fileType || 'Document'}</p>
                      </div>
                    </div>
                  ))}
                  {documents.length > 3 && (
                    <Link to="/documents" className="text-xs text-tdop-primary hover:underline font-medium flex items-center gap-1">
                      View all {documents.length} documents <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              )}
            </DashboardSection>

            <DashboardSection title="Saved opportunities" icon={<Bookmark className="w-4 h-4 text-amber-500" />} action={{ label: 'View all', to: '/saved' }} empty={savedCount === 0}>
              {savedCount === 0 ? (
                <EmptyState
                  icon={<Bookmark className="w-8 h-8 text-gray-300" />}
                  title="No saved opportunities"
                  description="Save opportunities you're interested in."
                />
              ) : (
                <div className="space-y-2 p-4">
                  {Array.isArray(savedData) && savedData.slice(0, 3).map((opp: any) => (
                    <Link
                      key={opp.id}
                      to={`/opportunities/${opp.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-tdop-secondary flex items-center justify-center shrink-0">
                        <Bookmark className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-tdop-navy truncate">{opp.title}</p>
                        <p className="text-xs text-gray-400">{opp.company}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </DashboardSection>
          </div>

          {/* Active Applications */}
          <DashboardSection
            title="Active applications"
            icon={<FileText className="w-4 h-4 text-amber-500" />}
            action={activeApplications.length > 0 ? { label: 'View all', to: '/applications' } : undefined}
            empty={activeApplications.length === 0}
          >
            {activeApplications.length === 0 ? (
              <EmptyState
                icon={<FileText className="w-8 h-8 text-gray-300" />}
                title="No active applications"
                description="Apply to opportunities to track your progress here."
              />
            ) : (
              <div className="space-y-2 p-4">
                {activeApplications.map((app: any) => (
                  <Link
                    key={app.id}
                    to={`/applications/${app.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-tdop-primary/20 hover:shadow-soft transition-all"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      app.status === 'shortlisted' ? 'bg-emerald-50 text-tdop-secondary'
                      : app.status === 'under_review' ? 'bg-amber-50 text-amber-600'
                      : 'bg-tdop-primary/10 text-tdop-primary'
                    }`}>
                      <Eye className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-tdop-navy truncate">{app.opportunityTitle || `Application #${app.id}`}</p>
                      <p className="text-xs text-gray-400 capitalize">{app.status?.replace(/_/g, ' ')}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </DashboardSection>

          {/* Recommendations */}
          <DashboardSection
            title="Recommended for you"
            icon={<Sparkles className="w-4 h-4 text-purple-500" />}
            action={{ label: 'See all', to: '/recommendations' }}
            empty={recommendations.length === 0 && !oppLoading}
          >
            {oppLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-tdop-light border border-gray-100 animate-pulse">
                    <div className="p-4 space-y-3">
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendations.length === 0 ? (
              <EmptyState
                icon={<Briefcase className="w-8 h-8 text-gray-300" />}
                title="No opportunities yet"
                description="Check back soon for new opportunities."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                {recommendations.map(opp => (
                  <Link
                    key={opp.id}
                    to={`/opportunities/${opp.id}`}
                    className="group rounded-2xl border border-gray-100 bg-tdop-light hover:shadow-card hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col"
                  >
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="text-xs font-semibold text-tdop-secondary uppercase tracking-wide">{opp.type}</span>
                      <h3 className="mt-1 font-semibold text-tdop-navy line-clamp-2 text-sm">{opp.title}</h3>
                      <div className="mt-2 space-y-1 text-xs text-gray-500 flex-1">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />{opp.location}
                        </p>
                        {opp.applicationDeadline && (
                          <p className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {new Date(opp.applicationDeadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-tdop-primary group-hover:gap-1.5 transition-all">
                        View details <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </DashboardSection>

          {/* Quick Actions + Recent Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <DashboardSection title="Quick actions" icon={<Zap className="w-4 h-4 text-tdop-accent" />}>
              <div className="grid grid-cols-2 gap-3 p-4">
                {quickLinks.map(link => {
                  const Icon = link.icon;
                  return (
                    <QuickAction
                      key={link.label}
                      label={link.label}
                      icon={<Icon className="w-5 h-5" />}
                      to={`/browse?search=${link.search}`}
                      color={link.color}
                    />
                  );
                })}
              </div>
            </DashboardSection>

            {/* Recent Notifications */}
            <DashboardSection
              title="Recent notifications"
              icon={<Bell className="w-4 h-4" />}
              action={{ label: 'View all', to: '/notifications' }}
              empty={notifications.length === 0}
            >
              {notifications.length === 0 ? (
                <EmptyState
                  icon={<Bell className="w-8 h-8 text-gray-300" />}
                  title="No notifications yet"
                  description="You'll see updates about your applications here."
                />
              ) : (
                <div className="space-y-1 p-4">
                  {notifications.slice(0, 5).map((n: any) => (
                    <ActivityItem
                      key={n.id}
                      icon={<Bell className="w-4 h-4" />}
                      iconColor={n.read ? 'bg-gray-100 text-gray-400' : 'bg-tdop-primary/10 text-tdop-primary'}
                      title={n.title || n.message}
                      subtitle={n.message}
                      time={n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
                      to="/notifications"
                    />
                  ))}
                </div>
              )}
            </DashboardSection>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SeekerDashboardPage;
