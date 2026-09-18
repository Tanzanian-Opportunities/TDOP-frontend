import axiosInstance from './axiosInstance';

export interface UserDocument {
  id: string;
  name: string;
  documentType: string;
  description?: string;
  fileUrl: string;
  fileSize?: number;
  uploadedAt: string;
  updatedAt?: string;
}

export const documentApi = {
  getDocuments: async (): Promise<UserDocument[]> => {
    const { data } = await axiosInstance.get('/documents');
    return Array.isArray(data) ? data : data?.data || [];
  },

  getDocument: async (id: string): Promise<UserDocument> => {
    const { data } = await axiosInstance.get(`/documents/${id}`);
    return data;
  },

  uploadDocument: async (file: File, name: string, documentType: string, description?: string): Promise<UserDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('documentType', documentType);
    if (description) formData.append('description', description);
    const { data } = await axiosInstance.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updateDocument: async (id: string, updates: { name?: string; description?: string }): Promise<UserDocument> => {
    const { data } = await axiosInstance.put(`/documents/${id}`, updates);
    return data;
  },

  deleteDocument: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/documents/${id}`);
  },

  downloadDocument: async (id: string): Promise<Blob> => {
    const { data } = await axiosInstance.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return data;
  },
};
