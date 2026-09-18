import axiosInstance from './axiosInstance';
import {
  Opportunity,
  OpportunityCreate,
  OpportunityFilter,
  PaginatedApiResponse,
} from '@/types/opportunity';
import { ApiResponse } from '@/types/api';

const normalizeList = <T>(list: T[]): PaginatedApiResponse<T> => ({
  success: true,
  data: Array.isArray(list) ? list : [],
  pagination: {
    page: 1,
    limit: Array.isArray(list) ? list.length : 0,
    total: Array.isArray(list) ? list.length : 0,
    totalPages: 1,
  },
});

const TYPE_MAP: Record<string, string> = {
  internship: 'INTERNSHIP',
  'full-time': 'FULL_TIME',
  'part-time': 'PART_TIME',
  freelance: 'CONTRACT',
  volunteer: 'VOLUNTEER',
  apprenticeship: 'CONTRACT',
};

const toBackendPayload = (data: OpportunityCreate) => ({
  title: data.title,
  description: data.description,
  location: data.location,
  type: TYPE_MAP[data.type] || 'FULL_TIME',
  category: data.category,
  salaryRange: data.salaryMin || data.salaryMax
    ? `${data.salaryMin ?? ''}-${data.salaryMax ?? ''}`.replace(/^-/, '')
    : undefined,
  tags: Array.isArray(data.tags) ? data.tags.join(',') : data.tags,
  deadline: data.applicationDeadline
    ? `${data.applicationDeadline}T23:59:59`
    : undefined,
  workMode: data.isRemote ? 'REMOTE' : 'ONSITE',
  educationLevel: data.educationLevel,
  experienceLevel: data.experienceLevel,
  requirements: Array.isArray(data.requirements) ? data.requirements.join(', ') : data.requirements,
  benefits: Array.isArray(data.benefits) ? data.benefits.join(', ') : data.benefits,
});

export const opportunityApi = {
  getOpportunities: async (params?: OpportunityFilter): Promise<PaginatedApiResponse<Opportunity>> => {
    if (params?.category) {
      const { data } = await axiosInstance.get(`/opportunities/filter/${params.category}`);
      return normalizeList(data);
    }
    if (params?.search) {
      const { data } = await axiosInstance.get('/opportunities/search', { params: { keyword: params.search } });
      return normalizeList(data);
    }
    const { data } = await axiosInstance.get('/opportunities');
    return normalizeList(data);
  },
  getOpportunity: async (id: string): Promise<ApiResponse<Opportunity>> => {
    const { data } = await axiosInstance.get(`/opportunities/${id}`);
    return { success: true, data };
  },
  createOpportunity: async (data: OpportunityCreate): Promise<ApiResponse<Opportunity>> => {
    const profileRes = await axiosInstance.get('/organization/profile');
    const orgId = profileRes.data?.id;
    const { data: response } = await axiosInstance.post('/organization/opportunities', toBackendPayload(data), {
      params: { orgId },
    });
    return { success: true, data: response };
  },
  updateOpportunity: async (id: string, data: Partial<OpportunityCreate>): Promise<ApiResponse<Opportunity>> => {
    const { data: response } = await axiosInstance.put(`/organization/opportunities/${id}`, toBackendPayload(data as OpportunityCreate));
    return { success: true, data: response };
  },
  deleteOpportunity: async (id: string): Promise<ApiResponse<unknown>> => {
    await axiosInstance.delete(`/organization/opportunities/${id}`);
    return { success: true };
  },
  searchOpportunities: async (query: string): Promise<PaginatedApiResponse<Opportunity>> => {
    const { data } = await axiosInstance.get('/opportunities/search', { params: { keyword: query } });
    return normalizeList(data);
  },
  filterOpportunities: async (filters: OpportunityFilter): Promise<PaginatedApiResponse<Opportunity>> => {
    if (filters.category) {
      const { data } = await axiosInstance.get(`/opportunities/filter/${filters.category}`);
      return normalizeList(data);
    }
    const { data } = await axiosInstance.get('/opportunities');
    return normalizeList(data);
  },
  saveOpportunity: async (id: string): Promise<ApiResponse<{ saved: boolean }>> => {
    const { data } = await axiosInstance.post('/saved', null, { params: { oppId: id } });
    return { success: true, data };
  },
  unsaveOpportunity: async (id: string): Promise<ApiResponse<{ saved: boolean }>> => {
    const { data } = await axiosInstance.delete('/saved', { params: { oppId: id } });
    return { success: true, data };
  },
  getSavedOpportunities: async (): Promise<PaginatedApiResponse<Opportunity>> => {
    const { data } = await axiosInstance.get('/saved');
    return normalizeList(data);
  },
  compareOpportunities: async (ids: string[]): Promise<ApiResponse<Opportunity[]>> => {
    const { data } = await axiosInstance.post('/compare', null, { params: { ids: ids.join(',') } });
    return { success: true, data };
  },
  getMyOpportunities: async (): Promise<PaginatedApiResponse<Opportunity>> => {
    const profileRes = await axiosInstance.get('/organization/profile');
    const orgId = profileRes.data?.id;
    if (!orgId) return normalizeList([]);
    const { data } = await axiosInstance.get('/organization/opportunities', { params: { orgId } });
    return normalizeList(data);
  },
  verifyOpportunity: async (id: string): Promise<ApiResponse<{ verified: boolean }>> => {
    const { data } = await axiosInstance.put(`/admin/opportunities/${id}/verify`, null, {
      params: { approved: true },
    });
    return { success: true, data: { verified: true } };
  },
  submitOpportunity: async (id: string): Promise<ApiResponse<Opportunity>> => {
    const { data } = await axiosInstance.post(`/organization/opportunities/${id}/submit`);
    return { success: true, data };
  },
  publishOpportunity: async (id: string): Promise<ApiResponse<Opportunity>> => {
    const { data } = await axiosInstance.post(`/organization/opportunities/${id}/publish`);
    return { success: true, data };
  },
};