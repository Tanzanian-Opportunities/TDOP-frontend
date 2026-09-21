import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { PageError } from '@/components/ui/PageStates';
import { adminApi } from '@/services/api/adminApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { Users, Shield, Ban, RefreshCw, Search } from 'lucide-react';

const PAGE_SIZE = 15;

interface User {
id: number;
email: string;
fullName: string;
phone?: string;
role: string;
enabled: boolean;
verified: boolean;
}

const UserManagementPage: React.FC = () => {
const { t } = useTranslation();
const { addNotification } = useNotificationContext();
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [filterRole, setFilterRole] = useState('');
const [confirmTarget, setConfirmTarget] = useState<{ type: string; id: number; name: string } | null>(null);
const [actionLoading, setActionLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
fetchUsers();
}, []);

const fetchUsers = async () => {
try {
const data = await adminApi.getUsers();
setUsers(Array.isArray(data) ? data : []);
} catch (err) {
console.error(err);
setError(true);
} finally {
setLoading(false);
}
};

const handleSuspend = async () => {
if (!confirmTarget) return;
setActionLoading(true);
try {
await adminApi.suspendUser(String(confirmTarget.id));
setConfirmTarget(null);
fetchUsers();
} catch (err) {
addNotification({ type: 'error', title: 'Error', message: t('adminUserManagement.failedSuspend') });
console.error(err);
} finally {
setActionLoading(false);
}
};

const handleRoleChange = async (id: number, newRole: string) => {
try {
await adminApi.updateUserRole(String(id), newRole);
fetchUsers();
} catch (err) {
addNotification({ type: 'error', title: 'Error', message: t('adminUserManagement.failedRole') });
console.error(err);
}
};

const filteredUsers = users.filter(user => {
const matchesSearch = `${user.fullName} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase());
const matchesRole = !filterRole || user.role === filterRole;
return matchesSearch && matchesRole;
});

const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

const getRoleBadge = (role: string) => {
const colors: Record<string, string> = {
'ADMIN': 'danger',
'SUPER_ADMIN': 'danger',
'MODERATOR': 'warning',
'VERIFICATION_OFFICER': 'info',
'ORGANIZATION': 'info',
'ORGANIZATION_ADMIN': 'info',
'ORGANIZATION_MEMBER': 'default',
'SEEKER': 'default',
};
return <Badge variant={(colors[role] || 'default') as any}>{role}</Badge>;
};

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

if (error) return <PageError message={t('adminUserManagement.failedToLoad')} onRetry={fetchUsers} />;

return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div>
<h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
<Users className="w-8 h-8 text-tdop-primary" />
{t('adminUserManagement.title')}
</h1>
<p className="text-gray-500 mt-1">{t('adminUserManagement.subtitle')}</p>
</div>
<Button onClick={fetchUsers} variant="outline" size="sm">
<RefreshCw className="w-4 h-4 mr-1" /> {t('adminUserManagement.refresh')}
</Button>
</div>

<div className="flex flex-col sm:flex-row items-center gap-3">
<div className="relative flex-1 max-w-sm">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
<input
type="text"
placeholder={t('adminUserManagement.searchPlaceholder')}
value={searchQuery}
onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
/>
</div>
<select
value={filterRole}
onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
>
<option value="">{t('adminUserManagement.allRoles')}</option>
<option value="SEEKER">{t('adminUserManagement.seeker')}</option>
<option value="ORGANIZATION">{t('adminUserManagement.organization')}</option>
<option value="ADMIN">{t('adminUserManagement.admin')}</option>
<option value="SUPER_ADMIN">{t('adminUserManagement.superAdmin')}</option>
<option value="MODERATOR">{t('adminUserManagement.moderator')}</option>
<option value="VERIFICATION_OFFICER">{t('adminUserManagement.verificationOfficer')}</option>
</select>
</div>

<Card padding={false}>
<div className="overflow-x-auto">
<table className="w-full">
<thead>
<tr className="border-b border-gray-200">
<th className="text-left p-4 text-sm font-medium text-gray-500">{t('adminUserManagement.user')}</th>
<th className="text-left p-4 text-sm font-medium text-gray-500">{t('adminUserManagement.role')}</th>
<th className="text-left p-4 text-sm font-medium text-gray-500">{t('adminUserManagement.status')}</th>
<th className="text-right p-4 text-sm font-medium text-gray-500">{t('adminUserManagement.actions')}</th>
</tr>
</thead>
<tbody className="divide-y divide-gray-100">
{paginatedUsers.map((user) => (
<tr key={user.id} className="hover:bg-gray-50">
<td className="p-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-tdop-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
{user.fullName?.charAt(0) || '?'}
</div>
<div>
<p className="font-medium text-tdop-navy">{user.fullName}</p>
<p className="text-xs text-gray-500">{user.email}</p>
</div>
</div>
</td>
<td className="p-4">
<select
value={user.role}
onChange={(e) => handleRoleChange(user.id, e.target.value)}
className="text-xs px-2 py-1 border rounded"
>
<option value="SEEKER">{t('adminUserManagement.seeker')}</option>
<option value="ORGANIZATION">{t('adminUserManagement.organization')}</option>
<option value="ADMIN">{t('adminUserManagement.admin')}</option>
<option value="SUPER_ADMIN">{t('adminUserManagement.superAdmin')}</option>
<option value="MODERATOR">{t('adminUserManagement.moderator')}</option>
<option value="VERIFICATION_OFFICER">{t('adminUserManagement.verificationOfficer')}</option>
</select>
</td>
<td className="p-4">
<Badge variant={user.enabled ? 'success' : 'danger'}>
{user.enabled ? t('adminUserManagement.active') : t('adminUserManagement.suspended')}
</Badge>
</td>
<td className="p-4 text-right">
<div className="flex items-center justify-end gap-2">
{user.enabled && (
<Button variant="ghost" size="sm" onClick={() => setConfirmTarget({ type: 'suspend', id: user.id, name: user.fullName })}>
  <Ban className="w-4 h-4 text-red-500" />
</Button>
)}
</div>
</td>
</tr>
))}
</tbody>
</table>
{filteredUsers.length === 0 && (
<div className="text-center py-12">
<p className="text-gray-500">{t('adminUserManagement.noUsers')}</p>
</div>
)}
</div>
</Card>

<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

<ConfirmDialog
  open={!!confirmTarget}
  title={`Suspend ${confirmTarget?.name || ''}?`}
  message={t('adminUserManagement.suspendConfirm')}
  confirmLabel={t('adminUserManagement.suspendUser')}
  variant="danger"
  onConfirm={handleSuspend}
  onCancel={() => setConfirmTarget(null)}
  loading={actionLoading}
/>
</div>
);
};

export default UserManagementPage;
