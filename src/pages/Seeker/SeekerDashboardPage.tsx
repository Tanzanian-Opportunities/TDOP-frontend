import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useApplications } from '@/hooks/useApplications';
import { Card } from '@/components/ui/Card';
import Sidebar from '@/components/layout/Sidebar';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api/axiosInstance';
import {
  Briefcase, Bookmark, FileText, Sparkles, CheckCircle2, Circle,
  MapPin, Calendar, ArrowRight, GraduationCap, BookOpen, Shield, TrendingUp, TrendingDown,
  Zap
} from 'lucide-react';

const metricIcons = [Briefcase, Bookmark, FileText, Sparkles];
const metricBg = [
  'bg-tdop-pastel-jobs text-tdop-royalLight',
  'bg-tdop-pastel-scholarships text-green-600',
  'bg-tdop-pastel-internships text-amber-600',
  'bg-tdop-pastel-training text-rose-600',
];

const SeekerDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { opportunities, isLoading: oppLoading } = useOpportunities();
  const { applications } = useApplications();

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

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications-count'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/notifications');
      return data?.data || [];
    },
    refetchOnWindowFocus: false,
  });

  const completion = typeof profileCompletion === 'number' ? profileCompletion : 0;
  const savedCount = Array.isArray(savedData) ? savedData.length : 0;
  const unreadNotifications = Array.isArray(notificationsData)
    ? notificationsData.filter((n: any) => !n.read).length
    : 0;

  const completionSteps = [
    { key: 'completionStepPersonal', done: !!(user?.firstName && user?.lastName) },
    { key: 'completionStepEducation', done: completion >= 33 },
    { key: 'completionStepSkills', done: completion >= 50 },
    { key: 'completionStepExperience', done: completion >= 67 },
    { key: 'completionStepCv', done: completion >= 80 },
  ];

  const metrics = [
    { value: opportunities.length, label: t('dashboard.metricAvailable'), change: '+12', dir: 'up' as const },
    { value: savedCount, label: t('dashboard.metricSaved'), change: '+2', dir: savedCount > 0 ? ('up' as const) : ('down' as const) },
    { value: applications.length, label: t('dashboard.metricApplications'), change: '+5', dir: 'up' as const },
    { value: unreadNotifications, label: t('dashboard.metricNotifications') || 'Notifications', change: unreadNotifications > 0 ? `+${unreadNotifications}` : '0', dir: unreadNotifications > 0 ? ('up' as const) : ('down' as const) },
  ];

  const list = opportunities.slice(0, 6);

  const quickLinks = [
    { label: t('dashboard.quickLinkScholarships'), search: 'scholarships', icon: GraduationCap, color: 'bg-tdop-pastel-scholarships text-green-600' },
    { label: t('dashboard.quickLinkTraining'), search: 'training', icon: BookOpen, color: 'bg-tdop-pastel-training text-rose-600' },
    { label: t('dashboard.quickLinkGovernment'), search: 'government', icon: Shield, color: 'bg-tdop-pastel-tenders text-cyan-600' },
    { label: t('dashboard.quickLinkJobs'), search: 'jobs', icon: Briefcase, color: 'bg-tdop-pastel-jobs text-tdop-royalLight' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8 items-start">
        <Sidebar />

        <main className="flex-1 min-w-0 space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-tdop-navy via-tdop-royal to-tdop-royalLight p-8 text-white shadow-navy">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="font-display text-3xl font-extrabold">
                  {t('dashboard.greeting', { name: user?.firstName || 'User' })}
                </h1>
                <p className="mt-1 text-white/70 max-w-lg">{t('dashboard.greetingSubtitle')}</p>
              </div>
              <div className="w-40 shrink-0">
                <div className="flex items-center justify-between text-sm font-semibold mb-1">
                  <span className="text-white/80">{t('dashboard.profileCompletion')}</span>
                  <span className="text-tdop-gold">{completion}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-tdop-gold to-tdop-goldDark transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m, i) => {
              const Icon = metricIcons[i];
              return (
                <Card key={m.label} className="relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${metricBg[i]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xl font-bold text-gray-900">{m.value}</p>
                      <p className="text-xs text-gray-500 truncate">{m.label}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold">
                    {m.dir === 'up' && <TrendingUp className="w-3.5 h-3.5 text-green-500" />}
                    {m.dir === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                    {m.dir === 'up' ? <span className="text-green-600">{t('dashboard.weeklyUp', { value: m.change.slice(1) })}</span>
                      : <span className="text-red-500">{t('dashboard.weeklyDown', { value: m.change.slice(1) })}</span>}
                  </div>
                </Card>
              );
            })}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-gray-900">
                {t('dashboard.recommendationsTitle')}
              </h2>
              <Link to="/browse" className="inline-flex items-center gap-1 text-tdop-primary text-sm font-medium hover:gap-2 transition-all">
                {t('dashboard.viewAllRecommendations')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {oppLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <div className="skeleton h-36" />
                    <div className="p-4 space-y-2"><div className="skeleton h-4 w-32"/><div className="skeleton h-4 w-2/3"/></div>
                  </div>
                ))}
              </div>
            ) : list.length === 0 ? (
              <Card className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('opportunities.noOpportunities') || 'No opportunities available yet'}</h3>
                <p className="text-gray-500 mb-4">{t('dashboard.greetingSubtitle')}</p>
                <Link to="/browse" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-tdop-primary text-white text-sm font-medium">
                  {t('opportunities.browseTitle')} <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {list.map((opp) => (
                  <Link
                    key={opp.id}
                    to={`/opportunities/${opp.id}`}
                    className="group rounded-2xl border border-gray-100 hover:shadow-soft hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                  >
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="text-xs font-semibold text-tdop-cyan uppercase">{opp.type}</span>
                      <h3 className="mt-0.5 font-semibold text-tdop-royal line-clamp-2">{opp.title}</h3>
                      <div className="mt-2 space-y-1 text-xs text-gray-500 flex-1">
                        <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400"/>{opp.location}</p>
                        <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400"/>{t('opportunities.deadline')}: {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-tdop-primary group-hover:gap-2 transition-all">
                        {t('application.viewDetails')} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>

        <aside className="hidden xl:block w-80 shrink-0 space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-tdop-gold" />
              <h3 className="font-display font-semibold text-tdop-royal">{t('dashboard.completionChecklist')}</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">{t('dashboard.completionSubtitle')}</p>
            <div className="space-y-2.5">
              {completionSteps.map(step => (
                <div
                  key={step.key}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                    step.done ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {step.done ? <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500"/> : <Circle className="w-4 h-4 shrink-0 text-gray-400"/>}
                  {t(`dashboard.${step.key}`)}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-tdop-royal mb-3">{t('dashboard.quickLinksTitle')}</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {quickLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    to="/browse"
                    state={{ search: link.search }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-100 hover:border-tdop-primary/40 hover:shadow-soft text-sm text-gray-700 transition-all"
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${link.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default SeekerDashboardPage;