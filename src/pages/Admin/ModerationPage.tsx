import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { StatCard } from '@/components/dashboard/StatCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { PageError } from '@/components/ui/PageStates';
import { CheckCircle, XCircle, Eye, AlertTriangle, Archive, Search, Building2, MapPin } from 'lucide-react';

interface ModerationItem {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  location: string;
  createdBy?: { orgName: string };
  createdAt: string;
}

const ModerationPage: React.FC = () => {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const data = await adminApi.getModerationQueue();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    const reason = prompt('Approval reason (optional):');
    try {
      await adminApi.approveModeration(String(id), reason || undefined);
      fetchQueue();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Rejection reason:');
    if (reason !== null) {
      try {
        await adminApi.rejectModeration(String(id), reason);
        fetchQueue();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSuspend = async (id: number) => {
    const reason = prompt('Suspension reason:');
    if (reason !== null) {
      try {
        await adminApi.suspendModeration(String(id), reason);
        fetchQueue();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filtered = items.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.createdBy?.orgName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: items.length,
    submitted: items.filter(i => i.status === 'SUBMITTED').length,
    underReview: items.filter(i => i.status === 'UNDER_REVIEW').length,
  };

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

  if (error) return <PageError message="Failed to load moderation queue. Please try again." onRetry={() => {}} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      {/* Welcome Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-tdop-navy to-tdop-primary p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-3xl font-bold font-display">Moderation Queue</h1>
          <p className="text-white/70 mt-1">Review and moderate submitted opportunities.</p>
          {statusCounts.total > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-sm font-medium">
              <Eye className="w-4 h-4" />
              {statusCounts.total} items in queue
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          value={statusCounts.total}
          label="Total in queue"
          icon={<Eye className="w-5 h-5" />}
          color="bg-tdop-primary/10 text-tdop-primary"
          trend="neutral"
        />
        <StatCard
          value={statusCounts.submitted}
          label="New submissions"
          icon={<AlertTriangle className="w-5 h-5" />}
          color={statusCounts.submitted ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-tdop-secondary'}
          trend={statusCounts.submitted ? 'up' : 'neutral'}
        />
        <StatCard
          value={statusCounts.underReview}
          label="Under review"
          icon={<Archive className="w-5 h-5" />}
          color={statusCounts.underReview ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-tdop-secondary'}
          trend="neutral"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, organization, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {['all', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-white text-tdop-navy shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Moderation Queue */}
      <DashboardSection
        title="Opportunities to moderate"
        icon={<Eye className="w-4 h-4" />}
        empty={filtered.length === 0}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<CheckCircle className="w-8 h-8 text-emerald-400" />}
            title="All clear"
            description={searchQuery || filterStatus !== 'all'
              ? "No items match your filters."
              : "No opportunities to moderate right now."}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-tdop-navy">{item.title}</h3>
                      <Badge
                        variant={item.status === 'SUBMITTED' ? 'info' : item.status === 'UNDER_REVIEW' ? 'warning' : item.status === 'APPROVED' ? 'success' : 'danger'}
                        size="sm"
                      >
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      {item.category && (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-tdop-primary" />
                          {item.category}
                        </span>
                      )}
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{item.location}
                        </span>
                      )}
                      {item.createdBy?.orgName && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />{item.createdBy.orgName}
                        </span>
                      )}
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" onClick={() => handleApprove(item.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleReject(item.id)}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleSuspend(item.id)}>
                      <Archive className="w-4 h-4 mr-1" /> Suspend
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

export default ModerationPage;
