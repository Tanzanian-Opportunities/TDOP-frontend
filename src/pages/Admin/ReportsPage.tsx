import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import InputDialog from '@/components/ui/InputDialog';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Pagination from '@/components/ui/Pagination';
import { PageError } from '@/components/ui/PageStates';
import { adminApi } from '@/services/api/adminApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { Flag, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

const PAGE_SIZE = 15;

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
const { t } = useTranslation();
const { addNotification } = useNotificationContext();
const [reports, setReports] = useState<Report[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, actioned: 0 });
const [tab, setTab] = useState<'pending' | 'all'>('pending');
const [resolveTarget, setResolveTarget] = useState<{ id: number; reason: string } | null>(null);
const [dismissTarget, setDismissTarget] = useState<{ id: number; reason: string } | null>(null);
const [actionLoading, setActionLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);

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
setError(true);
} finally {
setLoading(false);
}
};

const handleResolve = async (resolution: string) => {
if (!resolveTarget) return;
setActionLoading(true);
try {
await adminApi.resolveReport(String(resolveTarget.id), resolution);
setResolveTarget(null);
fetchData();
} catch (err) {
addNotification({ type: 'error', title: 'Error', message: t('adminReports.failedResolve') });
console.error(err);
} finally {
setActionLoading(false);
}
};

const handleDismiss = async () => {
if (!dismissTarget) return;
setActionLoading(true);
try {
await adminApi.dismissReport(String(dismissTarget.id));
setDismissTarget(null);
fetchData();
} catch (err) {
addNotification({ type: 'error', title: 'Error', message: t('adminReports.failedDismiss') });
console.error(err);
} finally {
setActionLoading(false);
}
};

const getStatusBadge = (status: string) => {
switch (status) {
case 'PENDING': return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" /> {t('adminReports.pending')}</Badge>;
case 'REVIEWED': return <Badge variant="info"><AlertTriangle className="w-3 h-3 mr-1" /> {t('adminReports.reviewed')}</Badge>;
case 'ACTIONED': return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" /> {t('adminReports.actioned')}</Badge>;
default: return <Badge variant="default">{status}</Badge>;
}
};

const filteredReports = tab === 'pending'
? reports.filter(r => r.status === 'PENDING')
: reports;

const totalPages = Math.ceil(filteredReports.length / PAGE_SIZE);
const paginatedReports = filteredReports.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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

if (error) return <PageError message={t('adminReports.failedToLoad')} onRetry={fetchData} />;

return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
<div>
<h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
<Flag className="w-8 h-8 text-tdop-primary" />
{t('adminReports.title')}
</h1>
<p className="text-gray-500 mt-1">{t('adminReports.subtitle')}</p>
</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<Card>
<div className="text-center">
<p className="text-2xl font-bold text-tdop-navy">{stats.total}</p>
<p className="text-xs text-gray-500">{t('adminReports.totalReports')}</p>
</div>
</Card>
<Card>
<div className="text-center">
<p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
<p className="text-xs text-gray-500">{t('adminReports.pending')}</p>
</div>
</Card>
<Card>
<div className="text-center">
<p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
<p className="text-xs text-gray-500">{t('adminReports.reviewed')}</p>
</div>
</Card>
<Card>
<div className="text-center">
<p className="text-2xl font-bold text-green-600">{stats.actioned}</p>
<p className="text-xs text-gray-500">{t('adminReports.actioned')}</p>
</div>
</Card>
</div>

<div className="flex gap-2">
<button
onClick={() => { setTab('pending'); setCurrentPage(1); }}
className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'pending' ? 'bg-tdop-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
>
{t('adminReports.pending')} ({stats.pending})
</button>
<button
onClick={() => { setTab('all'); setCurrentPage(1); }}
className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'all' ? 'bg-tdop-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
>
{t('adminReports.allReports')} ({stats.total})
</button>
</div>

<Card padding={false}>
<div className="divide-y divide-gray-100">
{filteredReports.length === 0 ? (
<div className="p-8 text-center text-gray-500">
<CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
<p>No {tab === 'pending' ? t('adminReports.pending').toLowerCase() : ''} {t('adminReports.noReports')}</p>
</div>
) : (
paginatedReports.map((report) => (
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
{report.reporter && <span>{t('adminReports.reportedBy')} {report.reporter.fullName}</span>}
{report.assignedTo && <span>{t('adminReports.assignedTo')} {report.assignedTo.fullName}</span>}
<span>{t('adminReports.target')} #{report.targetId}</span>
<span>{new Date(report.createdAt).toLocaleDateString()}</span>
</div>
{report.resolution && (
<p className="text-sm text-green-600 mt-2">{t('adminReports.resolution')} {report.resolution}</p>
)}
</div>
{report.status === 'PENDING' && (
<div className="flex items-center gap-2 ml-4">
<Button size="sm" onClick={() => setResolveTarget({ id: report.id, reason: report.reason })}>
  <CheckCircle className="w-4 h-4 mr-1" /> {t('adminReports.resolve')}
</Button>
<Button size="sm" variant="outline" onClick={() => setDismissTarget({ id: report.id, reason: report.reason })}>
  <XCircle className="w-4 h-4 mr-1" /> {t('adminReports.dismiss')}
</Button>
</div>
)}
</div>
</div>
))
)}
</div>
</Card>

<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

<InputDialog
  open={!!resolveTarget}
  title={t('adminReports.resolveReport')}
  label={`Provide a resolution for: "${resolveTarget?.reason || ''}"`}
  placeholder="Issue addressed, user warned..."
  multiline
  onConfirm={handleResolve}
  onCancel={() => setResolveTarget(null)}
  loading={actionLoading}
/>
<ConfirmDialog
  open={!!dismissTarget}
  title={t('adminReports.dismissReport')}
  message={`Dismiss the report "${dismissTarget?.reason || ''}"? ${t('adminReports.cannotUndo')}`}
  confirmLabel={t('adminReports.dismiss')}
  variant="warning"
  onConfirm={handleDismiss}
  onCancel={() => setDismissTarget(null)}
  loading={actionLoading}
/>
</div>
);
};

export default ReportsPage;
