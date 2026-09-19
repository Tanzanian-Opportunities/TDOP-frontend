import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, TaxonomyOverview } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Database, Info } from 'lucide-react';

const SuperAdminTaxonomyPage: React.FC = () => {
  const [data, setData] = useState<TaxonomyOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await superAdminApi.getTaxonomyOverview();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch taxonomy overview');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;
  if (!data) return <PageError message="No data available" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Database className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">Taxonomy Governance</h1>
      </div>

      {data.note && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-200">{data.note}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Category Count</h2>
          <Badge variant="primary" className="text-2xl font-bold px-4 py-2">
            {data.categoryCount}
          </Badge>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {data.categories?.map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
            {(!data.categories || data.categories.length === 0) && (
              <span className="text-sm text-muted-foreground">No categories</span>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Locations</h2>
          <div className="flex flex-wrap gap-2">
            {data.locations?.map((location) => (
              <Badge key={location} variant="secondary">
                {location}
              </Badge>
            ))}
            {(!data.locations || data.locations.length === 0) && (
              <span className="text-sm text-muted-foreground">No locations</span>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Types</h2>
        <div className="flex flex-wrap gap-2">
          {data.types?.map((type) => (
            <Badge key={type} variant="accent">
              {type}
            </Badge>
          ))}
          {(!data.types || data.types.length === 0) && (
            <span className="text-sm text-muted-foreground">No types</span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminTaxonomyPage;
