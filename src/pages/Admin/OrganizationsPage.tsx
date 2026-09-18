import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageError } from '@/components/ui/PageStates';
import { adminApi } from '@/services/api/adminApi';
import { Building2, Shield, ShieldCheck, ShieldAlert, RefreshCw, Search, ExternalLink } from 'lucide-react';

interface Organization {
  id: number;
  orgName: string;
  description?: string;
  industry?: string;
  size?: string;
  website?: string;
  verified: boolean;
  verifiedAt?: string;
  createdAt?: string;
  user?: { id: number; fullName: string; email: string };
  opportunities?: any[];
  members?: any[];
}

const OrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orgs, orgStats] = await Promise.all([
        adminApi.getOrganizations(),
        adminApi.getOrganizationStats(),
      ]);
      setOrganizations(Array.isArray(orgs) ? orgs : []);
      setStats(orgStats);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const filtered = organizations.filter(org => {
    const matchesSearch = `${org.orgName} ${org.description || ''} ${org.industry || ''}`
      .toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'verified' && org.verified) ||
      (filterStatus === 'pending' && !org.verified);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <PageError message="Failed to load organizations. Please try again." onRetry={fetchData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
            <Building2 className="w-8 h-8 text-tdop-primary" />
            Organizations
          </h1>
          <p className="text-gray-500 mt-1">Manage registered organizations and verification status</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-tdop-navy">{stats.totalOrganizations || organizations.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Verified</p>
            <p className="text-2xl font-bold text-tdop-secondary">{organizations.filter(o => o.verified).length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Pending Verification</p>
            <p className="text-2xl font-bold text-tdop-accent">{stats.pendingVerifications || organizations.filter(o => !o.verified).length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">With Opportunities</p>
            <p className="text-2xl font-bold text-tdop-primary">{organizations.filter(o => o.opportunities && o.opportunities.length > 0).length}</p>
          </Card>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'verified', 'pending'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-tdop-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All' : status === 'verified' ? 'Verified' : 'Pending'}
            </button>
          ))}
        </div>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 text-sm font-medium text-gray-500">Organization</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Industry</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Owner</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Opportunities</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-tdop-navy/10 rounded-full flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-tdop-navy" />
                      </div>
                      <div>
                        <p className="font-medium text-tdop-navy">{org.orgName}</p>
                        {org.website && (
                          <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-xs text-tdop-primary hover:underline flex items-center gap-1">
                            {org.website.replace(/https?:\/\//, '').slice(0, 30)} <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{org.industry || '—'}</td>
                  <td className="p-4">
                    {org.user ? (
                      <div>
                        <p className="text-sm font-medium text-tdop-navy">{org.user.fullName}</p>
                        <p className="text-xs text-gray-500">{org.user.email}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {org.verified ? (
                      <Badge variant="success" className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Pending
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {org.opportunities?.length || 0}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/organizations/${org.id}`}
                        className="text-xs text-tdop-primary hover:underline flex items-center gap-1"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No organizations found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OrganizationsPage;
