import axiosInstance from './axiosInstance';

export interface PlatformAttention {
  pendingVerifications: number;
  pendingReports: number;
  highRiskSignals: number;
  openEscalations: number;
  pendingAppeals: number;
  totalAttention: number;
}

export interface PlatformHealth {
  [key: string]: { status: string; description: string };
}

export interface PlatformPulse {
  users: { total: number; admins: number; superAdmins: number; organizations: number; seekers: number; verificationOfficers: number; moderators: number };
  organizations: { total: number; verified: number };
  opportunities: { total: number; published: number; draft: number; expired: number; suspended: number };
  applications: { total: number };
  reports: { total: number; pending: number };
  escalations: { open: number };
  appeals: { pending: number };
}

export interface UserRoleAssignment {
  role: string;
  userCount: number;
  description: string;
}

export interface PrivilegedAccess {
  userId: number;
  email: string;
  fullName: string;
  role: string;
  enabled: boolean;
  verified: boolean;
  createdAt: string;
}

export interface EcosystemIntelligence {
  platformStats: any;
  opportunityAnalytics: any;
  reportAnalytics: any;
  platformActivity: any;
}

export interface SecurityOverview {
  totalUsers: number;
  enabledUsers: number;
  disabledUsers: number;
  unverifiedUsers: number;
  highRiskSignals: number;
  mediumRiskSignals: number;
  unreviewedSignals: number;
  recentAuditLogs: any[];
}

export interface GovernanceChangeLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  userId: number;
  timestamp: string;
  oldValue: string;
  newValue: string;
}

export interface TaxonomyOverview {
  categories: string[];
  categoryCount: number;
  locations: string[];
  types: string[];
  note: string;
}

export const superAdminApi = {
  getPlatformAttention: async (): Promise<PlatformAttention> => {
    const { data } = await axiosInstance.get('/admin/super/platform-attention');
    return data;
  },

  getPlatformHealth: async (): Promise<PlatformHealth> => {
    const { data } = await axiosInstance.get('/admin/super/platform-health');
    return data;
  },

  getPlatformPulse: async (): Promise<PlatformPulse> => {
    const { data } = await axiosInstance.get('/admin/super/platform-pulse');
    return data;
  },

  getUserRoleAssignments: async (): Promise<UserRoleAssignment[]> => {
    const { data } = await axiosInstance.get('/admin/super/user-role-assignments');
    return data;
  },

  getPrivilegedAccess: async (): Promise<PrivilegedAccess[]> => {
    const { data } = await axiosInstance.get('/admin/super/privileged-access');
    return data;
  },

  getEcosystemIntelligence: async (): Promise<EcosystemIntelligence> => {
    const { data } = await axiosInstance.get('/admin/super/ecosystem-intelligence');
    return data;
  },

  getSecurityOverview: async (): Promise<SecurityOverview> => {
    const { data } = await axiosInstance.get('/admin/super/security-overview');
    return data;
  },

  getGovernanceChangeLog: async (): Promise<GovernanceChangeLog[]> => {
    const { data } = await axiosInstance.get('/admin/super/governance-change-log');
    return data;
  },

  getTaxonomyOverview: async (): Promise<TaxonomyOverview> => {
    const { data } = await axiosInstance.get('/admin/super/taxonomy-overview');
    return data;
  },

  getUsers: async (params?: { page?: number; limit?: number; role?: string }): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/super/platform-stats', { params });
    return data;
  },

  getConfig: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/config');
    return data;
  },

  setConfig: async (key: string, value: string, description?: string): Promise<any> => {
    const { data } = await axiosInstance.put(`/admin/config/${key}`, null, {
      params: { value, description }
    });
    return data;
  },
};
