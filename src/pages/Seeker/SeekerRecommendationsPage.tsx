import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api/axiosInstance';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, MapPin, Calendar, ArrowRight, BadgeCheck, Percent, Tag } from 'lucide-react';

const SeekerRecommendationsPage: React.FC = () => {
  const { t } = useTranslation();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/recommendations');
      return data || [];
    },
    refetchOnWindowFocus: false,
  });

  const list = Array.isArray(recommendations) ? recommendations : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="rounded-3xl bg-tdop-primary p-8 text-white shadow-soft">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-tdop-accent" />
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
      ) : list.length === 0 ? (
        <Card className="text-center py-16">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-tdop-navy mb-2">{t('dashboard.recommendationsTitle')}</h3>
          <p className="text-gray-500 mb-4">Complete your profile to get personalized recommendations.</p>
          <Link to="/profile" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-tdop-primary text-white text-sm font-medium">
            Complete Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map((match: any) => {
            const opp = match.opportunity;
            const score = match.matchPercentage || match.score || 0;
            const reasons: string[] = match.reasons || [];
            if (!opp) return null;

            return (
              <Card key={opp.id} padding={false}>
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold uppercase tracking-wide text-tdop-secondary">{opp.type}</span>
                        {opp.isVerified && (
                          <span className="inline-flex items-center gap-1 text-xs text-tdop-secondary font-medium">
                            <BadgeCheck className="w-3.5 h-3.5" /> Verified
                          </span>
                        )}
                      </div>
                      <Link to={`/opportunities/${opp.id}`} className="group">
                        <h3 className="mt-1 font-display font-semibold text-tdop-navy line-clamp-2 group-hover:text-tdop-primary transition-colors">
                          {opp.title}
                        </h3>
                      </Link>
                      <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" />{opp.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-400" />{opp.applicationDeadline ? new Date(opp.applicationDeadline).toLocaleDateString() : 'N/A'}</span>
                      </div>

                      {reasons.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {reasons.map((reason: string, idx: number) => (
                            <span key={idx} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-tdop-primary/10 text-tdop-primary">
                              <Tag className="w-3 h-3" />
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row sm:flex-col items-center gap-3 shrink-0">
                      <div className="relative w-14 h-14">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray={`${score}, 100`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-tdop-primary">{score}%</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">Match</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-tdop-navy">{opp.company || opp.location}</span>
                    <Link to={`/opportunities/${opp.id}`} className="inline-flex items-center gap-1 text-tdop-primary text-sm font-medium hover:gap-2 transition-all">
                      {t('application.viewDetails')} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SeekerRecommendationsPage;
