import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const sections = [
  { titleKey: 'privacy.s1Title', bodyKey: 'privacy.s1Body' },
  { titleKey: 'privacy.s2Title', bodyKey: 'privacy.s2Body' },
  { titleKey: 'privacy.s3Title', bodyKey: 'privacy.s3Body' },
  { titleKey: 'privacy.s4Title', bodyKey: 'privacy.s4Body' },
  { titleKey: 'privacy.s5Title', bodyKey: 'privacy.s5Body' },
  { titleKey: 'privacy.s6Title', bodyKey: 'privacy.s6Body' },
];

const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-tdop-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t('nav.home', 'Home')}
        </Link>

        <h1 className="font-display text-3xl font-bold text-tdop-navy">{t('common.privacyPolicy')}</h1>
        <p className="mt-3 text-sm text-gray-400">{t('privacy.lastUpdated', 'Last updated: September 2026')}</p>

        <div className="mt-10 space-y-8">
          {sections.map(sec => (
            <div key={sec.titleKey}>
              <h2 className="font-display text-lg font-bold text-tdop-navy">{t(sec.titleKey)}</h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed whitespace-pre-line">{t(sec.bodyKey)}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          {t('privacy.questions', 'Questions about this policy?')}{' '}
          <Link to="/contact" className="text-tdop-primary hover:underline font-medium">{t('common.contactUs')}</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
