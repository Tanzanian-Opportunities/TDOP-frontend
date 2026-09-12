import { UserRole } from '@/types/user';

export const formatRole = (role: UserRole): string => {
  const roles: Record<UserRole, string> = {
    seeker: 'Job Seeker',
    organization: 'Organization',
    admin: 'Administrator',
  };
  return roles[role];
};

export const formatRoleShort = (role: UserRole): string => {
  const roles: Record<UserRole, string> = {
    seeker: 'Seeker',
    organization: 'Org',
    admin: 'Admin',
  };
  return roles[role];
};

export const formatApplicationStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending Review',
    reviewed: 'Reviewed',
    shortlisted: 'Shortlisted',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shortlisted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    offer: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    open: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    closed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    filled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    expired: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    verified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending_verification: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    info: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};
