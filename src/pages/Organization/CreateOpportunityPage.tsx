import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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

const CATEGORIES = [
  'Technology', 'Healthcare', 'Education', 'Finance', 'Engineering',
  'Marketing', 'Design', 'Agriculture', 'Government', 'Non-Profit', 'Other'
];
const EDUCATION_LEVELS = ['High School', 'Diploma', 'Bachelor', 'Master', 'PhD', 'None'];

const CreateOpportunityPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();

  const { register, handleSubmit, formState: { errors }, control } = useForm<any>({
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

  const { fields: reqFields, append: addReq, remove: removeReq } = useFieldArray({ control, name: 'requirements' });
  const { fields: respFields, append: addResp, remove: removeResp } = useFieldArray({ control, name: 'responsibilities' });
  const { fields: benFields, append: addBen, remove: removeBen } = useFieldArray({ control, name: 'benefits' });
  const { fields: skillFields, append: addSkill, remove: removeSkill } = useFieldArray({ control, name: 'skills' });

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        requirements: data.requirements.filter((s: string) => s.trim()),
        responsibilities: data.responsibilities.filter((s: string) => s.trim()),
        benefits: data.benefits.filter((s: string) => s.trim()),
        skills: data.skills.filter((s: string) => s.trim()),
      };
      await opportunityApi.createOpportunity(payload);
      addNotification({ type: 'success', title: 'Success', message: 'Opportunity created!' });
      navigate('/my-jobs');
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err?.message || 'Failed to create opportunity.' });
    }
  };

  const renderArrayField = (
    label: string, fields: any[], append: (v: any) => void, remove: (i: number) => void, registerName: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 mb-2">
          <input {...register(`${registerName}.${index}`)} placeholder={`${label} ${index + 1}`}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tdop-primary focus:border-transparent" />
          {fields.length > 1 && (
            <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={() => append('')} className="flex items-center gap-1 text-sm text-tdop-primary hover:text-tdop-secondary">
        <Plus className="w-4 h-4" /> Add {label.toLowerCase()}
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy">{t('nav.create')}</h1>
        <p className="text-gray-500 mt-1">{t('organization.postOpportunity')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <div className="space-y-5">
            <Input label={t('opportunities.title')} placeholder={t('common.jobTitle')}
              {...register('title', { required: t('forms.required') })}               error={errors.title?.message as string} />
            <Input label={t('opportunities.description')} as="textarea" rows={4}
              placeholder={t('opportunities.describePlaceholder')}
              {...register('description', { required: t('forms.required') })} error={errors.description?.message as string} />

            <div className="grid grid-cols-2 gap-4">
              <Select label={t('opportunities.typeLabel')} {...register('type', { required: t('forms.required') })}
                error={errors.type?.message as string}
                options={[
                  { value: 'internship', label: t('opportunities.type.internship') },
                  { value: 'full-time', label: t('opportunities.type.full-time') },
                  { value: 'part-time', label: t('opportunities.type.part-time') },
                  { value: 'freelance', label: t('opportunities.type.freelance') },
                  { value: 'volunteer', label: t('opportunities.type.volunteer') },
                  { value: 'apprenticeship', label: t('opportunities.type.apprenticeship') },
                ]} />
              <Input label={t('opportunities.location')} placeholder={t('common.location')}
                {...register('location', { required: t('forms.required') })} error={errors.location?.message as string} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select label={t('opportunities.experience')} {...register('experienceLevel')}
                options={[
                  { value: 'entry', label: 'Entry Level' },
                  { value: 'mid', label: 'Mid Level' },
                  { value: 'senior', label: 'Senior Level' },
                ]} />
              <Select label="Education Level" {...register('educationLevel')}
                options={EDUCATION_LEVELS.map(e => ({ value: e, label: e }))} />
            </div>

            <Select label="Category" {...register('category')}
              options={CATEGORIES.map(c => ({ value: c, label: c }))} />

            <div className="flex items-center gap-2">
              <input type="checkbox" id="isRemote" {...register('isRemote')}
                className="h-4 w-4 rounded border-gray-300 text-tdop-primary focus:ring-tdop-primary" />
              <label htmlFor="isRemote" className="text-sm font-medium text-gray-700">Remote friendly</label>
            </div>

            <Input label={t('opportunities.deadline')} type="date"
              {...register('applicationDeadline', { required: t('forms.required') })}
              error={errors.applicationDeadline?.message as string} />
          </div>
        </Card>

        <Card>
          <div className="space-y-5">
            {renderArrayField('Requirements', reqFields, addReq, removeReq, 'requirements')}
            {renderArrayField('Responsibilities', respFields, addResp, removeResp, 'responsibilities')}
            {renderArrayField('Benefits', benFields, addBen, removeBen, 'benefits')}
            {renderArrayField('Skills', skillFields, addSkill, removeSkill, 'skills')}
          </div>
        </Card>

        <Button type="submit" className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {t('common.submit')}
        </Button>
      </form>
    </div>
  );
};

export default CreateOpportunityPage;
