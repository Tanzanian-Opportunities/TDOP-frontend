import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Rocket, ArrowRight } from 'lucide-react';

const CtaSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative overflow-hidden rounded-3xl bg-tdop-primary px-8 py-14 sm:px-14 text-center shadow-soft">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,0.15),transparent_55%)]" />
        <div className="relative">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-tdop-accent" />
          </div>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold text-white">
            {t('landing.ctaTitle')}
          </h2>
          <p className="mt-3 text-lg text-white/80 max-w-2xl mx-auto">
            {t('landing.ctaSubtitle')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-tdop-accent hover:bg-amber-600 text-white font-semibold shadow-gold transition-colors"
            >
              {t('landing.ctaJoin')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium underline underline-offset-4">
              {t('landing.ctaLogin')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
