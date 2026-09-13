import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useNotificationContext } from '@/context/NotificationContext';
import { Save, ArrowLeft } from 'lucide-react';

const EditOpportunityPage: React.FC = () => {
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const { t } = useTranslation();
 const { addNotification } = useNotificationContext();
 const [isSubmitting, setIsSubmitting] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsSubmitting(true);
 try {
 await new Promise(resolve => setTimeout(resolve, 1000));
 addNotification({ type: 'success', title: 'Success', message: 'Opportunity updated!' });
 navigate('/my-jobs');
 } catch {
 addNotification({ type: 'error', title: 'Error', message: 'Failed to update opportunity.' });
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
 <div className="flex items-center gap-3">
 <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
 <ArrowLeft className="w-5 h-5 text-gray-600" />
 </button>
 <div>
 <h1 className="text-3xl font-bold text-tdop-navy">{t('nav.create')}</h1>
 <p className="text-gray-500 mt-1">{t('organization.editProfile')} #{id}</p>
 </div>
 </div>

 <form onSubmit={handleSubmit}>
 <Card>
 <div className="space-y-5 p-6">
 <Input label={t('opportunities.title')} placeholder={t('common.jobTitle')} required />
 <Input label={t('opportunities.description')} as="textarea" rows={4} placeholder={t('opportunities.describePlaceholder')} required />
 <div className="grid grid-cols-2 gap-4">
 <Select
 label={t('opportunities.typeLabel')}
 options={[
 { value: 'full-time', label: t('opportunities.type.full-time') },
 { value: 'part-time', label: t('opportunities.type.part-time') },
 { value: 'internship', label: t('opportunities.type.internship') },
 { value: 'freelance', label: t('opportunities.type.freelance') },
 ]}
 />
 <Input label={t('opportunities.location')} placeholder={t('common.location')} required />
 </div>
 <Input label={t('opportunities.deadline')} type="date" required />
 </div>
 </Card>

 <div className="flex items-center justify-end gap-3">
 <Button type="button" variant="secondary" onClick={() => navigate(-1)}>{t('common.cancel')}</Button>
 <Button type="submit" loading={isSubmitting}>
 <Save className="w-4 h-4 mr-2" />
 {t('common.save')}
 </Button>
 </div>
 </form>
 </div>
 );
};

export default EditOpportunityPage;
