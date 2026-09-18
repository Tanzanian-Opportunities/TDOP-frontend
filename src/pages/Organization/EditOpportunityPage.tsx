import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { opportunityApi } from '@/services/api/opportunityApi';
import { Opportunity } from '@/types/opportunity';
import { useNotificationContext } from '@/context/NotificationContext';
import { Save, ArrowLeft, Send, Trash2 } from 'lucide-react';

const EditOpportunityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opp, setOpp] = useState<Opportunity | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'full-time',
    location: '',
    category: '',
    experienceLevel: '',
    educationLevel: '',
    applicationDeadline: '',
    applicationUrl: '',
    salaryRange: '',
    requirements: '',
    benefits: '',
    eligibility: '',
    requiredDocuments: '',
    workMode: 'ONSITE',
  });

  useEffect(() => { if (id) fetchOpportunity(id); }, [id]);

  const fetchOpportunity = async (oppId: string) => {
    try {
      setLoading(true);
      const response = await opportunityApi.getOpportunity(oppId);
      const data = response?.data;
      if (!data) { setError(t('common.notFound')); return; }
      setOpp(data);
      setForm({
        title: data.title || '',
        description: data.description || '',
        type: data.type || 'full-time',
        location: data.location || '',
        category: data.category || '',
        experienceLevel: data.experienceLevel || '',
        educationLevel: data.educationLevel || '',
        applicationDeadline: data.deadline ? data.deadline.split('T')[0] : '',
        applicationUrl: data.applicationUrl || '',
        salaryRange: data.salaryRange || '',
        requirements: Array.isArray(data.requirements) ? data.requirements.join('\n') : (data.requirements || ''),
        benefits: Array.isArray(data.benefits) ? data.benefits.join('\n') : (data.benefits || ''),
        eligibility: data.eligibility || '',
        requiredDocuments: data.requiredDocuments || '',
        workMode: data.workMode || 'ONSITE',
      });
    } catch (err) {
      setError(t('common.errorLoading'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    try {
      await opportunityApi.updateOpportunity(id, {
        title: form.title,
        description: form.description,
        type: form.type as any,
        location: form.location,
        category: form.category,
        experienceLevel: form.experienceLevel,
        educationLevel: form.educationLevel,
        applicationDeadline: form.applicationDeadline,
        applicationUrl: form.applicationUrl,
        salaryRange: form.salaryRange,
        requirements: form.requirements,
        benefits: form.benefits,
        eligibility: form.eligibility,
        requiredDocuments: form.requiredDocuments,
        workMode: form.workMode,
      } as any);
      addNotification({ type: 'success', title: t('common.success'), message: t('editOpp.updateSuccess') });
      navigate('/my-jobs');
    } catch {
      addNotification({ type: 'error', title: t('common.error'), message: t('editOpp.updateFailed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm(t('editOpp.confirmDelete'))) return;
    try {
      await opportunityApi.deleteOpportunity(id);
      addNotification({ type: 'success', title: t('common.success'), message: t('editOpp.deleteSuccess') });
      navigate('/my-jobs');
    } catch {
      addNotification({ type: 'error', title: t('common.error'), message: t('editOpp.deleteFailed') });
    }
  };

  const handleSubmitForReview = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await opportunityApi.submitOpportunity(id);
      addNotification({ type: 'success', title: t('common.success'), message: t('editOpp.submitted') });
      fetchOpportunity(id);
    } catch {
      addNotification({ type: 'error', title: t('common.error'), message: t('editOpp.submitFailed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/my-jobs')}>{t('common.backToDashboard')}</Button>
          </div>
        </Card>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'gray', SUBMITTED: 'info', UNDER_REVIEW: 'info', VERIFIED: 'success',
    APPROVED: 'success', PUBLISHED: 'success', REJECTED: 'danger', SUSPENDED: 'warning',
    EXPIRED: 'gray', ARCHIVED: 'gray', CLOSING_SOON: 'warning',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-tdop-navy">{t('editOpp.title')}</h1>
            {opp && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={(statusColors[opp.status] || 'gray') as any} size="sm">{opp.status}</Badge>
              </div>
            )}
          </div>
        </div>
        {(opp?.status === 'DRAFT' || opp?.status === 'draft') && (
          <Button onClick={handleSubmitForReview} loading={isSubmitting}>
            <Send className="w-4 h-4 mr-2" />
            {t('editOpp.submitForReview')}
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-5">
            <Input
              label={t('opportunities.title')}
              value={form.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('title', e.target.value)}
              placeholder={t('common.jobTitle')}
            />
            <Input
              label={t('opportunities.description')}
              as="textarea"
              rows={5}
              value={form.description}
              onChange={(e: any) => updateField('description', e.target.value)}
              placeholder={t('opportunities.describePlaceholder')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label={t('opportunities.typeLabel')}
                value={form.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('type', e.target.value)}
                options={[
                  { value: 'full-time', label: t('opportunities.type.full-time') },
                  { value: 'part-time', label: t('opportunities.type.part-time') },
                  { value: 'internship', label: t('opportunities.type.internship') },
                  { value: 'freelance', label: t('opportunities.type.freelance') },
                  { value: 'volunteer', label: t('opportunities.type.volunteer') },
                  { value: 'apprenticeship', label: t('opportunities.type.apprenticeship') },
                ]}
              />
              <Input
                label={t('opportunities.location')}
                value={form.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('location', e.target.value)}
                placeholder={t('common.location')}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('opportunities.deadline')}
                type="date"
                value={form.applicationDeadline}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('applicationDeadline', e.target.value)}
              />
              <Input
                label={t('createOpp.category')}
                value={form.category}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('category', e.target.value)}
                placeholder={t('createOpp.categoryPlaceholder')}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label={t('opportunities.experience')}
                value={form.experienceLevel}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('experienceLevel', e.target.value)}
                options={[
                  { value: 'entry', label: t('createOpp.entryLevel') },
                  { value: 'mid', label: t('createOpp.midLevel') },
                  { value: 'senior', label: t('createOpp.seniorLevel') },
                ]}
              />
              <Input
                label={t('createOpp.salaryRange')}
                value={form.salaryRange}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('salaryRange', e.target.value)}
                placeholder={t('createOpp.salaryPlaceholder')}
              />
            </div>
            <Input
              label={t('createOpp.requirements')}
              as="textarea"
              rows={4}
              value={form.requirements}
              onChange={(e: any) => updateField('requirements', e.target.value)}
              placeholder={t('createOpp.requirementsOnePerLine')}
            />
            <Input
              label={t('createOpp.benefits')}
              as="textarea"
              rows={3}
              value={form.benefits}
              onChange={(e: any) => updateField('benefits', e.target.value)}
              placeholder={t('createOpp.benefitsPlaceholder')}
            />
            <Input
              label={t('createOpp.eligibility')}
              as="textarea"
              rows={3}
              value={form.eligibility}
              onChange={(e: any) => updateField('eligibility', e.target.value)}
              placeholder={t('createOpp.eligibilityPlaceholder')}
            />
            <Input
              label={t('createOpp.requiredDocuments')}
              as="textarea"
              rows={2}
              value={form.requiredDocuments}
              onChange={(e: any) => updateField('requiredDocuments', e.target.value)}
              placeholder={t('createOpp.requiredDocumentsPlaceholder')}
            />
          </div>
        </Card>

        <div className="flex items-center justify-between mt-6">
          <Button type="button" variant="danger" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            {t('common.delete')}
          </Button>
          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {t('common.save')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditOpportunityPage;
