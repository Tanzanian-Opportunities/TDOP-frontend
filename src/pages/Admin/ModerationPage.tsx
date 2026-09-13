import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/services/api/adminApi';
import { CheckCircle, XCircle, Eye, AlertTriangle, Archive } from 'lucide-react';

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

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const data = await adminApi.getModerationQueue();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Moderation Queue</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Review and moderate opportunities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{items.length}</p>
              <p className="text-xs text-gray-500">Pending Review</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Opportunities</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p>No pending opportunities to moderate</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                      <Badge variant={item.status === 'SUBMITTED' ? 'info' : item.status === 'UNDER_REVIEW' ? 'warning' : 'default'}>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      {item.category && <span>Category: {item.category}</span>}
                      {item.location && <span>Location: {item.location}</span>}
                      {item.createdBy?.orgName && <span>Organization: {item.createdBy.orgName}</span>}
                      <span>Submitted: {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
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
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default ModerationPage;
