import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PageError } from '@/components/ui/PageStates';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import axiosInstance from '@/services/api/axiosInstance';
import { useNotificationContext } from '@/context/NotificationContext';
import { Users, UserPlus, Mail, Shield, X, Trash2, ChevronDown } from 'lucide-react';

interface TeamMember {
  id: number;
  user: { id: number; fullName: string; email: string };
  role: string;
  status: string;
  joinedAt: string;
}

interface Invitation {
  id: number;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
}

const ROLE_OPTIONS = [
  { value: 'MEMBER', label: 'team.member' },
  { value: 'ADMIN', label: 'team.admin' },
];

const roleBadgeVariant = (role: string): string => {
  switch (role) {
    case 'OWNER': return 'info';
    case 'ADMIN': return 'warning';
    default: return 'gray';
  }
};

const statusBadgeVariant = (status: string): string => {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'PENDING': return 'warning';
    default: return 'gray';
  }
};

const TeamManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [orgId, setOrgId] = useState<number | null>(null);

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [sendingInvite, setSendingInvite] = useState(false);

  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const [removing, setRemoving] = useState(false);

  const fetchOrgId = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/organization/profile');
      const profile = res.data;
      if (profile?.id) {
        setOrgId(profile.id);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeamData = useCallback(async () => {
    if (!orgId) return;
    try {
      const [membersRes, invitationsRes] = await Promise.all([
        axiosInstance.get(`/organization/team/${orgId}/members`),
        axiosInstance.get(`/organization/team/${orgId}/invitations`),
      ]);
      setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
      setInvitations(Array.isArray(invitationsRes.data) ? invitationsRes.data : []);
    } catch {
      addNotification({
        type: 'error',
        title: t('common.error'),
        message: t('team.loadError'),
      });
    }
  }, [orgId, addNotification, t]);

  useEffect(() => {
    fetchOrgId();
  }, [fetchOrgId]);

  useEffect(() => {
    if (orgId) fetchTeamData();
  }, [orgId, fetchTeamData]);

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !orgId) return;
    setSendingInvite(true);
    try {
      await axiosInstance.post(`/organization/team/${orgId}/invite`, null, {
        params: { email: inviteEmail.trim(), role: inviteRole },
      });
      addNotification({
        type: 'success',
        title: t('team.sendInvite'),
        message: t('team.sendInvite'),
      });
      setShowInviteForm(false);
      setInviteEmail('');
      setInviteRole('MEMBER');
      fetchTeamData();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: t('common.error'),
        message: err?.response?.data?.message || t('team.loadError'),
      });
    } finally {
      setSendingInvite(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove || !orgId) return;
    setRemoving(true);
    try {
      await axiosInstance.delete(`/organization/team/${orgId}/members/${memberToRemove.user.id}`);
      addNotification({
        type: 'success',
        title: t('team.removeMember'),
        message: t('team.confirmRemove'),
      });
      setMemberToRemove(null);
      fetchTeamData();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: t('common.error'),
        message: err?.response?.data?.message || t('team.loadError'),
      });
    } finally {
      setRemoving(false);
    }
  };

  const handleUpdateRole = async (memberUserId: number, newRole: string) => {
    if (!orgId) return;
    try {
      await axiosInstance.put(`/organization/team/${orgId}/members/${memberUserId}/role`, null, {
        params: { role: newRole },
      });
      addNotification({
        type: 'success',
        title: t('team.admin'),
        message: t('team.admin'),
      });
      fetchTeamData();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: t('common.error'),
        message: err?.response?.data?.message || t('team.loadError'),
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48" />
              <div className="h-4 bg-gray-200 rounded w-64" />
            </div>
            <div className="h-10 bg-gray-200 rounded-lg w-36" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <PageError message={t('team.loadError')} onRetry={() => { setError(false); setLoading(true); fetchOrgId(); }} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tdop-navy">{t('team.title')}</h1>
          <p className="text-gray-500 mt-1">{t('team.subtitle')}</p>
        </div>
        <Button onClick={() => setShowInviteForm(true)}>
          <UserPlus className="w-4 h-4 mr-2" /> {t('team.inviteMember')}
        </Button>
      </div>

      {showInviteForm && (
        <Card>
          <div className="p-4">
            <div className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full">
                <Input
                  type="email"
                  placeholder={t('team.emailPlaceholder')}
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>
              <div className="w-full sm:w-40">
                <Select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  options={ROLE_OPTIONS.map((opt) => ({ ...opt, label: t(opt.label) }))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleInvite} loading={sendingInvite} disabled={!inviteEmail.trim()}>
                  {t('team.sendInvite')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInviteForm(false);
                    setInviteEmail('');
                    setInviteRole('MEMBER');
                  }}
                >
                  {t('team.cancel')}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-tdop-navy">
            {t('team.teamMembers')} ({members.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {members.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p>{t('team.noMembers')}</p>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-tdop-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-tdop-primary font-bold text-sm">
                        {member.user?.fullName?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-tdop-navy">{member.user?.fullName}</p>
                      <p className="text-sm text-gray-500">{member.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={roleBadgeVariant(member.role)} size="sm">
                      {member.role === 'OWNER' ? t('team.owner') : member.role === 'ADMIN' ? t('team.admin') : t('team.member')}
                    </Badge>
                    <Badge variant={statusBadgeVariant(member.status)} size="sm">
                      {member.status === 'ACTIVE' ? t('team.active') : member.status}
                    </Badge>
                    {member.role !== 'OWNER' && (
                      <div className="flex items-center gap-2">
                        <Select
                          value={member.role}
                          onChange={(e) => handleUpdateRole(member.user.id, e.target.value)}
                          options={ROLE_OPTIONS.map((opt) => ({ ...opt, label: t(opt.label) }))}
                          className="!py-1 !text-xs !w-auto"
                        />
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setMemberToRemove(member)}
                          icon={<Trash2 className="w-3 h-3" />}
                        >
                          {t('team.removeMember')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {invitations.length > 0 && (
        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-tdop-navy">
              {t('team.pendingInvitations')} ({invitations.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {invitations.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-tdop-navy">{inv.email}</p>
                    <p className="text-sm text-gray-500">{inv.role}</p>
                  </div>
                </div>
                <Badge variant="warning" size="sm">{inv.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={memberToRemove !== null}
        title={t('team.removeMember')}
        message={t('team.confirmRemove')}
        confirmLabel={t('team.removeMember')}
        cancelLabel={t('team.cancel')}
        variant="danger"
        loading={removing}
        onConfirm={handleRemoveMember}
        onCancel={() => setMemberToRemove(null)}
      />
    </div>
  );
};

export default TeamManagementPage;
