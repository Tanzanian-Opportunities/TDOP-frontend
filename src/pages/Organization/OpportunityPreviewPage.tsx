import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { opportunityApi } from '@/services/api/opportunityApi';
import { Opportunity } from '@/types/opportunity';
import { formatDate } from '@/utils/formatDate';
import { PageError } from '@/components/ui/PageStates';
import { ArrowLeft, ExternalLink, Calendar, MapPin, Briefcase, DollarSign, CheckCircle, Clock, Building2, FileText } from 'lucide-react';

const statusColors: Record<string, string> = {
  DRAFT: 'gray', draft: 'gray', SUBMITTED: 'info', submitted: 'info',
  UNDER_REVIEW: 'warning', PUBLISHED: 'success', published: 'success',
  ACTIVE: 'success', open: 'success', CLOSED: 'danger', closed: 'danger',
  EXPIRED: 'gray', expired: 'gray', FILLED: 'accent', filled: 'accent',
  REJECTED: 'danger',
};

const toList = (val: string | string[] | undefined): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split('\n').filter(Boolean);
};

const OpportunityPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { if (id) fetchOpp(id); }, [id]);

  const fetchOpp = async (oppId: string) => {
    try {
      const response = await opportunityApi.getOpportunity(oppId);
      const data = response?.data || response;
      setOpp(data as Opportunity);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !opp) return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><PageError message={t('common.errorLoading')} onRetry={() => id && fetchOpp(id)} /></div>;

  const requirements = toList(opp.requirements as any);
  const benefits = toList(opp.benefits as any);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-tdop-navy transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('common.back')}
        </button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/edit-opportunity/${opp.id}`)}>
            {t('common.edit')}
          </Button>
          <Button size="sm" onClick={() => navigate(`/organization/opportunity/${opp.id}`)}>
            {t('common.manage')}
          </Button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
        <Clock className="w-5 h-5 text-amber-500" />
        <p className="text-sm text-amber-700">{t('editOpp.previewDescription')}</p>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-tdop-navy">{opp.title}</h1>
              <Badge variant={(statusColors[opp.status] || 'gray') as any}>{opp.status}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {opp.type && <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{opp.type}</span>}
              {opp.category && <span>{opp.category}</span>}
              {opp.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{opp.location}</span>}
              {opp.experienceLevel && <span>{opp.experienceLevel}</span>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-tdop-navy mb-2">{t('opportunities.description')}</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{opp.description}</p>
          </div>

          {requirements.length > 0 && (
            <div>
              <h3 className="font-semibold text-tdop-navy mb-2">{t('createOpp.requirements')}</h3>
              <ul className="space-y-1.5">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-tdop-primary mt-0.5 flex-shrink-0" />{req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {benefits.length > 0 && (
            <div>
              <h3 className="font-semibold text-tdop-navy mb-2">{t('createOpp.benefits')}</h3>
              <ul className="space-y-1.5">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-tdop-secondary mt-0.5 flex-shrink-0" />{b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {opp.eligibility && (
            <div>
              <h3 className="font-semibold text-tdop-navy mb-2">{t('createOpp.eligibility')}</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{opp.eligibility}</p>
            </div>
          )}

          {opp.salaryRange && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-tdop-navy">{t('createOpp.salaryRange')}:</span> {opp.salaryRange}
            </div>
          )}

          {(opp.deadline || opp.applicationDeadline) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-tdop-navy">{t('opportunities.deadline')}:</span> {formatDate(opp.deadline || opp.applicationDeadline)}
            </div>
          )}

          {opp.applicationUrl && (
            <div className="p-4 bg-tdop-light rounded-xl">
              <h3 className="font-semibold text-tdop-navy mb-2">{t('createOpp.howToApply')}</h3>
              <a href={opp.applicationUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-tdop-primary hover:underline text-sm">
                <ExternalLink className="w-4 h-4" /> {opp.applicationUrl}
              </a>
            </div>
          )}

          {opp.requiredDocuments && (
            <div>
              <h3 className="font-semibold text-tdop-navy mb-2">{t('createOpp.requiredDocuments')}</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{opp.requiredDocuments}</p>
            </div>
          )}
        </div>
      </Card>

      <div className="bg-tdop-light rounded-xl p-4 text-sm text-gray-500">
        <p className="font-medium text-tdop-navy mb-1">{opp.organizationName || t('common.organization')}</p>
        {opp.location && <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {opp.location}</p>}
      </div>
    </div>
  );
};

export default OpportunityPreviewPage;
