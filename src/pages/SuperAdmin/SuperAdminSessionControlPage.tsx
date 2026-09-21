import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { superAdminApi } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Users, Shield, Info } from 'lucide-react';

const SuperAdminSessionControlPage: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    superAdminApi.getSessionOverview()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (error || !data) return <PageError />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <Users className="w-7 h-7 text-tdop-primary" />
          Session Control
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('superAdminDetail.userSessionOverview')}</p>
      </div>
      <Card className="p-4 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">{data.note}</p>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('superAdminDetail.totalUsers'), value: data.totalUsers },
          { label: t('superAdminDetail.enabledUsers'), value: data.enabledUsers },
          { label: t('superAdminDetail.disabledUsers'), value: data.disabledUsers },
          { label: t('superAdminDetail.adminSessions'), value: data.adminSessions },
        ].map((item) => (
          <Card key={item.label} className="p-5">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold text-tdop-navy mt-2">{item.value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-tdop-navy mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" /> {t('superAdminDetail.privilegedAccessSummary')}
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('superAdminDetail.activePrivilegedUsers')}</span>
            <span className="font-medium text-tdop-navy">{data.privilegedActive}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('superAdminDetail.disabledUsers')}</span>
            <span className="font-medium text-red-600">{data.disabledUsers}</span>
          </div>
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-tdop-navy mb-3">{t('superAdminDetail.sessionManagementNotes')}</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2"><span className="text-tdop-primary mt-1">&#8226;</span>Tokens are stateless JWT — no server-side session store</li>
          <li className="flex items-start gap-2"><span className="text-tdop-primary mt-1">&#8226;</span>Token revocation is handled via the JWT blacklist on logout</li>
          <li className="flex items-start gap-2"><span className="text-tdop-primary mt-1">&#8226;</span>Disabled users cannot authenticate — their tokens are rejected at login</li>
          <li className="flex items-start gap-2"><span className="text-tdop-primary mt-1">&#8226;</span>For real-time session tracking, a Redis-based session store would be required</li>
        </ul>
      </Card>
    </div>
  );
};

export default SuperAdminSessionControlPage;
