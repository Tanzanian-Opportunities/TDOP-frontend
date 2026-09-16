import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Compass, Activity } from 'lucide-react';

const TrustSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Eye,
      color: 'text-tdop-secondary',
      ring: 'ring-tdop-secondary/20',
      titleKey: 'landing.trustTransparency',
      descKey: 'landing.trustTransparencyDesc',
    },
    {
      icon: Compass,
      color: 'text-tdop-primary',
      ring: 'ring-tdop-primary/20',
      titleKey: 'landing.trustGuidance',
      descKey: 'landing.trustGuidanceDesc',
    },
    {
      icon: Activity,
      color: 'text-tdop-accent',
      ring: 'ring-tdop-accent/20',
      titleKey: 'landing.trustProgress',
      descKey: 'landing.trustProgressDesc',
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-tdop-secondary">
            {t('landing.trustSubtitle')}
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-tdop-navy">
            {t('landing.trustTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(feature => {
            const Icon = feature.icon;
            return (
              <div key={feature.titleKey} className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-card transition-all duration-200">
                <div className={`w-16 h-16 mx-auto rounded-full bg-white ring-4 ${feature.ring} flex items-center justify-center`}>
                  <Icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="mt-5 font-display font-bold text-lg text-tdop-navy">{t(feature.titleKey)}</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{t(feature.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
