import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { opportunityApi } from '@/services/api/opportunityApi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useNotificationContext } from '@/context/NotificationContext';
import { OpportunityType } from '@/types/opportunity';
import { Plus, Trash2, Save } from 'lucide-react';

const CreateOpportunityPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      type: 'full-time' as OpportunityType,
      location: '',
      isRemote: false,
      experienceLevel: 'entry',
      requirements: [''],
      responsibilities: [''],
      benefits: [''],
      skills: [''],
      applicationDeadline: '',
      category: '',
      educationLevel: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await opportunityApi.createOpportunity(data);
      addNotification({ type: 'success', title: 'Success', message: 'Opportunity created!' });
      navigate('/my-jobs');
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err?.message || 'Failed to create opportunity.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addArrayField = (field: string) => {
    const current = (register as any).getValues(field) || [''];
    (register as any).setValue(field, [...current, '']);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('nav.create')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('organization.postOpportunity')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <div className="space-y-5">
            <Input
              label={t('opportunities.title')}
              placeholder={t('common.jobTitle')}
              {...register('title', { required: t('forms.required') })}
              error={errors.title?.message}
            />
            <Input
              label={t('opportunities.description')}
              as="textarea"
              rows={4}
              placeholder={t('opportunities.describePlaceholder')}
              {...register('description', { required: t('forms.required') })}
              error={errors.description?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label={t('opportunities.typeLabel')}
                {...register('type', { required: t('forms.required') })}
                error={errors.type?.message}
                options={[
                  { value: 'internship', label: t('opportunities.type.internship') },
                  { value: 'full-time', label: t('opportunities.type.full-time') },
                  { value: 'part-time', label: t('opportunities.type.part-time') },
                  { value: 'freelance', label: t('opportunities.type.freelance') },
                  { value: 'volunteer', label: t('opportunities.type.volunteer') },
                  { value: 'apprenticeship', label: t('opportunities.type.apprenticeship') },
                ]}
              />
              <Input
                label={t('opportunities.location')}
                placeholder={t('common.location')}
                {...register('location', { required: t('forms.required') })}
                error={errors.location?.message}
              />
            </div>
            <Input
              label={t('opportunities.experience')}
              {...register('experienceLevel')}
              options={[
                { value: 'entry', label: 'Entry Level' },
                { value: 'mid', label: 'Mid Level' },
                { value: 'senior', label: 'Senior Level' },
              ]}
            />
            <Input
              label={t('opportunities.deadline')}
              type="date"
              {...register('applicationDeadline', { required: t('forms.required') })}
              error={errors.applicationDeadline?.message}
            />
          </div>
        </Card>

        <Button type="submit" loading={isSubmitting} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {t('common.submit')}
        </Button>
      </form>
    </div>
  );
};

export default CreateOpportunityPage;
