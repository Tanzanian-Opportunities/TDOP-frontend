import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { PageError } from '@/components/ui/PageStates';
import { adminApi } from '@/services/api/adminApi';
import { Users, Shield, Ban, RefreshCw, Search } from 'lucide-react';

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
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [filterRole, setFilterRole] = useState('');
const [confirmTarget, setConfirmTarget] = useState<{ type: string; id: number; name: string } | null>(null);
const [actionLoading, setActionLoading] = useState(false);

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
console.error(err);
}
};

const filteredUsers = users.filter(user => {
const matchesSearch = `${user.fullName} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase());
const matchesRole = !filterRole || user.role === filterRole;
return matchesSearch && matchesRole;
});

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

if (error) return <PageError message="Failed to load users. Please try again." onRetry={() => {}} />;

return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div>
<h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
<Users className="w-8 h-8 text-tdop-primary" />
User Management
</h1>
<p className="text-gray-500 mt-1">Manage platform users and roles</p>
</div>
<Button onClick={fetchUsers} variant="outline" size="sm">
<RefreshCw className="w-4 h-4 mr-1" /> Refresh
</Button>
</div>

<div className="flex flex-col sm:flex-row items-center gap-3">
<div className="relative flex-1 max-w-sm">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
<input
type="text"
placeholder="Search users..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
/>
</div>
<select
value={filterRole}
onChange={(e) => setFilterRole(e.target.value)}
className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
>
<option value="">All Roles</option>
<option value="SEEKER">Seeker</option>
<option value="ORGANIZATION">Organization</option>
<option value="ADMIN">Admin</option>
<option value="SUPER_ADMIN">Super Admin</option>
<option value="MODERATOR">Moderator</option>
<option value="VERIFICATION_OFFICER">Verification Officer</option>
</select>
</div>

<Card padding={false}>
<div className="overflow-x-auto">
<table className="w-full">
<thead>
<tr className="border-b border-gray-200">
<th className="text-left p-4 text-sm font-medium text-gray-500">User</th>
<th className="text-left p-4 text-sm font-medium text-gray-500">Role</th>
<th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
<th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-gray-100">
{filteredUsers.map((user) => (
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
<option value="SEEKER">Seeker</option>
<option value="ORGANIZATION">Organization</option>
<option value="ADMIN">Admin</option>
<option value="SUPER_ADMIN">Super Admin</option>
<option value="MODERATOR">Moderator</option>
<option value="VERIFICATION_OFFICER">Verification Officer</option>
</select>
</td>
<td className="p-4">
<Badge variant={user.enabled ? 'success' : 'danger'}>
{user.enabled ? 'Active' : 'Suspended'}
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
<p className="text-gray-500">No users found</p>
</div>
)}
</div>
</Card>

<ConfirmDialog
  open={!!confirmTarget}
  title={`Suspend ${confirmTarget?.name || ''}?`}
  message="This user will lose access to the platform immediately. You can re-enable their account later."
  confirmLabel="Suspend User"
  variant="danger"
  onConfirm={handleSuspend}
  onCancel={() => setConfirmTarget(null)}
  loading={actionLoading}
/>
</div>
);
};

export default UserManagementPage;
