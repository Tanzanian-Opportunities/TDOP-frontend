import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentApi, DocumentCreate, UserDocument } from '@/services/api/documentApi';

export const useDocuments = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentApi.getDocuments(),
    refetchOnWindowFocus: false,
  });

  const uploadMutation = useMutation({
    mutationFn: (doc: DocumentCreate) => documentApi.uploadDocument(doc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const upload = useCallback(async (doc: DocumentCreate) => {
    return uploadMutation.mutateAsync(doc);
  }, [uploadMutation]);

  const removeDocument = useCallback(async (id: string) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const documents: UserDocument[] = (data as any)?.data || (Array.isArray((data as any)?.data) ? (data as any).data : []);

  return {
    documents,
    isLoading,
    refetch,
    upload,
    removeDocument,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
