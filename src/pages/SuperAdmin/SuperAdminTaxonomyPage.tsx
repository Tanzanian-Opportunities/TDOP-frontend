import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, TaxonomyOverview } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Database, Info } from 'lucide-react';

const SuperAdminTaxonomyPage: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<TaxonomyOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    superAdminApi.getTaxonomyOverview()
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
          <Database className="w-7 h-7 text-tdop-primary" />
          Taxonomy Governance
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('superAdminDetail.platformTaxonomyCategories')}</p>
      </div>
      {data.note && (
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">{data.note}</p>
          </div>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-sm text-gray-500">{t('superAdminDetail.categoryCount')}</p>
          <p className="text-2xl font-bold text-tdop-navy mt-1">{data.categoryCount}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">{t('superAdminDetail.locationCount')}</p>
          <p className="text-2xl font-bold text-tdop-navy mt-1">{data.locations?.length || 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">{t('superAdminDetail.typeCount')}</p>
          <p className="text-2xl font-bold text-tdop-navy mt-1">{data.types?.length || 0}</p>
        </Card>
      </div>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-tdop-navy mb-3">{t('superAdminDetail.categories')}</h3>
        <div className="flex flex-wrap gap-2">
          {data.categories?.map((cat) => (
            <Badge key={cat} variant="outline">{cat}</Badge>
          ))}
          {(!data.categories || data.categories.length === 0) && (
            <span className="text-sm text-gray-400">{t('superAdminDetail.noCategories')}</span>
          )}
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-tdop-navy mb-3">{t('superAdminDetail.locations')}</h3>
        <div className="flex flex-wrap gap-2">
          {data.locations?.map((loc) => (
            <Badge key={loc} variant="secondary">{loc}</Badge>
          ))}
          {(!data.locations || data.locations.length === 0) && (
            <span className="text-sm text-gray-400">{t('superAdminDetail.noLocations')}</span>
          )}
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-tdop-navy mb-3">{t('superAdminDetail.opportunityTypes')}</h3>
        <div className="flex flex-wrap gap-2">
          {data.types?.map((type) => (
            <Badge key={type} variant="accent">{type}</Badge>
          ))}
          {(!data.types || data.types.length === 0) && (
            <span className="text-sm text-gray-400">{t('superAdminDetail.noTypes')}</span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminTaxonomyPage;
