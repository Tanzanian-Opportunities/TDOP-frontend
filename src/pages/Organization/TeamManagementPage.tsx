import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import axiosInstance from '@/services/api/axiosInstance';
import { Users, UserPlus, Mail, Shield, X } from 'lucide-react';

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

const OrganizationTeamPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const orgId = 1; // Would come from auth context

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, invitationsRes] = await Promise.all([
        axiosInstance.get(`/organization/team/${orgId}/members`),
        axiosInstance.get(`/organization/team/${orgId}/invitations`)
      ]);
      setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
      setInvitations(Array.isArray(invitationsRes.data) ? invitationsRes.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await axiosInstance.post(`/organization/team/${orgId}/invite`, null, {
        params: { email: inviteEmail, role: inviteRole }
      });
      setShowInviteForm(false);
      setInviteEmail('');
      setInviteRole('MEMBER');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMember = async (memberUserId: number) => {
    if (!confirm('Remove this member?')) return;
    try {
      await axiosInstance.delete(`/organization/team/${orgId}/members/${memberUserId}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRole = async (memberUserId: number, newRole: string) => {
    try {
      await axiosInstance.put(`/organization/team/${orgId}/members/${memberUserId}/role`, null, {
        params: { role: newRole }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your organization team members</p>
        </div>
        <Button onClick={() => setShowInviteForm(true)}>
          <UserPlus className="w-4 h-4 mr-2" /> Invite Member
        </Button>
      </div>

      {showInviteForm && (
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-4">
              <input
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
              <Button onClick={handleInvite}>Send Invite</Button>
              <Button variant="outline" onClick={() => setShowInviteForm(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members ({members.length})</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {members.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p>No team members yet</p>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-tdop-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-tdop-primary font-bold">
                        {member.user?.fullName?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{member.user?.fullName}</p>
                      <p className="text-sm text-gray-500">{member.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={member.role === 'OWNER' ? 'info' : member.role === 'ADMIN' ? 'warning' : 'default'}>
                      {member.role}
                    </Badge>
                    <Badge variant={member.status === 'ACTIVE' ? 'success' : 'default'}>
                      {member.status}
                    </Badge>
                    {member.role !== 'OWNER' && (
                      <div className="flex gap-1">
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateRole(member.user.id, e.target.value)}
                          className="text-xs px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
                        >
                          <option value="MEMBER">Member</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                        <Button size="sm" variant="danger" onClick={() => handleRemoveMember(member.user.id)}>
                          <X className="w-3 h-3" />
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
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Invitations ({invitations.length})</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {invitations.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{inv.email}</p>
                    <p className="text-sm text-gray-500">Role: {inv.role}</p>
                  </div>
                </div>
                <Badge variant="warning">{inv.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrganizationTeamPage;
