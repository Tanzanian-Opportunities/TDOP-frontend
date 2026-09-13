import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

const WhyTDOP: React.FC = () => {
  const { t } = useTranslation();

  const reasons = [
    {
      icon: ShieldCheck,
      color: 'text-tdop-secondary',
      bg: 'bg-tdop-secondary/10',
      title: t('landing.whyVerified') || 'Verified & Trusted',
      desc: t('landing.whyVerifiedDesc') || 'Every opportunity on TDOP is verified by our team. We partner directly with organizations to ensure legitimacy and quality.',
    },
    {
      icon: Sparkles,
      color: 'text-tdop-primary',
      bg: 'bg-tdop-primary/10',
      title: t('landing.whyPersonalized') || 'Personalized for You',
      desc: t('landing.whyPersonalizedDesc') || 'Our smart matching system recommends opportunities based on your skills, education, and career goals — not random listings.',
    },
    {
      icon: TrendingUp,
      color: 'text-tdop-accent',
      bg: 'bg-tdop-accent/10',
      title: t('landing.whyProgress') || 'Track Your Progress',
      desc: t('landing.whyProgressDesc') || 'Monitor your applications, manage documents, and track your career journey all in one place.',
    },
  ];

  return (
    <section id="about" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-tdop-primary">
            {t('landing.whySubtitle') || 'Why TDOP'}
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-tdop-navy">
            {t('landing.whyTitle') || 'More Than Just a Job Board'}
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            {t('landing.whyTagline') || 'TDOP connects you with verified opportunities across Tanzania.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map(reason => {
            const Icon = reason.icon;
            return (
              <div key={reason.title} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-card hover:-translate-y-1 transition-all duration-200">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${reason.bg}`}>
                  <Icon className={`w-7 h-7 ${reason.color}`} />
                </div>
                <h3 className="mt-5 font-display font-bold text-lg text-tdop-navy">{reason.title}</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{reason.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyTDOP;
