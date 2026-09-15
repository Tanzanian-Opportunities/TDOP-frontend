import axiosInstance from './axiosInstance';
import { ApiResponse } from '@/types/api';

export interface UserDocument {
  id: number;
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentCreate {
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  description?: string;
}

export const documentApi = {
  getDocuments: async (): Promise<ApiResponse<UserDocument[]>> => {
    const { data } = await axiosInstance.get('/documents');
    return data;
  },

  getDocument: async (id: string): Promise<ApiResponse<UserDocument>> => {
    const { data } = await axiosInstance.get(`/documents/${id}`);
    return data;
  },

  uploadDocument: async (doc: DocumentCreate, file?: File): Promise<ApiResponse<UserDocument>> => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', doc.name);
      formData.append('documentType', doc.documentType);
      if (doc.description) formData.append('description', doc.description);
      const { data } = await axiosInstance.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
    const { data } = await axiosInstance.post('/documents', doc);
    return data;
  },

  updateDocument: async (id: string, updates: Partial<Pick<UserDocument, 'name' | 'description'>>): Promise<ApiResponse<UserDocument>> => {
    const { data } = await axiosInstance.put(`/documents/${id}`, updates);
    return data;
  },

  deleteDocument: async (id: string): Promise<ApiResponse<unknown>> => {
    await axiosInstance.delete(`/documents/${id}`);
    return { success: true };
  },
};
