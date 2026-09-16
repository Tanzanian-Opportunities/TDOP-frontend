import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const sections = [
  { titleKey: 'terms.s1Title', bodyKey: 'terms.s1Body' },
  { titleKey: 'terms.s2Title', bodyKey: 'terms.s2Body' },
  { titleKey: 'terms.s3Title', bodyKey: 'terms.s3Body' },
  { titleKey: 'terms.s4Title', bodyKey: 'terms.s4Body' },
  { titleKey: 'terms.s5Title', bodyKey: 'terms.s5Body' },
  { titleKey: 'terms.s6Title', bodyKey: 'terms.s6Body' },
];

const TermsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-tdop-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t('nav.home', 'Home')}
        </Link>

        <h1 className="font-display text-3xl font-bold text-tdop-navy">{t('common.termsOfService')}</h1>
        <p className="mt-3 text-sm text-gray-400">{t('terms.lastUpdated', 'Last updated: September 2026')}</p>

        <div className="mt-10 space-y-8">
          {sections.map(sec => (
            <div key={sec.titleKey}>
              <h2 className="font-display text-lg font-bold text-tdop-navy">{t(sec.titleKey)}</h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed whitespace-pre-line">{t(sec.bodyKey)}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          {t('terms.questions', 'Questions about these terms?')}{' '}
          <Link to="/contact" className="text-tdop-primary hover:underline font-medium">{t('common.contactUs')}</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
