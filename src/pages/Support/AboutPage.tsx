import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Target, Users, Globe, Heart, Mail } from 'lucide-react';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  const values = [
    { icon: Shield, titleKey: 'about.value1Title', descKey: 'about.value1Desc' },
    { icon: Target, titleKey: 'about.value2Title', descKey: 'about.value2Desc' },
    { icon: Users, titleKey: 'about.value3Title', descKey: 'about.value3Desc' },
    { icon: Globe, titleKey: 'about.value4Title', descKey: 'about.value4Desc' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-tdop-navy py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            {t('nav.home', 'Home')}
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">{t('about.pageTitle')}</h1>
          <p className="mt-4 text-gray-300 max-w-2xl leading-relaxed">{t('about.pageSubtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <section>
          <h2 className="font-display text-2xl font-bold text-tdop-navy">{t('about.missionTitle')}</h2>
          <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">{t('about.missionBody')}</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-tdop-navy">{t('about.visionTitle')}</h2>
          <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">{t('about.visionBody')}</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-tdop-navy">{t('about.valuesTitle')}</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(v => {
              const Icon = v.icon;
              return (
                <div key={v.titleKey} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="w-12 h-12 rounded-xl bg-tdop-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-tdop-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-tdop-navy">{t(v.titleKey)}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{t(v.descKey)}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-tdop-navy">{t('about.howItWorksTitle')}</h2>
          <div className="mt-8 space-y-6">
            {[
              { num: '1', titleKey: 'about.step1Title', descKey: 'about.step1Desc' },
              { num: '2', titleKey: 'about.step2Title', descKey: 'about.step2Desc' },
              { num: '3', titleKey: 'about.step3Title', descKey: 'about.step3Desc' },
              { num: '4', titleKey: 'about.step4Title', descKey: 'about.step4Desc' },
            ].map(step => (
              <div key={step.num} className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-tdop-primary text-white flex items-center justify-center font-bold text-sm">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-tdop-navy">{t(step.titleKey)}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{t(step.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-tdop-navy">{t('about.teamTitle')}</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">{t('about.teamBody')}</p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <Heart className="w-10 h-10 mx-auto text-tdop-primary" />
          <h2 className="mt-4 font-display text-2xl font-bold text-tdop-navy">{t('about.ctaTitle')}</h2>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">{t('about.ctaBody')}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center bg-tdop-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              {t('about.ctaRegister')}
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 border border-gray-200 text-tdop-navy px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
              <Mail className="w-4 h-4" />
              {t('about.ctaContact')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
