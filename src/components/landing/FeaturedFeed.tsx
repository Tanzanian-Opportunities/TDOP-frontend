import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOpportunities } from '@/hooks/useOpportunities';
import { Opportunity } from '@/types/opportunity';
import { mockOpportunities, cardThumbnails } from './mockData';
import { MapPin, Calendar, ArrowRight, Star, ShieldCheck, ThumbsUp } from 'lucide-react';

const badgeFor = (index: number, opp: Opportunity) => {
  const badges = ['featuredBadge', 'popularBadge', 'verifiedBadge', 'recommendedBadge'];
  return badges[index % badges.length];
};

const FeaturedCard: React.FC<{ opp: Opportunity; index: number }> = ({ opp, index }) => {
  const { t } = useTranslation();
  const thumb = opp.images?.[0] || cardThumbnails[index % cardThumbnails.length];

  return (
    <Link
      to={`/opportunities/${opp.id}`}
      className="group rounded-2xl border border-gray-100 bg-white hover:shadow-soft hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div className="relative h-40 overflow-hidden">
        <img src={thumb} alt={opp.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-tdop-navy/60 to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tdop-gold text-tdop-navy text-xs font-semibold">
          {index === 0 ? <Star className="w-3 h-3" /> : index === 2 ? <ShieldCheck className="w-3 h-3" /> : <ThumbsUp className="w-3 h-3" />}
          {t(`landing.${badgeFor(index, opp)}`)}
        </span>
        <span className="absolute bottom-3 left-3 text-white/90 text-xs font-medium">
          {opp.company}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-tdop-cyan">
          {t(`opportunities.type.${opp.type}`)}
        </span>
        <h3 className="mt-1 font-display font-semibold text-tdop-royal group-hover:text-tdop-royalLight line-clamp-2">
          {opp.title}
        </h3>
        <div className="mt-3 space-y-1.5 text-sm text-gray-500 flex-1">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            {opp.location}
            {opp.isRemote && <span className="text-tdop-cyan font-medium">· Remote</span>}
          </p>
          <p className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            {t('opportunities.deadline')}: {new Date(opp.applicationDeadline).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-semibold text-tdop-royal">
            {opp.salaryMin ? `${opp.salaryMin.toLocaleString()} ${opp.salaryCurrency || 'TZS'}` : t('app.empty')}
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

  const list = (opportunities.length > 0 ? opportunities : mockOpportunities).slice(0, 6);

  return (
    <section className="bg-tdop-light py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-tdop-cyan">
              {t('landing.featuredSubtitle')}
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-tdop-royal">
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
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton h-40" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-4 w-24" />
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              </div>
            ))}
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