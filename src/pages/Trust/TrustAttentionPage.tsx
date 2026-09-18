import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { trustApi, AttentionData } from '@/services/api/trustApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { useNotificationContext } from '@/context/NotificationContext';
import {
  AlertTriangle, CheckCircle, Eye, Flag, Shield, Clock,
  ChevronRight, ArrowRight, TrendingUp
} from 'lucide-react';

const TrustAttentionPage: React.FC = () => {
  const { addNotification } = useNotificationContext();
  const [data, setData] = useState<AttentionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadAttention();
  }, []);

  const loadAttention = async () => {
    try {
      const result = await trustApi.getAttention();
      setData(result);
    } catch (err) {
      console.error(err);
      setError(true);
      addNotification({ type: 'error', title: 'Error', message: 'Failed to load attention center.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoading />;
  if (error || !data) return <PageError />;

  const urgentItems = [
    { label: 'Pending Verifications', count: data.pendingVerifications, to: '/trust/verifications', icon: <CheckCircle className="w-6 h-6" />, color: 'text-tdop-secondary', bg: 'bg-teal-50' },
    { label: 'Pending Moderation', count: data.pendingModeration, to: '/trust/moderation', icon: <Eye className="w-6 h-6" />, color: 'text-tdop-primary', bg: 'bg-blue-50' },
    { label: 'Pending Reports', count: data.pendingReports, to: '/trust/reports', icon: <Flag className="w-6 h-6" />, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'High Risk Signals', count: data.highRiskSignals, to: '/trust/work-queue', icon: <AlertTriangle className="w-6 h-6" />, color: 'text-tdop-accent', bg: 'bg-amber-50' },
  ];

  const totalUrgent = data.pendingVerifications + data.pendingModeration + data.pendingReports + data.highRiskSignals;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
            <Shield className="w-7 h-7 text-tdop-primary" />
            Trust & Quality Operations
          </h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and act on items requiring your attention</p>
        </div>
        <Link
          to="/trust/work-queue"
          className="flex items-center gap-2 px-4 py-2 bg-tdop-primary text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Open Work Queue
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <Card className="p-4 bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {totalUrgent === 0 ? 'All clear — nothing requires your attention.' : `${totalUrgent} item${totalUrgent !== 1 ? 's' : ''} require${totalUrgent === 1 ? 's' : ''} attention`}
            </p>
            <p className="text-xs text-amber-600">
              {totalUrgent === 0 ? 'Check back later for new items.' : 'Review and take action on items below.'}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {urgentItems.map(item => (
          <Link key={item.label} to={item.to}>
            <Card className={`p-5 hover:shadow-md transition-shadow cursor-pointer ${item.bg} border`}>
              <div className="flex items-start justify-between">
                <div className={`${item.color}`}>{item.icon}</div>
                <Badge variant={item.count > 0 ? 'danger' : 'secondary'}>
                  {item.count}
                </Badge>
              </div>
              <p className="mt-3 text-sm font-semibold text-tdop-navy">{item.label}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                {item.count > 0 ? 'View queue' : 'Nothing pending'}
                <ChevronRight className="w-3 h-3" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Medium Risk Signals
          </div>
          <p className="text-2xl font-bold text-tdop-navy mt-2">{data.mediumRiskSignals}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4" />
            Unreviewed Fraud Signals
          </div>
          <p className="text-2xl font-bold text-tdop-navy mt-2">{data.unreviewedSignals}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            Quick Actions
          </div>
          <div className="mt-2 space-y-1">
            <Link to="/trust/work-queue" className="block text-sm text-tdop-primary hover:underline">
              Open combined work queue
            </Link>
            <Link to="/trust/activity" className="block text-sm text-tdop-primary hover:underline">
              View activity log
            </Link>
            <Link to="/trust/overview" className="block text-sm text-tdop-primary hover:underline">
              Operational overview
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrustAttentionPage;
