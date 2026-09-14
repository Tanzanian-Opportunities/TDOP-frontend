import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { adminApi } from '@/services/api/adminApi';
import {
Users, Briefcase, FileText, Shield, AlertTriangle,
Building2, Eye, CheckCircle, XCircle, Clock
} from 'lucide-react';

interface DashboardStats {
totalUsers: number;
totalOpportunities: number;
totalApplications: number;
verifiedOrganizations: number;
pendingVerifications: number;
activeOpportunities: number;
pendingModeration: number;
totalOrganizations: number;
pendingReports: number;
totalReports: number;
highRiskSignals: number;
suspendedOpportunities: number;
}

const AdminDashboardPage: React.FC = () => {
const { t } = useTranslation();
const [stats, setStats] = useState<DashboardStats | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
fetchStats();
}, []);

const fetchStats = async () => {
try {
setLoading(true);
const data = await adminApi.getDashboardStats();
setStats(data);
} catch (err) {
setError('Failed to load dashboard stats');
console.error(err);
} finally {
setLoading(false);
}
};

const statCards = stats ? [
{ label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600' },
{ label: 'Total Organizations', value: stats.totalOrganizations, icon: Building2, color: 'bg-purple-100 text-purple-600' },
{ label: 'Verified Organizations', value: stats.verifiedOrganizations, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
{ label: 'Pending Verifications', value: stats.pendingVerifications, icon: Clock, color: 'bg-orange-100 text-orange-600' },
{ label: 'Active Opportunities', value: stats.activeOpportunities, icon: Briefcase, color: 'bg-indigo-100 text-indigo-600' },
{ label: 'Pending Moderation', value: stats.pendingModeration, icon: Eye, color: 'bg-yellow-100 text-yellow-600' },
{ label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'bg-cyan-100 text-cyan-600' },
{ label: 'Pending Reports', value: stats.pendingReports, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
] : [];

if (loading) {
return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<div className="animate-pulse space-y-6">
<div className="h-8 bg-gray-200 rounded w-1/3"></div>
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
{[...Array(8)].map((_, i) => (
<div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
))}
</div>
</div>
</div>
);
}

if (error) {
return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<Card>
<div className="text-center py-8">
<XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
<p className="text-gray-600">{error}</p>
<button onClick={fetchStats} className="mt-4 px-4 py-2 bg-tdop-primary text-white rounded-lg hover:bg-tdop-primary/90">
Retry
</button>
</div>
</Card>
</div>
);
}

return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
<div>
<h1 className="text-3xl font-bold text-tdop-navy">Admin Dashboard</h1>
<p className="text-gray-500 mt-1">Platform overview and management</p>
</div>

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
{statCards.map((stat, i) => {
const Icon = stat.icon;
return (
<Card key={i}>
<div className="flex items-center gap-4">
<div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
<Icon className="w-6 h-6" />
</div>
<div>
<p className="text-2xl font-bold text-tdop-navy">{stat.value}</p>
<p className="text-xs text-gray-500">{stat.label}</p>
</div>
</div>
</Card>
);
})}
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<Card>
<div className="p-6 border-b border-gray-100">
<h2 className="text-lg font-semibold text-tdop-navy">Quick Actions</h2>
</div>
<div className="p-6 grid grid-cols-2 gap-3">
<a href="/admin/users" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
<Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
<span className="text-sm font-medium text-blue-600">Manage Users</span>
</a>
<a href="/admin/opportunities" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
<Briefcase className="w-6 h-6 text-purple-600 mx-auto mb-2" />
<span className="text-sm font-medium text-purple-600">Moderation</span>
</a>
<a href="/admin/reports" className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-center">
<AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
<span className="text-sm font-medium text-red-600">Reports</span>
</a>
<a href="/admin/analytics" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
<Eye className="w-6 h-6 text-green-600 mx-auto mb-2" />
<span className="text-sm font-medium text-green-600">Analytics</span>
</a>
</div>
</Card>

<Card>
<div className="p-6 border-b border-gray-100">
<h2 className="text-lg font-semibold text-tdop-navy">Platform Health</h2>
</div>
<div className="p-6 space-y-4">
<div className="flex items-center justify-between">
<span className="text-sm text-gray-600">Suspended Opportunities</span>
<Badge variant={stats?.suspendedOpportunities ? 'warning' : 'success'}>
{stats?.suspendedOpportunities || 0}
</Badge>
</div>
<div className="flex items-center justify-between">
<span className="text-sm text-gray-600">High Risk Signals</span>
<Badge variant={stats?.highRiskSignals ? 'danger' : 'success'}>
{stats?.highRiskSignals || 0}
</Badge>
</div>
<div className="flex items-center justify-between">
<span className="text-sm text-gray-600">Total Reports</span>
<Badge variant="info">{stats?.totalReports || 0}</Badge>
</div>
<div className="flex items-center justify-between">
<span className="text-sm text-gray-600">Pending Verifications</span>
<Badge variant={stats?.pendingVerifications ? 'warning' : 'success'}>
{stats?.pendingVerifications || 0}
</Badge>
</div>
</div>
</Card>
</div>
</div>
);
};

export default AdminDashboardPage;
