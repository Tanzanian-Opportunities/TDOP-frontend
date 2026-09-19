import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, PlatformAttention, PlatformPulse, PlatformHealth } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import {
  Shield, AlertTriangle, Activity, HeartPulse, Users, Building2, Briefcase,
  Flag, ChevronRight, ArrowRight, CheckCircle, XCircle, Clock, Zap
} from 'lucide-react';

const SuperAdminOverviewPage: React.FC = () => {
  const [attention, setAttention] = useState<PlatformAttention | null>(null);
  const [pulse, setPulse] = useState<PlatformPulse | null>(null);
  const [health, setHealth] = useState<PlatformHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      superAdminApi.getPlatformAttention(),
      superAdminApi.getPlatformPulse(),
      superAdminApi.getPlatformHealth()
    ]).then(([a, p, h]) => { setAttention(a); setPulse(p); setHealth(h); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  const healthOk = health ? Object.values(health).filter(s => s.status === 'OPERATIONAL').length : 0;
  const healthTotal = health ? Object.values(health).length : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
            <Shield className="w-7 h-7 text-tdop-primary" />
            Platform Control Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">Governance overview — platform health, attention, and ecosystem metrics</p>
        </div>
      </div>

      {attention && attention.totalAttention > 0 && (
        <Card className="p-4 bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {attention.totalAttention} item{attention.totalAttention !== 1 ? 's' : ''} require governance attention
              </p>
              <p className="text-xs text-amber-600">Review items needing super admin oversight.</p>
            </div>
            <Link to="/super-admin/attention" className="ml-auto text-sm text-amber-700 hover:underline flex items-center gap-1">
              View <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/super-admin/attention">
          <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <Badge variant={attention && attention.totalAttention > 0 ? 'danger' : 'secondary'}>
                {attention?.totalAttention || 0}
              </Badge>
            </div>
            <p className="mt-3 text-sm font-semibold text-tdop-navy">Platform Attention</p>
            <p className="text-xs text-gray-500 mt-1">Items needing governance action</p>
          </Card>
        </Link>

        <Link to="/super-admin/pulse">
          <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <Activity className="w-6 h-6 text-tdop-primary" />
              <Badge variant="primary">Live</Badge>
            </div>
            <p className="mt-3 text-sm font-semibold text-tdop-navy">Platform Pulse</p>
            <p className="text-xs text-gray-500 mt-1">Real-time ecosystem metrics</p>
          </Card>
        </Link>

        <Link to="/super-admin/health">
          <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <HeartPulse className="w-6 h-6 text-tdop-secondary" />
              <Badge variant={healthOk === healthTotal ? 'secondary' : 'danger'}>
                {healthOk}/{healthTotal}
              </Badge>
            </div>
            <p className="mt-3 text-sm font-semibold text-tdop-navy">Platform Health</p>
            <p className="text-xs text-gray-500 mt-1">System service status</p>
          </Card>
        </Link>

        <Link to="/super-admin/security">
          <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <Shield className="w-6 h-6 text-red-500" />
              <Badge variant="outline">
                {attention?.highRiskSignals || 0} high
              </Badge>
            </div>
            <p className="mt-3 text-sm font-semibold text-tdop-navy">Security Center</p>
            <p className="text-xs text-gray-500 mt-1">Security events and risk signals</p>
          </Card>
        </Link>
      </div>

      {pulse && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Users', value: pulse.users.total, icon: <Users className="w-4 h-4" />, to: '/super-admin/access' },
            { label: 'Organizations', value: pulse.organizations.total, icon: <Building2 className="w-4 h-4" />, to: '/super-admin/org-governance' },
            { label: 'Opportunities', value: pulse.opportunities.total, icon: <Briefcase className="w-4 h-4" />, to: '/super-admin/intelligence' },
            { label: 'Applications', value: pulse.applications.total, icon: <Zap className="w-4 h-4" />, to: '/super-admin/intelligence' },
            { label: 'Open Reports', value: pulse.reports.pending, icon: <Flag className="w-4 h-4" />, to: '/super-admin/trust-governance' },
            { label: 'Open Escalations', value: pulse.escalations.open, icon: <AlertTriangle className="w-4 h-4" />, to: '/super-admin/trust-governance' },
          ].map(item => (
            <Link key={item.label} to={item.to}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-2 text-gray-400">{item.icon}<span className="text-xs">{item.label}</span></div>
                <p className="text-xl font-bold text-tdop-navy mt-2">{item.value}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-tdop-navy mb-3">Quick Navigation</h3>
          <div className="space-y-2">
            {[
              { to: '/super-admin/roles', label: 'Roles & Permissions', desc: 'View and manage role assignments' },
              { to: '/super-admin/access', label: 'Access Governance', desc: 'Privileged access oversight' },
              { to: '/super-admin/audit', label: 'Audit & Compliance', desc: 'Governance change log' },
              { to: '/super-admin/config', label: 'Platform Configuration', desc: 'System settings and policies' },
            ].map(item => (
              <Link key={item.to} to={item.to} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-tdop-navy">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-tdop-navy mb-3">Ecosystem Snapshot</h3>
          {pulse && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Verified Organizations</span>
                <span className="font-medium text-tdop-navy">{pulse.organizations.verified}/{pulse.organizations.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Published Opportunities</span>
                <span className="font-medium text-tdop-navy">{pulse.opportunities.published}/{pulse.opportunities.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Admin Users</span>
                <span className="font-medium text-tdop-navy">{pulse.users.admins}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Super Admins</span>
                <span className="font-medium text-tdop-navy">{pulse.users.superAdmins}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Verification Officers</span>
                <span className="font-medium text-tdop-navy">{pulse.users.verificationOfficers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Moderators</span>
                <span className="font-medium text-tdop-navy">{pulse.users.moderators}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pending Appeals</span>
                <span className="font-medium text-tdop-navy">{pulse.appeals.pending}</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminOverviewPage;
