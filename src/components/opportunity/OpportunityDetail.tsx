import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatSalary } from '@/utils/formatSalary';
import { formatDate } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';
import { MapPin, Briefcase, Clock, Calendar, Users, Check, FileText, Mail, ArrowLeft } from 'lucide-react';

export const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { opportunities, isLoading } = useOpportunities();
  const { isAuthenticated, isSeeker } = useAuth();
  const { apply, isApplying } = useApplications();
  const { t } = useTranslation();

  const opportunity = opportunities.find(opp => opp.id === id);

  if (isLoading || !opportunity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tdop-primary" />
      </div>
    );
  }

  const handleApply = async () => {
    await apply({ opportunityId: opportunity.id, resumeUrl: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <Link to="/browse" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>
      </div>

      <Card padding={false}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{opportunity.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {opportunity.company}
              </p>
            </div>
            <div className="flex gap-2">
              {opportunity.isVerified && <Badge variant="verified">{t('opportunities.verified')}</Badge>}
              {opportunity.isFeatured && <Badge variant="warning">{t('opportunities.featured')}</Badge>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {opportunity.location}{opportunity.isRemote ? ` (${t('opportunities.remote')})` : ''}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {formatDate(opportunity.applicationDeadline, 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              {t('opportunities.applyCount', { count: opportunity.applicationsCount })}
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm text-gray-500">{t('opportunities.salary')}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
              {formatSalary(opportunity.salaryMin, opportunity.salaryMax)}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">{t('opportunities.typeLabel')}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 capitalize">
              {t(`opportunities.type.${opportunity.type}`)}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">{t('opportunities.experience')}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 capitalize">
              {opportunity.experienceLevel}
            </p>
          </Card>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('opportunities.description')}</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{opportunity.description}</p>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('opportunities.requirements')}</h3>
            <ul className="space-y-1">
              {opportunity.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Check className="w-4 h-4 text-tdop-primary mt-0.5 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('opportunities.responsibilities')}</h3>
            <ul className="space-y-1">
              {opportunity.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Check className="w-4 h-4 text-tdop-primary mt-0.5 flex-shrink-0" />
                  {resp}
                </li>
              ))}
            </ul>
          </div>

          {opportunity.benefits.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('opportunities.benefits')}</h3>
              <ul className="space-y-1">
                {opportunity.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Check className="w-4 h-4 text-tdop-primary mt-0.5 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {isAuthenticated && isSeeker && (
        <div className="sticky bottom-4 flex items-center justify-center gap-4">
          <Button size="lg" onClick={handleApply} loading={isApplying} className="w-full md:w-auto">
            <FileText className="w-5 h-5 mr-2" />
            {t('opportunities.applyNow')}
          </Button>
        </div>
      )}
    </div>
  );
};
