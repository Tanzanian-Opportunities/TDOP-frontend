import React from 'react';
import { Link } from 'react-router-dom';
import { useOpportunities } from '@/hooks/useOpportunities';
import { mockOpportunities, cardThumbnails } from '@/components/landing/mockData';
import { useTranslation } from 'react-i18next';
import { Sparkles, MapPin, Calendar, ArrowRight, BadgeCheck, ThumbsUp } from 'lucide-react';

const SeekerRecommendationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { opportunities, isLoading } = useOpportunities();
  const list = (opportunities.length > 0 ? opportunities : mockOpportunities).slice(0, 9);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="rounded-3xl bg-gradient-to-br from-tdop-navy via-tdop-royal to-tdop-royalLight p-8 text-white shadow-navy">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-tdop-gold" />
          <div>
            <h1 className="font-display text-3xl font-extrabold">{t('dashboard.recommendationsTitle')}</h1>
            <p className="text-white/70 mt-1">{t('dashboard.greetingSubtitle')}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <div className="skeleton h-36" />
              <div className="p-4 space-y-2"><div className="skeleton h-4 w-32" /><div className="skeleton h-4 w-2/3" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((opp, i) => (
            <Link
              key={opp.id}
              to={`/opportunities/${opp.id}`}
              className="group rounded-2xl border border-gray-100 bg-white hover:shadow-soft hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={opp.images?.[0] || cardThumbnails[i % cardThumbnails.length]}
                  alt={opp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tdop-gold text-tdop-navy text-xs font-semibold">
                  {i % 3 === 2 ? <BadgeCheck className="w-3 h-3" /> : <ThumbsUp className="w-3 h-3" />}
                  {i % 3 === 2 ? t('landing.verifiedBadge') : t('landing.recommendedBadge')}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-tdop-cyan">{opp.type}</span>
                <h3 className="mt-1 font-display font-semibold text-tdop-royal line-clamp-2">{opp.title}</h3>
                <div className="mt-3 space-y-1.5 text-sm text-gray-500 flex-1">
                  <p className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{opp.company} · {opp.location}</p>
                  <p className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" />{t('opportunities.deadline')}: {new Date(opp.applicationDeadline).toLocaleDateString()}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-tdop-primary text-sm font-medium group-hover:gap-2 transition-all">
                  {t('application.viewDetails')} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerRecommendationsPage;