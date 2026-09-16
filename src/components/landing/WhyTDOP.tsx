import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Target, TrendingUp, Eye } from 'lucide-react';

const WhyTDOP: React.FC = () => {
  const { t } = useTranslation();

  const reasons = [
    {
      icon: ShieldCheck,
      color: 'text-tdop-secondary',
      bg: 'bg-tdop-secondary/10',
      titleKey: 'landing.whyVerified',
      descKey: 'landing.whyVerifiedDesc',
    },
    {
      icon: Target,
      color: 'text-tdop-primary',
      bg: 'bg-tdop-primary/10',
      titleKey: 'landing.whyPersonalized',
      descKey: 'landing.whyPersonalizedDesc',
    },
    {
      icon: TrendingUp,
      color: 'text-tdop-accent',
      bg: 'bg-tdop-accent/10',
      titleKey: 'landing.whyProgress',
      descKey: 'landing.whyProgressDesc',
    },
    {
      icon: Eye,
      color: 'text-tdop-navy',
      bg: 'bg-gray-100',
      titleKey: 'landing.whyTransparent',
      descKey: 'landing.whyTransparentDesc',
    },
  ];

  return (
    <section id="about" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-tdop-navy">
            {t('landing.whyTitle')}
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            {t('landing.whySubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map(reason => {
            const Icon = reason.icon;
            return (
              <div key={reason.titleKey} className="bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-card hover:-translate-y-1 transition-all duration-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${reason.bg}`}>
                  <Icon className={`w-6 h-6 ${reason.color}`} />
                </div>
                <h3 className="mt-4 font-display font-bold text-base text-tdop-navy">{t(reason.titleKey)}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{t(reason.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyTDOP;
