import axiosInstance from './axiosInstance';

export interface AttentionData {
  pendingVerifications: number;
  pendingModeration: number;
  pendingReports: number;
  highRiskSignals: number;
  mediumRiskSignals: number;
  unreviewedSignals: number;
}

export interface TrustQueueData {
  verifications?: any[];
  moderation?: any[];
  reports?: any[];
  fraudSignals?: any[];
}

export interface TrustStats {
  pendingVerifications: number;
  pendingModeration: number;
  reportStats: {
    total: number;
    pending: number;
    reviewed: number;
    actioned: number;
  };
  fraudStats: {
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    unreviewed: number;
  };
}

export const trustApi = {
  getAttention: async (): Promise<AttentionData> => {
    const { data } = await axiosInstance.get('/trust/attention');
    return data;
  },

  getStats: async (): Promise<TrustStats> => {
    const { data } = await axiosInstance.get('/trust/stats');
    return data;
  },

  getQueue: async (type: string = 'all'): Promise<TrustQueueData> => {
    const { data } = await axiosInstance.get('/trust/queue', { params: { type } });
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

  requestModerationInfo: async (id: string, details: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/moderation/${id}/request-info`, null, {
      params: { details }
    });
    return data;
  },

  getReports: async (): Promise<any[]> => {
    const { data } = await axiosInstance.get('/admin/reports');
    return data;
  },

  getReportStats: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/admin/reports/stats');
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

  assignReport: async (id: string, investigatorId: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/admin/reports/${id}/assign`, null, {
      params: { investigatorId }
    });
    return data;
  },

  getAuditLog: async (): Promise<any[]> => {
    const { data } = await axiosInstance.get('/admin/audit');
    return data;
  },

  getFraudSignals: async (): Promise<any[]> => {
    const { data } = await axiosInstance.get('/admin/fraud/signals');
    return data;
  },

  reviewFraudSignal: async (id: string): Promise<any> => {
    const { data } = await axiosInstance.post(`/admin/fraud/signals/${id}/review`);
    return data;
  },
};
