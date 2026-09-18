import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentApi, UserDocument } from '@/services/api/documentApi';

export const useDocuments = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentApi.getDocuments(),
    refetchOnWindowFocus: false,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, name, documentType, description }: { file: File; name: string; documentType: string; description?: string }) =>
      documentApi.uploadDocument(file, name, documentType, description),
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

  const upload = useCallback(async (file: File, name: string, documentType: string, description?: string) => {
    return uploadMutation.mutateAsync({ file, name, documentType, description });
  }, [uploadMutation]);

  const removeDocument = useCallback(async (id: string) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const documents: UserDocument[] = Array.isArray(data) ? data : [];

  return {
    documents,
    isLoading,
    isError,
    refetch,
    upload,
    removeDocument,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
