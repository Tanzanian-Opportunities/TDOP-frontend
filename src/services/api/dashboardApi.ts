import axiosInstance from './axiosInstance';

export interface DashboardData {
  savedCount: number;
  applicationCount: number;
  unreadNotificationCount: number;
  profileCompletion: number;
  availableOpportunities: number;
  upcomingDeadlines: UpcomingDeadline[];
  recentApplications: RecentApplication[];
  applicationStats: Record<string, number>;
  applicationReadiness: ApplicationReadiness;
}

export interface ApplicationReadiness {
  percentage: number;
  checks: ReadinessCheck[];
}

export interface ReadinessCheck {
  label: string;
  done: boolean;
}

export interface UpcomingDeadline {
  id: number;
  title: string;
  type: string;
  location: string;
  deadline: string;
  category: string;
  isSaved: boolean;
  isApplied: boolean;
}

export interface RecentApplication {
  id: number;
  status: string;
  appliedAt: string;
  opportunityId: number;
  opportunityTitle: string;
  organizationName: string;
  opportunityType: string;
}

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const { data } = await axiosInstance.get('/dashboard');
    return data;
  },

  getQuickStats: async (): Promise<Record<string, number>> => {
    const { data } = await axiosInstance.get('/dashboard/stats');
    return data;
  },

  getUpcomingDeadlines: async (): Promise<UpcomingDeadline[]> => {
    const { data } = await axiosInstance.get('/dashboard/deadlines');
    return data;
  },

  getRecentApplications: async (): Promise<RecentApplication[]> => {
    const { data } = await axiosInstance.get('/dashboard/applications');
    return data;
  },

  getApplicationStats: async (): Promise<Record<string, number>> => {
    const { data } = await axiosInstance.get('/dashboard/application-stats');
    return data;
  },

  getApplicationReadiness: async (): Promise<ApplicationReadiness> => {
    const { data } = await axiosInstance.get('/dashboard/application-readiness');
    return data;
  },

  getUnreadNotificationCount: async (): Promise<number> => {
    const { data } = await axiosInstance.get('/notifications/unread-count');
    return data.count;
  },
};
