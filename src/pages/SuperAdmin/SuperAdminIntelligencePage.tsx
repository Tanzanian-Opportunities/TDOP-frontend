import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { superAdminApi, EcosystemIntelligence } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Brain } from 'lucide-react';

const formatKey = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const SuperAdminIntelligencePage: React.FC = () => {
  const [data, setData] = useState<EcosystemIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await superAdminApi.getEcosystemIntelligence();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ecosystem intelligence');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;
  if (!data) return <PageError message="No data available" />;

  const sections = [
    { title: 'Platform Dashboard Stats', data: data.platformDashboardStats },
    { title: 'Opportunity Analytics', data: data.opportunityAnalytics },
    { title: 'Report Analytics', data: data.reportAnalytics },
    { title: 'Platform Activity', data: data.platformActivity },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">Ecosystem Intelligence</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="p-6">
            <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
            <div className="space-y-3">
              {Object.entries(section.data || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">{formatKey(key)}</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminIntelligencePage;
