import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { adminApi } from '@/services/api/adminApi';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { QuickAction } from '@/components/dashboard/QuickAction';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
  Users, Briefcase, FileText, Shield, AlertTriangle,
  Building2, Eye, CheckCircle, XCircle, Clock, BarChart3,
  Flag, Wrench, UserCog, ArrowRight, TrendingUp, Zap,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalOpportunities: number;
  totalApplications: number;
  verifiedOrganizations: number;
  pendingVerifications: number;
  activeOpportunities: number;
  pendingModeration: number;
  totalOrganizations: number;
  pendingReports: number;
  totalReports: number;
  highRiskSignals: number;
  suspendedOpportunities: number;
}

const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(t('adminDashboard.failedToLoad'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-3xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-tdop-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('adminDashboard.retry')}
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const adminStats = [
    { label: t('adminDashboard.totalUsers'), value: stats?.totalUsers || 0, icon: Users, color: 'bg-tdop-primary/10 text-tdop-primary', trend: 'neutral' as const },
    { label: t('adminDashboard.organizations'), value: stats?.totalOrganizations || 0, icon: Building2, color: 'bg-purple-50 text-purple-600', trend: 'neutral' as const },
    { label: t('adminDashboard.verifiedOrgs'), value: stats?.verifiedOrganizations || 0, icon: CheckCircle, color: 'bg-emerald-50 text-tdop-secondary', trend: 'neutral' as const },
    { label: t('adminDashboard.activeOpportunities'), value: stats?.activeOpportunities || 0, icon: Briefcase, color: 'bg-blue-50 text-blue-600', trend: 'neutral' as const },
    { label: t('adminDashboard.totalApplications'), value: stats?.totalApplications || 0, icon: FileText, color: 'bg-amber-50 text-amber-600', trend: 'neutral' as const },
    { label: t('adminDashboard.pendingVerifications'), value: stats?.pendingVerifications || 0, icon: Clock, color: stats?.pendingVerifications ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-tdop-secondary', trend: stats?.pendingVerifications ? ('up' as const) : ('neutral' as const), to: '/admin/verification' },
    { label: t('adminDashboard.pendingModeration'), value: stats?.pendingModeration || 0, icon: Eye, color: stats?.pendingModeration ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-tdop-secondary', trend: stats?.pendingModeration ? ('up' as const) : ('neutral' as const), to: '/admin/moderation' },
    { label: t('adminDashboard.pendingReports'), value: stats?.pendingReports || 0, icon: Flag, color: stats?.pendingReports ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-tdop-secondary', trend: stats?.pendingReports ? ('up' as const) : ('neutral' as const), to: '/admin/reports' },
  ];

  const pendingItems = [
    { label: t('adminDashboard.pendingVerifications'), value: stats?.pendingVerifications || 0, icon: <Clock className="w-4 h-4" />, to: '/admin/verification', color: 'bg-amber-50 text-amber-600' },
    { label: t('adminDashboard.pendingModeration'), value: stats?.pendingModeration || 0, icon: <Eye className="w-4 h-4" />, to: '/admin/moderation', color: 'bg-amber-50 text-amber-600' },
    { label: t('adminDashboard.pendingReports'), value: stats?.pendingReports || 0, icon: <Flag className="w-4 h-4" />, to: '/admin/reports', color: 'bg-red-50 text-red-600' },
    { label: t('adminDashboard.highRiskSignals'), value: stats?.highRiskSignals || 0, icon: <AlertTriangle className="w-4 h-4" />, to: '/admin/reports', color: stats?.highRiskSignals ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-tdop-secondary' },
  ].filter(item => item.value > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      {/* Welcome Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-tdop-navy to-tdop-primary p-5 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-3xl font-bold font-display">{t('adminDashboard.title')}</h1>
          <p className="text-white/70 mt-1">{t('adminDashboard.subtitle')}</p>
          {pendingItems.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {pendingItems.map(item => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  {item.icon}
                  {item.value} {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map(stat => {
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

      {/* Quick Actions + Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <DashboardSection title={t('adminDashboard.quickActions')} icon={<Zap className="w-4 h-4 text-tdop-accent" />}>
          <div className="grid grid-cols-2 gap-3 p-4">
            <QuickAction
              label={t('adminDashboard.manageUsers')}
              icon={<Users className="w-5 h-5" />}
              to="/admin/users"
              color="bg-tdop-primary/10 text-tdop-primary"
            />
            <QuickAction
              label={t('adminDashboard.organizations')}
              icon={<Building2 className="w-5 h-5" />}
              to="/admin/organizations"
              color="bg-purple-50 text-purple-600"
            />
            <QuickAction
              label={t('adminDashboard.moderation')}
              icon={<Eye className="w-5 h-5" />}
              to="/admin/moderation"
              color="bg-purple-50 text-purple-600"
            />
            <QuickAction
              label={t('adminDashboard.reports')}
              icon={<Flag className="w-5 h-5" />}
              to="/admin/reports"
              color="bg-red-50 text-red-600"
            />
            <QuickAction
              label={t('adminDashboard.analytics')}
              icon={<BarChart3 className="w-5 h-5" />}
              to="/admin/analytics"
              color="bg-emerald-50 text-tdop-secondary"
            />
            <QuickAction
              label={t('adminDashboard.verification')}
              icon={<CheckCircle className="w-5 h-5" />}
              to="/admin/verification"
              color="bg-amber-50 text-amber-600"
            />
            <QuickAction
              label={t('adminDashboard.auditLog')}
              icon={<Clock className="w-5 h-5" />}
              to="/admin/audit-log"
              color="bg-gray-100 text-gray-600"
            />
            <QuickAction
              label={t('adminDashboard.opportunities')}
              icon={<Briefcase className="w-5 h-5" />}
              to="/admin/opportunities"
              color="bg-blue-50 text-blue-600"
            />
            <QuickAction
              label={t('adminDashboard.config')}
              icon={<Wrench className="w-5 h-5" />}
              to="/admin/config"
              color="bg-gray-100 text-gray-600"
            />
          </div>
        </DashboardSection>

        {/* Platform Health */}
        <DashboardSection title={t('adminDashboard.platformHealth')} icon={<Shield className="w-4 h-4 text-tdop-secondary" />}>
          <div className="space-y-3 p-4">
            {[
              { label: t('adminDashboard.suspendedOpportunities'), value: stats?.suspendedOpportunities || 0, warn: !!stats?.suspendedOpportunities },
              { label: t('adminDashboard.highRiskSignals'), value: stats?.highRiskSignals || 0, warn: !!stats?.highRiskSignals },
              { label: t('adminDashboard.pendingVerifications'), value: stats?.pendingVerifications || 0, warn: !!stats?.pendingVerifications },
              { label: t('adminDashboard.pendingReports'), value: stats?.pendingReports || 0, warn: !!stats?.pendingReports },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-tdop-light">
                <span className="text-sm text-gray-600">{item.label}</span>
                <Badge variant={item.warn ? 'warning' : 'success'} size="sm">{item.value}</Badge>
              </div>
            ))}
          </div>
        </DashboardSection>
      </div>

      {/* Pending Actions Alert */}
      {pendingItems.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="font-semibold text-tdop-navy flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {t('adminDashboard.actionNeeded')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pendingItems.map(item => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-3 p-3 rounded-xl bg-white hover:shadow-soft transition-all"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-lg font-bold text-tdop-navy">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
