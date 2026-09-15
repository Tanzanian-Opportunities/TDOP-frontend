import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocuments } from '@/hooks/useDocuments';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { FolderOpen, FileText, Upload, CheckCircle2, Trash2, Plus, X, File, Image, FileSpreadsheet } from 'lucide-react';

const DOC_TYPES = [
  { value: 'cv', labelKey: 'docCv', hintKey: 'docCvHint' },
  { value: 'cover_letter', labelKey: 'docCoverLetter', hintKey: 'docCoverLetterHint' },
  { value: 'transcript', labelKey: 'docTranscript', hintKey: 'docTranscriptHint' },
  { value: 'certificate', labelKey: 'docCertificate', hintKey: 'docCertificateHint' },
  { value: 'id_document', labelKey: 'docId', hintKey: 'docIdHint' },
  { value: 'portfolio', labelKey: 'docPortfolio', hintKey: 'docPortfolioHint' },
  { value: 'other', labelKey: 'docOther', hintKey: 'docOtherHint' },
];

const fileTypeIcons: Record<string, React.ElementType> = {
  'application/pdf': File,
  'image/png': Image,
  'image/jpeg': Image,
  'image/jpg': Image,
  'text/csv': FileSpreadsheet,
};

const SeekerDocumentsPage: React.FC = () => {
  const { t } = useTranslation();
  const { documents, isLoading, upload, removeDocument, isUploading } = useDocuments();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState('cv');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!selectedFile || !uploadName.trim()) return;
    await upload({
      name: uploadName.trim(),
      fileName: selectedFile.name,
      fileType: selectedFile.type || 'application/octet-stream',
      fileSize: selectedFile.size,
      documentType: uploadType,
    }, selectedFile);
    setShowUploadForm(false);
    setUploadName('');
    setUploadType('cv');
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    await removeDocument(id);
  };

  const groupedDocs = DOC_TYPES.map(type => ({
    ...type,
    docs: documents.filter(d => d.documentType === type.value),
  }));

  const totalDocs = documents.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tdop-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="rounded-3xl bg-tdop-primary p-8 text-white shadow-soft flex-1">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-8 h-8 text-tdop-accent" />
            <div>
              <h1 className="font-display text-3xl font-extrabold">{t('documents.title')}</h1>
              <p className="text-white/70 mt-1">
                {totalDocs > 0
                  ? t('documents.subtitleCount', { count: totalDocs, defaultValue: `${totalDocs} document(s) uploaded` })
                  : t('documents.subtitle')}
              </p>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowUploadForm(true)} className="ml-4 shrink-0">
          <Plus className="w-4 h-4 mr-1.5" />
          {t('documents.uploadNew', 'Upload')}
        </Button>
      </div>

      {showUploadForm && (
        <Card className="border-2 border-tdop-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-tdop-navy">{t('documents.uploadNew', 'Upload New Document')}</h3>
            <button onClick={() => { setShowUploadForm(false); setSelectedFile(null); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <Input
              label={t('documents.nameLabel', 'Document Name')}
              placeholder={t('documents.namePlaceholder', 'e.g. My CV - Latest')}
              value={uploadName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadName(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('documents.typeLabel', 'Document Type')}</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-tdop-navy focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary"
              >
                {DOC_TYPES.map(dt => (
                  <option key={dt.value} value={dt.value}>{t(`documents.${dt.labelKey}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('documents.fileLabel', 'File')}</label>
              <label className="flex items-center justify-center gap-2 w-full px-4 py-8 rounded-xl border-2 border-dashed border-gray-200 hover:border-tdop-primary/40 bg-gray-50 hover:bg-tdop-primary/[0.02] cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : t('documents.dropOrClick', 'Drop file here or click to browse')}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) setSelectedFile(f);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => { setShowUploadForm(false); setSelectedFile(null); }}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleUpload} loading={isUploading} disabled={!selectedFile || !uploadName.trim()}>
                <Upload className="w-4 h-4 mr-1.5" />
                {t('documents.upload')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {documents.length === 0 && !showUploadForm ? (
        <Card className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-tdop-navy mb-2">{t('documents.empty', 'No documents yet')}</h3>
          <p className="text-gray-500 mb-4">{t('documents.emptyHint', 'Upload your CV, certificates, and other documents to attach them to applications.')}</p>
          <Button onClick={() => setShowUploadForm(true)}>
            <Upload className="w-4 h-4 mr-1.5" />
            {t('documents.uploadFirst', 'Upload your first document')}
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {groupedDocs.map(group => {
            if (group.docs.length === 0) return null;
            return (
              <div key={group.value}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {t(`documents.${group.labelKey}`)}
                </h3>
                <div className="space-y-2">
                  {group.docs.map(doc => {
                    const FileIcon = fileTypeIcons[doc.fileType] || FileText;
                    return (
                      <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-tdop-primary/10 text-tdop-primary flex items-center justify-center shrink-0">
                          <FileIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-tdop-navy truncate">{doc.name}</h4>
                          <p className="text-xs text-gray-400 truncate">{doc.fileName} {doc.fileSize ? `· ${formatFileSize(doc.fileSize)}` : ''}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(String(doc.id))}
                          aria-label={`${t('documents.remove')} ${doc.name}`}
                          className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default SeekerDocumentsPage;
