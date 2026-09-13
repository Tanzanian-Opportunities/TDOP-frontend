import axiosInstance from './axiosInstance';
import {
  Opportunity,
  OpportunityCreate,
  OpportunityFilter,
  PaginatedApiResponse,
} from '@/types/opportunity';
import { ApiResponse } from '@/types/api';

export const opportunityApi = {
  getOpportunities: async (params?: OpportunityFilter): Promise<PaginatedApiResponse<Opportunity>> => {
    const { data } = await axiosInstance.get('/opportunities', { params });
    return data;
  },
  getOpportunity: async (id: string): Promise<ApiResponse<Opportunity>> => {
    const { data } = await axiosInstance.get(`/opportunities/${id}`);
    return data;
  },
  createOpportunity: async (data: OpportunityCreate): Promise<ApiResponse<Opportunity>> => {
    const { data: response } = await axiosInstance.post('/opportunities', data);
    return response;
  },
  updateOpportunity: async (id: string, data: Partial<OpportunityCreate>): Promise<ApiResponse<Opportunity>> => {
    const { data: response } = await axiosInstance.put(`/opportunities/${id}`, data);
    return response;
  },
  deleteOpportunity: async (id: string): Promise<ApiResponse<unknown>> => {
    await axiosInstance.delete(`/opportunities/${id}`);
    return { success: true };
  },
  searchOpportunities: async (query: string): Promise<PaginatedApiResponse<Opportunity>> => {
    const { data } = await axiosInstance.get('/opportunities/search', { params: { keyword: query } });
    return data;
  },
  filterOpportunities: async (filters: OpportunityFilter): Promise<PaginatedApiResponse<Opportunity>> => {
    const { data } = await axiosInstance.get('/opportunities/filter', { params: filters });
    return data;
  },
  saveOpportunity: async (id: string): Promise<ApiResponse<{ saved: boolean }>> => {
    const { data } = await axiosInstance.post('/saved', null, { params: { oppId: id } });
    return data;
  },
  unsaveOpportunity: async (id: string): Promise<ApiResponse<{ saved: boolean }>> => {
    const { data } = await axiosInstance.delete('/saved', { params: { oppId: id } });
    return data;
  },
  getSavedOpportunities: async (): Promise<PaginatedApiResponse<Opportunity>> => {
    const { data } = await axiosInstance.get('/saved');
    return data;
  },
  compareOpportunities: async (ids: string[]): Promise<ApiResponse<Opportunity[]>> => {
    const { data } = await axiosInstance.post('/compare', { ids });
    return data;
  },
  getMyOpportunities: async (): Promise<PaginatedApiResponse<Opportunity>> => {
    const { data } = await axiosInstance.get('/opportunities/my');
    return data;
  },
  verifyOpportunity: async (id: string): Promise<ApiResponse<{ verified: boolean }>> => {
    const { data } = await axiosInstance.post(`/opportunities/${id}/verify`);
    return data;
  },
};
