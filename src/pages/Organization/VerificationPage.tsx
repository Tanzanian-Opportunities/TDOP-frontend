import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageError } from '@/components/ui/PageStates';
import { profileApi } from '@/services/api/profileApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { formatDate } from '@/utils/formatDate';
import { FileText, FileCheck, Clock, Upload, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import axiosInstance from '@/services/api/axiosInstance';

const VerificationPage: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await profileApi.getOrganizationProfile();
      setProfile(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      addNotification({ type: 'error', title: t('common.error'), message: t('verification.fileTooLarge') });
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('document', selectedFile);
      await axiosInstance.post('/verify', formData, {
        params: { orgId: profile?.id },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      addNotification({ type: 'success', title: t('common.success'), message: t('verification.submitted') });
      setSelectedFile(null);
      fetchProfile();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || t('verification.submitFailed') });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) return <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><PageError message={t('verification.loadError')} onRetry={fetchProfile} /></div>;

  const isVerified = profile?.verified === true;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <FileCheck className="w-8 h-8 text-tdop-primary" />
          {t('organization.verification')}
        </h1>
        <p className="text-gray-500 mt-1">{t('organization.submitVerification')}</p>
      </div>

      {/* Status Card */}
      <div className={`rounded-2xl border-2 p-6 ${isVerified ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center gap-4">
          {isVerified ? <CheckCircle className="w-6 h-6 text-tdop-secondary" /> : <Clock className="w-6 h-6 text-amber-500" />}
          <div>
            <h3 className="font-semibold text-tdop-navy text-lg">{t('verification.verificationStatus')}</h3>
            <Badge variant={isVerified ? 'success' : 'warning'}>
              {isVerified ? t('verification.verified') : t('verification.pendingReview')}
            </Badge>
          </div>
        </div>
        {profile?.verifiedAt && (
          <p className="text-sm text-gray-600 mt-3">
            {t('orgProfile.verifiedOn')} {formatDate(profile.verifiedAt)}
          </p>
        )}
      </div>

      {/* Upload Document */}
      {!isVerified && (
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-tdop-navy mb-1">{t('organization.uploadVerificationDoc')}</h3>
              <p className="text-sm text-gray-500">
                {t('organization.supportedFormats')}
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-tdop-primary/40 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              {selectedFile ? (
                <div>
                  <p className="text-sm font-medium text-tdop-navy">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-3">{t('organization.dragDrop')}</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                    <FileText className="w-4 h-4" />
                    {t('common.select')}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileSelect} className="hidden" />
                  </label>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3">PDF, JPG, PNG, DOC up to 10MB</p>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-3">
                <Button onClick={handleSubmit} loading={uploading}>
                  {isVerified ? t('common.submit') : t('organization.submitVerification')}
                </Button>
                <Button variant="outline" onClick={() => setSelectedFile(null)}>
                  {t('common.cancel')}
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Timeline */}
      {profile?.createdAt && (
        <Card>
          <h3 className="font-medium text-tdop-navy mb-4">{t('verification.verificationStatus')}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-tdop-primary" />
              <span className="text-gray-600">{t('organization.title')} registered</span>
              <span className="text-gray-400 ml-auto">{formatDate(profile.createdAt)}</span>
            </div>
            {isVerified && profile?.verifiedAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-tdop-secondary" />
                <span className="text-gray-600">{t('verification.verified')}</span>
                <span className="text-gray-400 ml-auto">{formatDate(profile.verifiedAt)}</span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default VerificationPage;
