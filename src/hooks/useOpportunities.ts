import { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { opportunityApi } from '@/services/api/opportunityApi';
import { Opportunity, OpportunityFilter } from '@/types/opportunity';
import { useDebounce } from './useDebounce';

export const useOpportunities = () => {
  const [filters, setFilters] = useState<OpportunityFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const queryClient = useQueryClient();

  const queryParams = useMemo(() => ({
    ...filters,
    search: debouncedSearch || undefined,
    page: filters.page || 1,
    limit: filters.limit || 12,
  }), [filters, debouncedSearch]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['opportunities', queryParams],
    queryFn: () => opportunityApi.getOpportunities(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const { data: savedData } = useQuery({
    queryKey: ['saved-opportunities'],
    queryFn: () => opportunityApi.getSavedOpportunities(),
    enabled: !!localStorage.getItem('tdop-tokens'),
    refetchOnWindowFocus: false,
  });

  const search = useCallback((query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const setFilter = useCallback((key: keyof OpportunityFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  const saveOpportunity = useCallback(async (id: string) => {
    await opportunityApi.saveOpportunity(id);
    queryClient.invalidateQueries({ queryKey: ['saved-opportunities'] });
    queryClient.invalidateQueries({ queryKey: ['opportunities'] });
  }, [queryClient]);

  const unsaveOpportunity = useCallback(async (id: string) => {
    await opportunityApi.unsaveOpportunity(id);
    queryClient.invalidateQueries({ queryKey: ['saved-opportunities'] });
  }, [queryClient]);

  const compareOpportunities = useCallback(async (ids: string[]) => {
    const { data } = await opportunityApi.compareOpportunities(ids);
    return data ?? [];
  }, []);

  return {
    opportunities: data?.data || [],
    total: data?.pagination?.total || 0,
    page: data?.pagination?.page || 1,
    totalPages: data?.pagination?.totalPages || 0,
    isLoading,
    isError,
    error,
    refetch,
    search,
    searchQuery,
    filters,
    setFilter,
    clearFilters,
    saveOpportunity,
    unsaveOpportunity,
    compareOpportunities,
    savedOpportunities: savedData?.data || [],
  };
};
