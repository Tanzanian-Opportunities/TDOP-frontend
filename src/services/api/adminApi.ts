import axiosInstance from './axiosInstance';
import { User } from '@/types/user';
import { PaginatedApiResponse } from '@/types/opportunity';
import { ApiResponse } from '@/types/api';

export const adminApi = {
  // User Management
  getUsers: async (params?: { page?: number; limit?: number; role?: string }): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/users', { params });
    return data;
  },
  getUser: async (id: string): Promise<any> => {
    const { data } = await axiosInstance.get(`/admin/users/${id}`);
    return data;
  },
  suspendUser: async (id: string): Promise<any> => {
    const { data } = await axiosInstance.put(`/admin/users/${id}/suspend`);
    return data;
  },
  updateUserRole: async (id: string, role: string): Promise<any> => {
    const { data } = await axiosInstance.put(`/admin/users/${id}/role`, null, { params: { role } });
    return data;
  },

  // Analytics
  getDashboardStats: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/analytics/dashboard');
    return data;
  },
  getAnalytics: async (params?: { dateFrom?: string; dateTo?: string }): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/analytics', { params });
    return data;
  },
  getOpportunityAnalytics: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/opportunities/analytics');
    return data;
  },

  // Opportunity Moderation
  getPendingModeration: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/opportunities');
    return data;
  },
  verifyOpportunity: async (id: string, approved: boolean, reason?: string): Promise<any> => {
    const { data } = await axiosInstance.put(`/admin/opportunities/${id}/verify`, null, {
      params: { approved, reason }
    });
    return data;
  },
  moderateOpportunity: async (id: string, action: string, reason?: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/admin/opportunities/${id}/moderate`, null, {
      params: { action, reason }
    });
    return data;
  },
  suspendOpportunity: async (id: string, reason?: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/admin/opportunities/${id}/suspend`, null, {
      params: { reason }
    });
    return data;
  },
  getOpportunityModerationQueue: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/opportunities/moderation-queue');
    return data;
  },

  // Reports
  getReports: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/reports');
    return data;
  },
  getAllReports: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/reports/all');
    return data;
  },
  getReportStats: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/reports/stats');
    return data;
  },
  assignReport: async (id: string, investigatorId: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/admin/reports/${id}/assign`, null, {
      params: { investigatorId }
    });
    return data;
  },
  resolveReport: async (id: string, resolution: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/admin/reports/${id}/resolve`, null, {
      params: { resolution }
    });
    return data;
  },
  dismissReport: async (id: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/admin/reports/${id}/dismiss`);
    return data;
  },

  // Audit Log
  getAuditLog: async (params?: { page?: number; limit?: number; action?: string; entityType?: string }): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/audit', { params });
    return data;
  },

  // Organizations
  getOrganizations: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/organizations');
    return data;
  },
  getOrganization: async (id: string): Promise<any> => {
    const { data } = await axiosInstance.get(`/admin/organizations/${id}`);
    return data;
  },
  getOrganizationStats: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/organizations/stats');
    return data;
  },

  // Verification Officer
  getVerificationQueue: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/verification-officer/queue');
    return data;
  },
  approveVerification: async (id: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/verification-officer/${id}/approve`);
    return data;
  },
  rejectVerification: async (id: string, reason?: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/verification-officer/${id}/reject`, null, {
      params: { reason }
    });
    return data;
  },
  requestVerificationInfo: async (id: string, information: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/verification-officer/${id}/request-info`, null, {
      params: { information }
    });
    return data;
  },
  getVerificationStats: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/verification-officer/stats');
    return data;
  },

  // Moderation
  getModerationQueue: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/moderation/queue');
    return data;
  },
  approveModeration: async (id: string, reason?: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/moderation/${id}/approve`, null, {
      params: { reason }
    });
    return data;
  },
  rejectModeration: async (id: string, reason?: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/moderation/${id}/reject`, null, {
      params: { reason }
    });
    return data;
  },
  suspendModeration: async (id: string, reason?: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/moderation/${id}/suspend`, null, {
      params: { reason }
    });
    return data;
  },

  // Fraud / Anti-Fraud
  getFraudSignals: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/fraud/signals');
    return data;
  },
  getFraudStats: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/fraud/stats');
    return data;
  },
  reviewFraudSignal: async (id: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/admin/fraud/signals/${id}/review`);
    return data;
  },

  // Platform Config
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

  // Super Admin
  getRoles: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/super/roles');
    return data;
  },
  getPermissions: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/super/permissions');
    return data;
  },
  assignRole: async (userId: string, roleId: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/admin/super/users/${userId}/roles/${roleId}`);
    return data;
  },
  getUserPermissions: async (userId: string): Promise<any> => {
    const { data } = await axiosInstance.get(`/admin/super/users/${userId}/permissions`);
    return data;
  },
};
