import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderOpen, FileText, Upload, CheckCircle2, Trash2, Plus } from 'lucide-react';

interface DocSlot {
  id: string;
  labelKey: string;
  hintKey: string;
}

const DOCS: DocSlot[] = [
  { id: 'cv', labelKey: 'docCv', hintKey: 'docCvHint' },
  { id: 'cover-letter', labelKey: 'docCoverLetter', hintKey: 'docCoverLetterHint' },
  { id: 'transcript', labelKey: 'docTranscript', hintKey: 'docTranscriptHint' },
  { id: 'certificate', labelKey: 'docCertificate', hintKey: 'docCertificateHint' },
  { id: 'id', labelKey: 'docId', hintKey: 'docIdHint' },
];

const STORAGE_KEY = 'tdop-documents';

const SeekerDocumentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [docs, setDocs] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  });

  const persist = (next: Record<string, string>) => {
    setDocs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const upload = (id: string, file: File) => {
    persist({ ...docs, [id]: file.name });
  };

  const remove = (id: string) => {
    const next = { ...docs };
    delete next[id];
    persist(next);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="rounded-3xl bg-gradient-to-br from-tdop-navy via-tdop-royal to-tdop-royalLight p-8 text-white shadow-navy">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-8 h-8 text-tdop-gold" />
          <div>
            <h1 className="font-display text-3xl font-extrabold">{t('documents.title')}</h1>
            <p className="text-white/70 mt-1">{t('documents.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {DOCS.map(doc => {
          const uploaded = docs[doc.id];
          return (
            <div key={doc.id} className="bg-white dark:bg-gray-800/70 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-tdop-pastel-jobs text-tdop-royalLight flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-tdop-royal dark:text-white">{t(`documents.${doc.labelKey}`)}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t(`documents.${doc.hintKey}`)}</p>
              </div>

              {uploaded ? (
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium truncate max-w-[180px]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {uploaded}
                  </span>
                  <button
                    onClick={() => remove(doc.id)}
                    aria-label={`${t('documents.remove')} ${t(`documents.${doc.labelKey}`)}`}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-tdop-primary hover:bg-tdop-royalLight text-white text-sm font-medium cursor-pointer transition-colors w-full sm:w-auto">
                  <Upload className="w-4 h-4" />
                  {t('documents.upload')}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) upload(doc.id, f);
                      e.target.value = '';
                    }}
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
        <Plus className="w-8 h-8 mx-auto text-gray-300" />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('documents.moreText')}</p>
      </div>
    </div>
  );
};

export default SeekerDocumentsPage;