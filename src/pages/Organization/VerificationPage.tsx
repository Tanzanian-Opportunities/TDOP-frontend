import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatDate';
import { FileText, FileCheck, Clock, Upload } from 'lucide-react';

const VerificationPage: React.FC = () => {
  const { t } = useTranslation();

  const mockVerification = {
    status: 'pending' as string,
    documentUrl: '',
    submittedAt: '2024-01-15',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy">{t('organization.verification')}</h1>
        <p className="text-gray-500 mt-1">{t('organization.submitVerification')}</p>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <FileText className="w-8 h-8 text-tdop-primary" />
            <div>
              <h3 className="font-semibold text-tdop-navy">{t('profile.verificationStatus')}</h3>
              <Badge variant={mockVerification.status === 'verified' ? 'verified' : 'warning'}>
                {mockVerification.status.charAt(0).toUpperCase() + mockVerification.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-tdop-navy">Submitted</p>
                  <p className="text-xs text-gray-500">{formatDate(mockVerification.submittedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-tdop-navy mb-2">{t('organization.uploadVerificationDoc')}</h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t('organization.dragDrop')}</p>
              <Button variant="outline" size="sm">
                {t('common.select')} File
              </Button>
              <p className="text-xs text-gray-400 mt-2">{t('organization.supportedFormats')}</p>
            </div>
          </div>

          <Button>{t('organization.submitVerification')}</Button>
        </div>
      </Card>
    </div>
  );
};

export default VerificationPage;
