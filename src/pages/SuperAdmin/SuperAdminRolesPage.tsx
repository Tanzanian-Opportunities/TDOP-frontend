import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi, UserRoleAssignment } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Lock, Shield, Users } from 'lucide-react';

const SuperAdminRolesPage: React.FC = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<UserRoleAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { setRoles(await superAdminApi.getUserRoleAssignments()); }
    catch { setError(true); }
    finally { setLoading(false); }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  const totalUsers = roles.reduce((sum, r) => sum + r.userCount, 0);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return <Badge variant="danger">SUPER_ADMIN</Badge>;
      case 'ADMIN': return <Badge variant="primary">ADMIN</Badge>;
      case 'MODERATOR': return <Badge variant="accent">MODERATOR</Badge>;
      case 'VERIFICATION_OFFICER': return <Badge variant="secondary">VERIFICATION_OFFICER</Badge>;
      case 'ORGANIZATION': return <Badge variant="outline">ORGANIZATION</Badge>;
      case 'ORGANIZATION_ADMIN': return <Badge variant="outline">ORGANIZATION_ADMIN</Badge>;
      default: return <Badge variant="ghost">{role}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
          <Lock className="w-7 h-7 text-tdop-primary" />
          Roles & Permissions
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('superAdmin.roleDistribution')}</p>
      </div>

      <Card className="p-4 bg-slate-50 border">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-tdop-primary" />
          <div>
            <p className="text-sm font-semibold text-tdop-navy">{totalUsers} {t('superAdminDetail.totalUsersAcross')} {roles.length} {t('superAdminDetail.roles')}</p>
            <p className="text-xs text-gray-500">{t('superAdminDetail.roleAssignmentsEnforced')}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map(role => (
          <Card key={role.role} className="p-5">
            <div className="flex items-start justify-between">
              {getRoleBadge(role.role)}
              <span className="text-2xl font-bold text-tdop-navy">{role.userCount}</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">{role.description}</p>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-tdop-primary h-2 rounded-full transition-all"
                  style={{ width: `${totalUsers > 0 ? (role.userCount / totalUsers) * 100 : 0}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                {totalUsers > 0 ? Math.round((role.userCount / totalUsers) * 100) : 0}% of users
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-tdop-navy mb-3">{t('superAdminDetail.roleHierarchyAccess')}</h3>
        <div className="space-y-2">
          {[
            { role: 'SUPER_ADMIN', desc: 'Full platform governance — roles, permissions, configuration, security, audit', level: 'Level 5' },
            { role: 'ADMIN', desc: 'Platform operations — user management, reports, analytics, moderation, config', level: 'Level 4' },
            { role: 'MODERATOR', desc: 'Trust workspace — opportunity moderation, reports, case management', level: 'Level 3' },
            { role: 'VERIFICATION_OFFICER', desc: 'Trust workspace — organization verification, document review', level: 'Level 3' },
            { role: 'ORGANIZATION_ADMIN', desc: 'Organization admin — team management, opportunity publishing', level: 'Level 2' },
            { role: 'ORGANIZATION', desc: 'Organization workspace — opportunity creation, application management', level: 'Level 2' },
            { role: 'SEEKER', desc: 'Personal workspace — browse, apply, save, track applications', level: 'Level 1' },
          ].map(item => (
            <div key={item.role} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                {getRoleBadge(item.role)}
                <span className="text-xs text-gray-600">{item.desc}</span>
              </div>
              <span className="text-[10px] text-gray-400">{item.level}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminRolesPage;
