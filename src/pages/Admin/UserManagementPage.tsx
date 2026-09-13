import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SearchBar } from '@/components/ui/SearchBar';
import { formatDate } from '@/utils/formatDate';
import { formatRole } from '@/utils/formatRole';
import { User } from '@/types/user';
import { Users, Plus, Edit2, Shield, Trash2 } from 'lucide-react';

const UserManagementPage: React.FC = () => {
 const { t } = useTranslation();
 const [searchQuery, setSearchQuery] = useState('');
 const [filterRole, setFilterRole] = useState('');

 const mockUsers: User[] = [
 { id: '1', email: 'john@example.com', firstName: 'John', lastName: 'Doe', role: 'seeker', isActive: true, isVerified: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
 { id: '2', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith', role: 'organization', isActive: true, isVerified: true, createdAt: '2024-01-02', updatedAt: '2024-01-02' },
 { id: '3', email: 'admin@example.com', firstName: 'Admin', lastName: 'User', role: 'admin', isActive: true, isVerified: true, createdAt: '2024-01-03', updatedAt: '2024-01-03' },
 ];

 const filteredUsers = mockUsers.filter(user => {
 const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesRole = !filterRole || user.role === filterRole;
 return matchesSearch && matchesRole;
 });

 const users = filteredUsers;

 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
 <div className="flex items-center justify-between">
 <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
 <Users className="w-8 h-8 text-tdop-primary" />
 {t('admin.users')}
 </h1>
 </div>

 <div className="flex flex-col sm:flex-row items-center gap-4">
 <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={t('admin.searchUsers')} />
 <Select
 options={[
 { value: '', label: 'All Roles' },
 { value: 'seeker', label: 'Seeker' },
 { value: 'organization', label: 'Organization' },
 { value: 'admin', label: 'Admin' },
 ]}
 value={filterRole}
 onChange={(e) => setFilterRole(e.target.value)}
 />
 </div>

 <Card padding={false}>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="border-b border-gray-200">
 <th className="text-left p-4 text-sm font-medium text-gray-500">{t('admin.usersTable')}</th>
 <th className="text-left p-4 text-sm font-medium text-gray-500">{t('common.role')}</th>
 <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
 <th className="text-left p-4 text-sm font-medium text-gray-500">{t('common.joined')}</th>
 <th className="text-right p-4 text-sm font-medium text-gray-500">{t('admin.actions')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {users.map(user => (
 <tr key={user.id} className="hover:bg-gray-50">
 <td className="p-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-tdop-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
 {user.firstName[0]}{user.lastName[0]}
 </div>
 <div>
 <p className="font-medium text-tdop-navy">{user.firstName} {user.lastName}</p>
 <p className="text-xs text-gray-500">{user.email}</p>
 </div>
 </div>
 </td>
 <td className="p-4"><Badge variant={user.role === 'admin' ? 'warning' : 'info'}>{formatRole(user.role)}</Badge></td>
 <td className="p-4">
 {user.isVerified ? (
 <Badge variant="verified">Verified</Badge>
 ) : (
 <Badge variant="warning">Pending</Badge>
 )}
 </td>
 <td className="p-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
 <td className="p-4 text-right">
 <div className="flex items-center justify-end gap-2">
 <Button variant="ghost" size="sm"><Shield className="w-4 h-4" /></Button>
 <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4" /></Button>
 <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {users.length === 0 && (
 <div className="text-center py-12">
 <p className="text-gray-500">{t('admin.noUsers')}</p>
 </div>
 )}
 </div>
 </Card>
 </div>
 );
};

const useAdmin = () => {
 return {};
};

export default UserManagementPage;
