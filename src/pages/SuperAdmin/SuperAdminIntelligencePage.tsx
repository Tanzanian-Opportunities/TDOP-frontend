import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { superAdminApi, EcosystemIntelligence } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Brain } from 'lucide-react';

const formatKey = (key: string): string => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
};

const SuperAdminIntelligencePage: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<EcosystemIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    superAdminApi.getEcosystemIntelligence()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (error || !data) return <PageError />;

  const sections = [
    { title: t('superAdminDetail.platformDashboardStats'), data: data.platformStats },
    { title: t('superAdminDetail.opportunityAnalytics'), data: data.opportunityAnalytics },
    { title: t('superAdminDetail.reportAnalytics'), data: data.reportAnalytics },
    { title: t('superAdminDetail.platformActivity'), data: data.platformActivity },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <Brain className="w-7 h-7 text-tdop-primary" />
          Ecosystem Intelligence
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('superAdmin.crossCuttingAnalytics')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="p-5">
            <h3 className="text-sm font-semibold text-tdop-navy mb-3">{section.title}</h3>
            {section.data ? (
              <div className="space-y-2">
                {Object.entries(section.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500">{formatKey(key)}</span>
                    <span className="font-medium text-tdop-navy">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">{t('superAdminDetail.noDataAvailable')}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminIntelligencePage;
