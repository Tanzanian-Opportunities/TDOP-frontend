import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { opportunityApi } from '@/services/api/opportunityApi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useNotificationContext } from '@/context/NotificationContext';
import { OpportunityType } from '@/types/opportunity';
import { Save, Plus, X, ArrowLeft, Briefcase, FileText, CheckCircle, Calendar } from 'lucide-react';

const CreateOpportunityPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'full-time' as OpportunityType,
    location: '',
    category: '',
    experienceLevel: 'entry',
    educationLevel: '',
    applicationDeadline: '',
    applicationUrl: '',
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    eligibility: '',
    requiredDocuments: '',
    salaryRange: '',
  });

  const updateField = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const addListItem = (field: 'requirements' | 'responsibilities' | 'benefits') => {
    updateField(field, [...form[field], '']);
  };

  const updateListItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number, value: string) => {
    const updated = [...form[field]];
    updated[index] = value;
    updateField(field, updated);
  };

  const removeListItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    if (form[field].length <= 1) return;
    updateField(field, form[field].filter((_: string, i: number) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements.filter(Boolean).join('\n'),
        responsibilities: form.responsibilities.filter(Boolean).join('\n'),
        benefits: form.benefits.filter(Boolean).join('\n'),
      };
      await opportunityApi.createOpportunity(payload);
      addNotification({ type: 'success', title: t('common.success'), message: t('createOpp.success') });
      navigate('/my-jobs');
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || t('createOpp.failed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 3;

  const renderArrayField = (field: 'requirements' | 'responsibilities' | 'benefits', label: string, placeholder: string) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-tdop-navy">{label}</label>
      {form[field].map((item: string, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateListItem(field, i, e.target.value)}
            placeholder={placeholder}
          />
          {form[field].length > 1 && (
            <button type="button" onClick={() => removeListItem(field, i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={() => addListItem(field)} className="flex items-center gap-1 text-sm text-tdop-primary hover:underline">
        <Plus className="w-3 h-3" /> {t('createOpp.addItem')}
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-tdop-navy">{t('nav.create')}</h1>
          <p className="text-gray-500 mt-1">{t('organization.postOpportunity')}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 text-sm">
        {[1, 2, 3].map(s => (
          <React.Fragment key={s}>
            <button
              onClick={() => setStep(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                step === s ? 'bg-tdop-primary text-white font-medium' : step > s ? 'bg-tdop-secondary/10 text-tdop-secondary' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step > s ? <CheckCircle className="w-3.5 h-3.5" /> : <span>{s}</span>}
              <span className="hidden sm:inline">{s === 1 ? t('createOpp.basicInfo') : s === 2 ? t('createOpp.details') : t('createOpp.review')}</span>
            </button>
            {s < 3 && <div className="flex-1 h-px bg-gray-200" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <Card>
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-tdop-navy font-semibold">
              <Briefcase className="w-4 h-4" /> {t('createOpp.basicInfo')}
            </div>
            <Input
              label={t('opportunities.title')}
              value={form.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('title', e.target.value)}
              placeholder={t('common.jobTitle')}
            />
            <Input
              label={t('opportunities.description')}
              as="textarea"
              rows={4}
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
                value={form.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('location', e.target.value)}
                placeholder={t('common.location')}
              />
            </div>
            <Input
              label={t('createOpp.category')}
              value={form.category}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('category', e.target.value)}
              placeholder={t('createOpp.categoryPlaceholder')}
            />
          </div>
        </Card>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <Card>
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-tdop-navy font-semibold">
              <FileText className="w-4 h-4" /> {t('createOpp.details')}
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
              label={t('createOpp.eligibility')}
              as="textarea"
              rows={3}
              value={form.eligibility}
              onChange={(e: any) => updateField('eligibility', e.target.value)}
              placeholder={t('createOpp.eligibilityPlaceholder')}
            />
            {renderArrayField('requirements', t('createOpp.requirements'), t('createOpp.requirementPlaceholder'))}
            {renderArrayField('responsibilities', t('createOpp.responsibilities'), t('createOpp.responsibilityPlaceholder'))}
            {renderArrayField('benefits', t('createOpp.benefits'), t('createOpp.benefitPlaceholder'))}
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
      )}

      {/* Step 3: Review & Deadline */}
      {step === 3 && (
        <Card>
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-tdop-navy font-semibold">
              <Calendar className="w-4 h-4" /> {t('createOpp.deadlineAndReview')}
            </div>
            <Input
              label={t('opportunities.deadline')}
              type="date"
              value={form.applicationDeadline}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('applicationDeadline', e.target.value)}
            />
            <Input
              label={t('createOpp.applicationUrl')}
              value={form.applicationUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('applicationUrl', e.target.value)}
              placeholder="https://..."
            />

            {/* Preview */}
            <div className="p-4 bg-tdop-light rounded-xl space-y-3">
              <h3 className="font-semibold text-tdop-navy">{t('createOpp.preview')}</h3>
              <div className="space-y-2 text-sm">
                {form.title && <p><span className="font-medium">{t('opportunities.title')}:</span> {form.title}</p>}
                {form.type && <p><span className="font-medium">{t('opportunities.typeLabel')}:</span> {form.type}</p>}
                {form.location && <p><span className="font-medium">{t('opportunities.location')}:</span> {form.location}</p>}
                {form.description && <p className="text-gray-600 line-clamp-3">{form.description}</p>}
                {form.applicationDeadline && <p><span className="font-medium">{t('opportunities.deadline')}:</span> {form.applicationDeadline}</p>}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="secondary" onClick={() => setStep(2)}>{t('createOpp.back')}</Button>
              <Button onClick={handleSubmit} loading={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {t('createOpp.createDraft')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step Navigation */}
      {step < 3 && (
        <div className="flex justify-end">
          <Button onClick={() => setStep(step + 1)}>
            {t('createOpp.next')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateOpportunityPage;
