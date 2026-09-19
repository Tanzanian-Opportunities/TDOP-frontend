import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, PlatformAttention } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { AlertTriangle, CheckCircle, Eye, Flag, Shield, Clock, ChevronRight } from 'lucide-react';

const SuperAdminAttentionPage: React.FC = () => {
  const [data, setData] = useState<PlatformAttention | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { setData(await superAdminApi.getPlatformAttention()); }
    catch { setError(true); }
    finally { setLoading(false); }
  };

  if (loading) return <PageLoading />;
  if (error || !data) return <PageError />;

  const items = [
    { label: 'Pending Verifications', count: data.pendingVerifications, to: '/trust/verifications', icon: <CheckCircle className="w-6 h-6" />, color: 'text-tdop-secondary', bg: 'bg-teal-50' },
    { label: 'Pending Reports', count: data.pendingReports, to: '/trust/reports', icon: <Flag className="w-6 h-6" />, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'High Risk Signals', count: data.highRiskSignals, to: '/super-admin/security', icon: <AlertTriangle className="w-6 h-6" />, color: 'text-tdop-accent', bg: 'bg-amber-50' },
    { label: 'Open Escalations', count: data.openEscalations, to: '/trust/escalations', icon: <Eye className="w-6 h-6" />, color: 'text-tdop-primary', bg: 'bg-blue-50' },
    { label: 'Pending Appeals', count: data.pendingAppeals, to: '/trust/appeals', icon: <Shield className="w-6 h-6" />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
            Platform Attention
          </h1>
          <p className="text-sm text-gray-500 mt-1">Items requiring super admin governance oversight</p>
        </div>
      </div>

      <Card className={`p-4 ${data.totalAttention > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${data.totalAttention > 0 ? 'bg-amber-100' : 'bg-green-100'}`}>
            {data.totalAttention > 0 ? <AlertTriangle className="w-5 h-5 text-amber-600" /> : <CheckCircle className="w-5 h-5 text-green-600" />}
          </div>
          <div>
            <p className={`text-sm font-semibold ${data.totalAttention > 0 ? 'text-amber-800' : 'text-green-800'}`}>
              {data.totalAttention === 0 ? 'All clear — no governance attention required.' : `${data.totalAttention} item${data.totalAttention !== 1 ? 's' : ''} require${data.totalAttention === 1 ? 's' : ''} attention`}
            </p>
            <p className={`text-xs ${data.totalAttention > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              {data.totalAttention === 0 ? 'All systems operating within normal parameters.' : 'Review items needing governance action.'}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <Link key={item.label} to={item.to}>
            <Card className={`p-5 hover:shadow-md transition-shadow cursor-pointer ${item.bg} border`}>
              <div className="flex items-start justify-between">
                <div className={item.color}>{item.icon}</div>
                <Badge variant={item.count > 0 ? 'danger' : 'secondary'}>{item.count}</Badge>
              </div>
              <p className="mt-3 text-sm font-semibold text-tdop-navy">{item.label}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                {item.count > 0 ? 'Review now' : 'Nothing pending'}
                <ChevronRight className="w-3 h-3" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminAttentionPage;
