import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageError } from '@/components/ui/PageStates';
import { profileApi } from '@/services/api/profileApi';
import { formatDate } from '@/utils/formatDate';
import { FileText, FileCheck, Clock, Upload, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const VerificationPage: React.FC = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await profileApi.getOrganizationProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('document', selectedFile);
      const { default: axiosInstance } = await import('@/services/api/axiosInstance');
      await axiosInstance.post('/organization/verification/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSelectedFile(null);
      fetchProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const statusConfig: Record<string, { label: string; variant: string; icon: React.ReactNode; color: string }> = {
    verified: {
      label: 'Verified',
      variant: 'success',
      icon: <CheckCircle className="w-6 h-6 text-tdop-secondary" />,
      color: 'bg-emerald-50 border-emerald-200',
    },
    pending: {
      label: 'Pending Review',
      variant: 'warning',
      icon: <Clock className="w-6 h-6 text-amber-500" />,
      color: 'bg-amber-50 border-amber-200',
    },
    rejected: {
      label: 'Rejected',
      variant: 'danger',
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      color: 'bg-red-50 border-red-200',
    },
  };

  const status = profile?.verificationStatus || 'pending';
  const config = statusConfig[status] || statusConfig.pending;

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

  if (error) return <PageError message="Failed to load verification data. Please try again." onRetry={fetchProfile} />;

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
      <div className={`rounded-2xl border-2 p-6 ${config.color}`}>
        <div className="flex items-center gap-4">
          {config.icon}
          <div>
            <h3 className="font-semibold text-tdop-navy text-lg">Verification Status</h3>
            <Badge variant={config.variant as any}>{config.label}</Badge>
          </div>
        </div>
        {profile?.verifiedAt && (
          <p className="text-sm text-gray-600 mt-3">
            Verified on {formatDate(profile.verifiedAt)}
          </p>
        )}
        {status === 'rejected' && (
          <div className="mt-3 p-3 bg-white/60 rounded-xl">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Your verification was rejected. Please review the feedback and resubmit with updated documents.
            </p>
          </div>
        )}
      </div>

      {/* Upload Document */}
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-tdop-navy mb-1">{t('organization.uploadVerificationDoc')}</h3>
            <p className="text-sm text-gray-500">
              Upload your organization registration certificate, tax ID, or other official documents.
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
                <p className="text-sm text-gray-500 mb-3">
                  Drag and drop or click to select a file
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                  <FileText className="w-4 h-4" />
                  Select file
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-3">
              PDF, JPG, PNG, DOC up to 10MB
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-3">
              <Button onClick={handleSubmit} loading={uploading}>
                {status === 'rejected' ? 'Resubmit' : 'Submit for verification'}
              </Button>
              <Button variant="outline" onClick={() => setSelectedFile(null)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Timeline */}
      {profile?.createdAt && (
        <Card>
          <h3 className="font-medium text-tdop-navy mb-4">Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-tdop-primary" />
              <span className="text-gray-600">Organization registered</span>
              <span className="text-gray-400 ml-auto">{formatDate(profile.createdAt)}</span>
            </div>
            {status !== 'pending' && profile?.verifiedAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full ${status === 'verified' ? 'bg-tdop-secondary' : 'bg-red-500'}`} />
                <span className="text-gray-600">
                  Verification {status === 'verified' ? 'approved' : 'rejected'}
                </span>
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
