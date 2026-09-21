import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, PlatformPulse } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Users, Building2, Briefcase, FileText, Flag, AlertTriangle, Shield, Activity } from 'lucide-react';

const SuperAdminPulsePage: React.FC = () => {
  const { t } = useTranslation();
  const [pulse, setPulse] = useState<PlatformPulse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { setPulse(await superAdminApi.getPlatformPulse()); }
    catch { setError(true); }
    finally { setLoading(false); }
  };

  if (loading) return <PageLoading />;
  if (error || !pulse) return <PageError />;

  const StatCard = ({ label, value, icon, detail }: { label: string; value: number; icon: React.ReactNode; detail?: string }) => (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-gray-500">{icon}<span className="text-sm">{label}</span></div>
      <p className="text-2xl font-bold text-tdop-navy mt-2">{value.toLocaleString()}</p>
      {detail && <p className="text-xs text-gray-400 mt-1">{detail}</p>}
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <Activity className="w-7 h-7 text-tdop-primary" />
          Platform Pulse
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('superAdmin.ecosystemMetrics')}</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">{t('superAdminDetail.users')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatCard label={t('superAdminDetail.totalUsers')} value={pulse.users.total} icon={<Users className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.adminUsers')} value={pulse.users.admins} icon={<Shield className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.superAdmins')} value={pulse.users.superAdmins} icon={<Shield className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.organizations')} value={pulse.users.organizations} icon={<Building2 className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.seekers')} value={pulse.users.seekers} icon={<Users className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.verificationOfficers')} value={pulse.users.verificationOfficers} icon={<Shield className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.moderators')} value={pulse.users.moderators} icon={<Shield className="w-4 h-4" />} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">{t('superAdminDetail.organizations')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label={t('superAdminDetail.totalOrganizations')} value={pulse.organizations.total} icon={<Building2 className="w-4 h-4" />} detail={`${pulse.organizations.total > 0 ? Math.round((pulse.organizations.verified / pulse.organizations.total) * 100) : 0}% ${t('superAdminDetail.verified')}`} />
          <StatCard label={t('superAdminDetail.verifiedOrganizations')} value={pulse.organizations.verified} icon={<Shield className="w-4 h-4" />} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">{t('superAdminDetail.opportunities')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label={t('superAdminDetail.total')} value={pulse.opportunities.total} icon={<Briefcase className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.published')} value={pulse.opportunities.published} icon={<Briefcase className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.draft')} value={pulse.opportunities.draft} icon={<Briefcase className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.expired')} value={pulse.opportunities.expired} icon={<Briefcase className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.suspended')} value={pulse.opportunities.suspended} icon={<AlertTriangle className="w-4 h-4" />} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">{t('superAdminDetail.operations')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label={t('superAdminDetail.totalApplications')} value={pulse.applications.total} icon={<FileText className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.totalReports')} value={pulse.reports.total} icon={<Flag className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.pendingReports')} value={pulse.reports.pending} icon={<Flag className="w-4 h-4" />} />
          <StatCard label={t('superAdminDetail.openEscalations')} value={pulse.escalations.open} icon={<AlertTriangle className="w-4 h-4" />} />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPulsePage;
