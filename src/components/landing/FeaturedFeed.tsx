import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOpportunities } from '@/hooks/useOpportunities';
import { Opportunity } from '@/types/opportunity';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

const FeaturedCard: React.FC<{ opp: Opportunity; index: number }> = ({ opp, index }) => {
  const { t } = useTranslation();

  return (
    <Link
      to={`/opportunities/${opp.id}`}
      className="group rounded-2xl border border-gray-100 bg-white hover:shadow-card hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-tdop-secondary">
          {t(`opportunities.type.${opp.type}`)}
        </span>
        <h3 className="mt-1 font-display font-semibold text-tdop-navy group-hover:text-tdop-primary line-clamp-2">
          {opp.title}
        </h3>
        <div className="mt-3 space-y-1.5 text-sm text-gray-500 flex-1">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            {opp.location}
          </p>
          <p className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            {t('opportunities.deadline')}: {opp.applicationDeadline ? new Date(opp.applicationDeadline).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-semibold text-tdop-navy">
            {(opp.salaryMin || opp.salaryMax) ? `${opp.salaryMin || ''} - ${opp.salaryMax || ''}` : t('app.empty')}
          </span>
          <span className="inline-flex items-center gap-1 text-tdop-primary text-sm font-medium group-hover:gap-2 transition-all">
            {t('application.viewDetails')}
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

const FeaturedFeed: React.FC = () => {
  const { t } = useTranslation();
  const { opportunities, isLoading, isError } = useOpportunities();

  const list = opportunities.slice(0, 6);

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-tdop-primary">
              {t('landing.featuredSubtitle')}
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-tdop-navy">
              {t('landing.featuredTitle')}
            </h2>
          </div>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-tdop-primary font-medium hover:gap-3 transition-all text-sm"
          >
            {t('opportunities.browseTitle')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading && !isError ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-100">
                <div className="p-5 space-y-3">
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-lg">{t('opportunities.noOpportunities') || 'No featured opportunities available yet.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((opp, i) => (
              <FeaturedCard key={opp.id} opp={opp} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedFeed;
