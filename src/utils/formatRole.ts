import { UserRole } from '@/types/user';

export const formatRole = (role: UserRole): string => {
  const roles: Record<UserRole, string> = {
    seeker: 'Job Seeker',
    organization: 'Organization',
    organization_admin: 'Organization Admin',
    organization_member: 'Organization Member',
    verification_officer: 'Verification Officer',
    moderator: 'Moderator',
    admin: 'Administrator',
    super_admin: 'Super Admin',
  };
  return roles[role] || role;
};

export const formatRoleShort = (role: UserRole): string => {
  const roles: Record<UserRole, string> = {
    seeker: 'Seeker',
    organization: 'Org',
    organization_admin: 'Org Admin',
    organization_member: 'Org Member',
    verification_officer: 'Verifier',
    moderator: 'Mod',
    admin: 'Admin',
    super_admin: 'Super Admin',
  };
  return roles[role] || role;
};

export const formatApplicationStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending Review',
    under_review: 'Under Review',
    shortlisted: 'Shortlisted',
    interview: 'Interview',
    accepted: 'Accepted',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
  };
  return statusMap[status?.toLowerCase()] || status;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    under_review: 'bg-blue-50 text-tdop-primary',
    reviewed: 'bg-blue-50 text-tdop-primary',
    shortlisted: 'bg-emerald-50 text-tdop-secondary',
    interview: 'bg-purple-50 text-purple-700',
    accepted: 'bg-emerald-50 text-emerald-700',
    offer: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-600',
    open: 'bg-emerald-50 text-tdop-secondary',
    closed: 'bg-red-50 text-red-700',
    draft: 'bg-gray-100 text-gray-600',
    filled: 'bg-blue-50 text-tdop-primary',
    expired: 'bg-gray-100 text-gray-600',
    verified: 'bg-emerald-50 text-tdop-secondary',
    pending_verification: 'bg-amber-50 text-amber-700',
    primary: 'bg-blue-50 text-tdop-primary',
    info: 'bg-blue-50 text-tdop-primary',
    warning: 'bg-amber-50 text-amber-700',
    success: 'bg-emerald-50 text-tdop-secondary',
    danger: 'bg-red-50 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
};
