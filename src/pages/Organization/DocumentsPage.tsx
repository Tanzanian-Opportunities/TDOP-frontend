import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { PageError } from '@/components/ui/PageStates';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { documentApi, UserDocument } from '@/services/api/documentApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { formatDate } from '@/utils/formatDate';
import { FileText, Upload, Download, Trash2, Search, File, FileImage, File as FileIcon } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const docTypeIcons: Record<string, string> = {
  'verification': 'Shield',
  'resume': 'FileText',
  'certificate': 'Award',
  'identity': 'User',
};

const DocumentsPage: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('general');
  const [docDesc, setDocDesc] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchDocuments(); }, []);

  const fetchDocuments = async () => {
    try {
      const data = await documentApi.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !docName.trim()) return;
    setUploading(true);
    try {
      await documentApi.uploadDocument(selectedFile, docName.trim(), docType, docDesc.trim() || undefined);
      addNotification({ type: 'success', title: t('common.success'), message: t('documents.uploadSuccess') });
      setShowUpload(false);
      setSelectedFile(null);
      setDocName('');
      setDocDesc('');
      fetchDocuments();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || t('documents.uploadFailed') });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: UserDocument) => {
    try {
      const blob = await documentApi.downloadDocument(doc.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || t('documents.downloadFailed') });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await documentApi.deleteDocument(deleteId);
      addNotification({ type: 'success', title: t('common.success'), message: t('documents.deleteSuccess') });
      setDeleteId(null);
      fetchDocuments();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || t('documents.deleteFailed') });
    } finally {
      setDeleting(false);
    }
  };

  const filtered = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.documentType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><PageError message={t('common.errorLoading')} onRetry={fetchDocuments} /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
            <FileText className="w-8 h-8 text-tdop-primary" />
            {t('documents.title')}
          </h1>
          <p className="text-gray-500 mt-1">{t('documents.description')}</p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Upload className="w-4 h-4 mr-2" /> {t('documents.upload')}
        </Button>
      </div>

      {showUpload && (
        <Card>
          <div className="space-y-4">
            <h3 className="font-semibold text-tdop-navy">{t('documents.uploadDocument')}</h3>
            <Input label={t('documents.documentName')} value={docName} onChange={(e: any) => setDocName(e.target.value)} placeholder={t('documents.namePlaceholder')} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('documents.documentType')}</label>
              <select value={docType} onChange={(e) => setDocType(e.target.value)} className="block w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-tdop-navy focus:ring-2 focus:ring-tdop-primary focus:border-tdop-primary outline-none">
                <option value="general">{t('documents.types.general')}</option>
                <option value="verification">{t('documents.types.verification')}</option>
                <option value="resume">{t('documents.types.resume')}</option>
                <option value="certificate">{t('documents.types.certificate')}</option>
                <option value="identity">{t('documents.types.identity')}</option>
              </select>
            </div>
            <Input label={t('documents.description')} value={docDesc} onChange={(e: any) => setDocDesc(e.target.value)} placeholder={t('documents.descriptionPlaceholder')} />
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-tdop-primary/40 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              {selectedFile ? (
                <p className="text-sm text-tdop-navy font-medium">{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
              ) : (
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  {t('documents.chooseFile')}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="hidden" />
                </label>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleUpload} loading={uploading} disabled={!selectedFile || !docName.trim()}>
                {t('documents.upload')}
              </Button>
              <Button variant="outline" onClick={() => { setShowUpload(false); setSelectedFile(null); }}>
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder={t('documents.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8 text-gray-300" />}
          title={documents.length === 0 ? t('documents.noDocuments') : t('common.noResults')}
          description={documents.length === 0 ? t('documents.noDocumentsDescription') : t('common.tryAgain')}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(doc => (
            <Card key={doc.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-tdop-light flex items-center justify-center">
                    <FileIcon className="w-5 h-5 text-tdop-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-tdop-navy">{doc.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Badge variant="gray" size="sm">{doc.documentType}</Badge>
                      <span>{formatDate(doc.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setDeleteId(doc.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('documents.deleteConfirm')}
        message={t('documents.deleteConfirmMessage')}
        confirmLabel={t('common.delete')}
        loading={deleting}
      />
    </div>
  );
};

export default DocumentsPage;
