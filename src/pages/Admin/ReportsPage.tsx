import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/services/api/adminApi';
import { Flag, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Report {
id: number;
reporter?: { id: number; fullName: string; email: string };
targetType: string;
targetId: number;
reason: string;
description?: string;
status: string;
assignedTo?: { id: number; fullName: string };
investigationNotes?: string;
resolution?: string;
createdAt: string;
}

const ReportsPage: React.FC = () => {
const [reports, setReports] = useState<Report[]>([]);
const [loading, setLoading] = useState(true);
const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, actioned: 0 });
const [tab, setTab] = useState<'pending' | 'all'>('pending');

useEffect(() => {
fetchData();
}, []);

const fetchData = async () => {
try {
const [reportsData, statsData] = await Promise.all([
adminApi.getAllReports(),
adminApi.getReportStats()
]);
setReports(Array.isArray(reportsData) ? reportsData : []);
setStats(statsData);
} catch (err) {
console.error(err);
} finally {
setLoading(false);
}
};

const handleResolve = async (id: number) => {
const resolution = prompt('Resolution:');
if (resolution !== null) {
try {
await adminApi.resolveReport(String(id), resolution);
fetchData();
} catch (err) {
console.error(err);
}
}
};

const handleDismiss = async (id: number) => {
if (!confirm('Dismiss this report?')) return;
try {
await adminApi.dismissReport(String(id));
fetchData();
} catch (err) {
console.error(err);
}
};

const getStatusBadge = (status: string) => {
switch (status) {
case 'PENDING': return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
case 'REVIEWED': return <Badge variant="info"><AlertTriangle className="w-3 h-3 mr-1" /> Reviewed</Badge>;
case 'ACTIONED': return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" /> Actioned</Badge>;
default: return <Badge variant="default">{status}</Badge>;
}
};

const filteredReports = tab === 'pending'
? reports.filter(r => r.status === 'PENDING')
: reports;

if (loading) {
return (
<div className="max-w-7xl mx-auto px-4 py-8">
<div className="animate-pulse space-y-4">
{[...Array(5)].map((_, i) => (
<div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
))}
</div>
</div>
);
}

return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
<div>
<h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
<Flag className="w-8 h-8 text-tdop-primary" />
Reports
</h1>
<p className="text-gray-500 mt-1">Investigate and resolve user reports</p>
</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<Card>
<div className="text-center">
<p className="text-2xl font-bold text-tdop-navy">{stats.total}</p>
<p className="text-xs text-gray-500">Total Reports</p>
</div>
</Card>
<Card>
<div className="text-center">
<p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
<p className="text-xs text-gray-500">Pending</p>
</div>
</Card>
<Card>
<div className="text-center">
<p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
<p className="text-xs text-gray-500">Reviewed</p>
</div>
</Card>
<Card>
<div className="text-center">
<p className="text-2xl font-bold text-green-600">{stats.actioned}</p>
<p className="text-xs text-gray-500">Actioned</p>
</div>
</Card>
</div>

<div className="flex gap-2">
<button
onClick={() => setTab('pending')}
className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'pending' ? 'bg-tdop-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
>
Pending ({stats.pending})
</button>
<button
onClick={() => setTab('all')}
className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'all' ? 'bg-tdop-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
>
All Reports ({stats.total})
</button>
</div>

<Card padding={false}>
<div className="divide-y divide-gray-100">
{filteredReports.length === 0 ? (
<div className="p-8 text-center text-gray-500">
<CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
<p>No {tab === 'pending' ? 'pending' : ''} reports found</p>
</div>
) : (
filteredReports.map((report) => (
<div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
<div className="flex items-start justify-between">
<div className="flex-1">
<div className="flex items-center gap-3">
<h3 className="font-medium text-tdop-navy">{report.reason}</h3>
{getStatusBadge(report.status)}
<Badge variant="info">{report.targetType}</Badge>
</div>
{report.description && (
<p className="text-sm text-gray-500 mt-1">{report.description}</p>
)}
<div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
{report.reporter && <span>Reported by: {report.reporter.fullName}</span>}
{report.assignedTo && <span>Assigned to: {report.assignedTo.fullName}</span>}
<span>Target #{report.targetId}</span>
<span>{new Date(report.createdAt).toLocaleDateString()}</span>
</div>
{report.resolution && (
<p className="text-sm text-green-600 mt-2">Resolution: {report.resolution}</p>
)}
</div>
{report.status === 'PENDING' && (
<div className="flex items-center gap-2 ml-4">
<Button size="sm" onClick={() => handleResolve(report.id)}>
<CheckCircle className="w-4 h-4 mr-1" /> Resolve
</Button>
<Button size="sm" variant="outline" onClick={() => handleDismiss(report.id)}>
<XCircle className="w-4 h-4 mr-1" /> Dismiss
</Button>
</div>
)}
</div>
</div>
))
)}
</div>
</Card>
</div>
);
};

export default ReportsPage;
