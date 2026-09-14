import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/services/api/adminApi';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { StatCard } from '@/components/dashboard/StatCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { CheckCircle, XCircle, Clock, FileText, AlertTriangle, Search, ArrowRight } from 'lucide-react';

interface VerificationRequest {
  id: number;
  organization: { id: number; orgName: string; verified: boolean };
  document: string;
  status: string;
  notes?: string;
  createdAt: string;
}

const VerificationOfficerPage: React.FC = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [queue, statsData] = await Promise.all([
        adminApi.getVerificationQueue(),
        adminApi.getVerificationStats()
      ]);
      setRequests(Array.isArray(queue) ? queue : []);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await adminApi.approveVerification(String(id));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Rejection reason:');
    if (reason !== null) {
      try {
        await adminApi.rejectVerification(String(id), reason);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRequestInfo = async (id: number) => {
    const info = prompt('What information is needed?');
    if (info !== null) {
      try {
        await adminApi.requestVerificationInfo(String(id), info);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filtered = requests.filter(req => {
    const matchesSearch = searchQuery === '' ||
      req.organization?.orgName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.document?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const approved = requests.filter(r => r.status === 'APPROVED').length;
  const rejected = requests.filter(r => r.status === 'REJECTED').length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-3xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
          </div>
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      {/* Welcome Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-tdop-navy to-tdop-primary p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-3xl font-bold font-display">Verification Officer Dashboard</h1>
          <p className="text-white/70 mt-1">Review and process organization verification requests.</p>
          {stats.pending > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 text-sm font-medium">
              <Clock className="w-4 h-4" />
              {stats.pending} pending review
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          value={stats.pending}
          label="Pending review"
          icon={<Clock className="w-5 h-5" />}
          color={stats.pending ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-tdop-secondary'}
          trend={stats.pending ? 'up' : 'neutral'}
        />
        <StatCard
          value={approved}
          label="Approved"
          icon={<CheckCircle className="w-5 h-5" />}
          color="bg-emerald-50 text-tdop-secondary"
          trend="neutral"
        />
        <StatCard
          value={rejected}
          label="Rejected"
          icon={<XCircle className="w-5 h-5" />}
          color="bg-red-50 text-red-600"
          trend="neutral"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by organization or document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {['all', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-white text-tdop-navy shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Queue */}
      <DashboardSection
        title="Verification requests"
        icon={<FileText className="w-4 h-4" />}
        empty={filtered.length === 0}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<CheckCircle className="w-8 h-8 text-emerald-400" />}
            title="All clear"
            description={searchQuery || filterStatus !== 'all'
              ? "No requests match your filters."
              : "No pending verification requests."}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((req) => (
              <div key={req.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-tdop-navy">{req.organization?.orgName || 'Unknown'}</h3>
                      <Badge
                        variant={req.status === 'PENDING' ? 'warning' : req.status === 'APPROVED' ? 'success' : 'danger'}
                        size="sm"
                      >
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Document: <span className="text-tdop-navy font-medium">{req.document}</span>
                    </p>
                    {req.notes && <p className="text-sm text-gray-500 mt-1">Notes: {req.notes}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" onClick={() => handleApprove(req.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRequestInfo(req.id)}>
                      <FileText className="w-4 h-4 mr-1" /> Info
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleReject(req.id)}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardSection>
    </div>
  );
};

export default VerificationOfficerPage;
