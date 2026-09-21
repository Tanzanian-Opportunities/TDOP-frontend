import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, PrivilegedAccess } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Users, Shield, CheckCircle, XCircle } from 'lucide-react';

const SuperAdminAccessPage: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<PrivilegedAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { setUsers(await superAdminApi.getPrivilegedAccess()); }
    catch { setError(true); }
    finally { setLoading(false); }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return <Badge variant="danger">SUPER_ADMIN</Badge>;
      case 'ADMIN': return <Badge variant="primary">ADMIN</Badge>;
      case 'MODERATOR': return <Badge variant="accent">MODERATOR</Badge>;
      case 'VERIFICATION_OFFICER': return <Badge variant="secondary">VERIFICATION_OFFICER</Badge>;
      default: return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <Users className="w-7 h-7 text-tdop-primary" />
          {t('superAdmin.access')}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('superAdmin.privilegedAccess')}</p>
      </div>

      <Card className="p-4 bg-slate-50 border">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-tdop-primary" />
          <div>
            <p className="text-sm font-semibold text-tdop-navy">{users.length} {t('superAdminDetail.privilegedAccess')}</p>
            <p className="text-xs text-gray-500">{t('superAdminDetail.onlyPrivilegedRoles')}</p>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.user')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.role')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.status')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.verified')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.created')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => (
                <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-tdop-navy">{user.fullName || 'No name'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-3">
                    {user.enabled ? (
                      <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle className="w-3 h-3" /> {t('superAdminDetail.active')}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-600"><XCircle className="w-3 h-3" /> {t('superAdminDetail.disabled')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.verified ? (
                      <span className="text-xs text-green-600">{t('superAdminDetail.yes')}</span>
                    ) : (
                      <span className="text-xs text-gray-400">{t('superAdminDetail.no')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">{t('superAdminDetail.noPrivilegedUsers')}</div>
        )}
      </Card>
    </div>
  );
};

export default SuperAdminAccessPage;
