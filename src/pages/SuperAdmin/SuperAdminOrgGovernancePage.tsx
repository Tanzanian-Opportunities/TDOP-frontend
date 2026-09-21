import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, PlatformPulse } from '@/services/api/superAdminApi';
import { adminApi } from '@/services/api/adminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Building2, CheckCircle, AlertTriangle } from 'lucide-react';

const SuperAdminOrgGovernancePage: React.FC = () => {
  const { t } = useTranslation();
  const [pulse, setPulse] = useState<PlatformPulse | null>(null);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [p, o] = await Promise.all([superAdminApi.getPlatformPulse(), adminApi.getOrganizations()]);
      setPulse(p);
      setOrgs(Array.isArray(o) ? o : []);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  const verifiedCount = orgs.filter(o => o.verified).length;
  const unverifiedCount = orgs.length - verifiedCount;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <Building2 className="w-7 h-7 text-tdop-primary" />
          Organization Governance
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('superAdmin.orgOversight')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-gray-500"><Building2 className="w-4 h-4" /><span className="text-sm">{t('superAdminDetail.totalOrganizations')}</span></div>
          <p className="text-2xl font-bold text-tdop-navy mt-2">{orgs.length}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-gray-500"><CheckCircle className="w-4 h-4" /><span className="text-sm">{t('superAdminDetail.verified')}</span></div>
          <p className="text-2xl font-bold text-tdop-secondary mt-2">{verifiedCount}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-gray-500"><AlertTriangle className="w-4 h-4" /><span className="text-sm">{t('superAdminDetail.unverified')}</span></div>
          <p className="text-2xl font-bold text-tdop-accent mt-2">{unverifiedCount}</p>
        </Card>
      </div>
      <Card className="p-4 bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>{t('superAdmin.governanceView')}:</strong> {t('superAdminDetail.orgOversightText')} <a href="/admin/organizations" className="underline">{t('superAdminDetail.adminOrganizations')}</a>.
          </p>
      </Card>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.organization')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.status')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.created')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orgs.slice(0, 50).map((org: any) => (
                <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-tdop-navy">{org.organizationName || org.name || 'Unnamed'}</p>
                    <p className="text-xs text-gray-500">{org.email || ''}</p>
                  </td>
                  <td className="px-4 py-3">
                    {org.verified ? <Badge variant="secondary">Verified</Badge> : <Badge variant="outline">Unverified</Badge>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orgs.length === 0 && <div className="p-8 text-center text-gray-500 text-sm">{t('superAdminDetail.noOrganizations')}</div>}
      </Card>
    </div>
  );
};

export default SuperAdminOrgGovernancePage;
