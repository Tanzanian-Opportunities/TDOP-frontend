import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, PlatformHealth } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { HeartPulse, CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

const SuperAdminHealthPage: React.FC = () => {
  const { t } = useTranslation();
  const [health, setHealth] = useState<PlatformHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { setHealth(await superAdminApi.getPlatformHealth()); }
    catch { setError(true); }
    finally { setLoading(false); }
  };

  if (loading) return <PageLoading />;
  if (error || !health) return <PageError />;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'NOT_CONFIGURED': return <XCircle className="w-5 h-5 text-gray-400" />;
      case 'UNKNOWN': return <HelpCircle className="w-5 h-5 text-amber-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return <Badge variant="secondary">{status}</Badge>;
      case 'NOT_CONFIGURED': return <Badge variant="outline">{status}</Badge>;
      case 'UNKNOWN': return <Badge variant="accent">{status}</Badge>;
      default: return <Badge variant="danger">{status}</Badge>;
    }
  };

  const operational = Object.values(health).filter(s => s.status === 'OPERATIONAL').length;
  const total = Object.values(health).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <HeartPulse className="w-7 h-7 text-tdop-secondary" />
          Platform Health
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('superAdmin.systemHealth')}</p>
      </div>

      <Card className="p-4 bg-slate-50 border">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${operational === total ? 'bg-green-100' : 'bg-amber-100'}`}>
            {operational === total ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-tdop-navy">{operational}/{total} {t('superAdminDetail.servicesOperational')}</p>
            <p className="text-xs text-gray-500">
              {operational === total ? t('superAdminDetail.allServicesRunning') : t('superAdminDetail.servicesNeedAttention', { count: total - operational })}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(health).map(([key, service]) => (
          <Card key={key} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(service.status)}
                <h3 className="text-sm font-semibold text-tdop-navy capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
              </div>
              {getStatusBadge(service.status)}
            </div>
            <p className="text-xs text-gray-500 mt-3">{service.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminHealthPage;
