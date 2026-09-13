import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/services/api/adminApi';
import { CheckCircle, XCircle, Clock, FileText, AlertTriangle } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verification Officer Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Review and process organization verification requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending Review</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Verification Requests</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p>No pending verification requests</p>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">{req.organization?.orgName}</h3>
                      <Badge variant={req.status === 'PENDING' ? 'warning' : req.status === 'APPROVED' ? 'success' : 'danger'}>
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Document: {req.document}</p>
                    {req.notes && <p className="text-sm text-gray-500 mt-1">Notes: {req.notes}</p>}
                    <p className="text-xs text-gray-400 mt-1">Submitted: {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleApprove(req.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRequestInfo(req.id)}>
                      <FileText className="w-4 h-4 mr-1" /> Request Info
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleReject(req.id)}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
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

export default VerificationOfficerPage;
