import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-tdop-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t('nav.home', 'Home')}
        </Link>

        <h1 className="font-display text-3xl font-bold text-tdop-navy">{t('common.contactUs')}</h1>
        <p className="mt-3 text-gray-500 max-w-2xl">
          {t('contact.description', 'Have a question, suggestion, or need assistance? Reach out to us and we will get back to you as soon as possible.')}
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-tdop-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-tdop-primary" />
            </div>
            <h3 className="mt-4 font-semibold text-tdop-navy">{t('contact.email', 'Email')}</h3>
            <p className="mt-2 text-sm text-gray-500">info@tdop.go.tz</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-tdop-primary/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-tdop-primary" />
            </div>
            <h3 className="mt-4 font-semibold text-tdop-navy">{t('contact.phone', 'Phone')}</h3>
            <p className="mt-2 text-sm text-gray-500">+255 22 219 7000</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-tdop-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-tdop-primary" />
            </div>
            <h3 className="mt-4 font-semibold text-tdop-navy">{t('contact.location', 'Location')}</h3>
            <p className="mt-2 text-sm text-gray-500">{t('footer.headquarters')}</p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="font-display text-xl font-bold text-tdop-navy">{t('contact.formTitle', 'Send Us a Message')}</h2>
          <form className="mt-6 space-y-5" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('contact.name', 'Full Name')}</label>
                <input type="text" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('contact.emailLabel', 'Email Address')}</label>
                <input type="email" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('contact.subject', 'Subject')}</label>
              <input type="text" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('contact.message', 'Message')}</label>
              <textarea rows={5} className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary outline-none resize-none" />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 bg-tdop-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Send className="w-4 h-4" />
              {t('contact.send', 'Send Message')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
