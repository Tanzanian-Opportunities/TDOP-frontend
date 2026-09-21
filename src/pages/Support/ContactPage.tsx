import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useNotificationContext } from '@/context/NotificationContext';
import { Send, Mail, MessageSquare } from 'lucide-react';
import axiosInstance from '@/services/api/axiosInstance';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addNotification({ type: 'error', title: t('contactForm.error'), message: t('contactForm.fillRequired') });
      return;
    }
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/public/contact', formData);
      addNotification({ type: 'success', title: t('contactForm.sent'), message: t('contactForm.sentDesc') });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      addNotification({ type: 'success', title: t('contactForm.sent'), message: t('contactForm.sentDesc') });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-slide-up">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center justify-center gap-2">
          <Mail className="w-8 h-8 text-tdop-primary" />
          {t('support.contact')}
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">{t('support.contactDescription')}</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={t('contactForm.fullName')} name="name" value={formData.name} onChange={handleChange}
              placeholder={t('contactForm.namePlaceholder')} required />
            <Input label={t('contactForm.email')} name="email" type="email" value={formData.email} onChange={handleChange}
              placeholder={t('contactForm.emailPlaceholder')} required />
          </div>
          <Input label={t('contactForm.subject')} name="subject" value={formData.subject} onChange={handleChange}
            placeholder={t('contactForm.subjectPlaceholder')} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('contactForm.message')}</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows={5} required
              placeholder={t('contactForm.messagePlaceholder')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tdop-primary focus:border-transparent" />
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            {t('contactForm.sendMessage')}
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <Card className="p-4">
          <Mail className="w-6 h-6 text-tdop-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-tdop-navy">{t('contactForm.email')}</p>
          <p className="text-sm text-gray-500">support@tdop.co.tz</p>
        </Card>
        <Card className="p-4">
          <MessageSquare className="w-6 h-6 text-tdop-secondary mx-auto mb-2" />
          <p className="text-sm font-medium text-tdop-navy">{t('contactForm.responseTime')}</p>
          <p className="text-sm text-gray-500">{t('contactForm.within24Hours')}</p>
        </Card>
        <Card className="p-4">
          <Send className="w-6 h-6 text-tdop-accent mx-auto mb-2" />
          <p className="text-sm font-medium text-tdop-navy">{t('contactForm.availability')}</p>
          <p className="text-sm text-gray-500">{t('contactForm.monFri')}</p>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
