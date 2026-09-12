import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Briefcase, Users, MapPin } from 'lucide-react';

const ImpactStats: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    { value: '100+', labelKey: 'statInstitutions', icon: Building2 },
    { value: '5,000+', labelKey: 'statOpportunities', icon: Briefcase },
    { value: '50,000+', labelKey: 'statUsers', icon: Users },
    { value: 'All', labelKey: 'statCoverage', icon: MapPin, sub: 'Tanzania' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-tdop-navy via-tdop-royal to-tdop-royalLight">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,193,7,0.15),transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.labelKey} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-tdop-gold" />
                </div>
                <p className="mt-4 font-display text-4xl lg:text-5xl font-extrabold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-lg text-white">
                  {t(`landing.${stat.labelKey}`)}
                  {stat.sub ? ` · ${stat.sub}` : ''}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;