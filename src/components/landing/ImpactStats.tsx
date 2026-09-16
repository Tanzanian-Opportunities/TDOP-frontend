import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api/axiosInstance';
import { Building2, Briefcase, Users, MapPin } from 'lucide-react';

interface PlatformStats {
  totalOrganizations: number;
  monthlyOpportunities: number;
  totalUsers: number;
}

const ImpactStats: React.FC = () => {
  const { t } = useTranslation();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['public-stats'],
    queryFn: async (): Promise<PlatformStats> => {
      const { data } = await axiosInstance.get('/public/stats');
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });

  const statItems = [
    { value: stats?.totalOrganizations ?? null, labelKey: 'statInstitutions', icon: Building2 },
    { value: stats?.monthlyOpportunities ?? null, labelKey: 'statOpportunities', icon: Briefcase },
    { value: stats?.totalUsers ?? null, labelKey: 'statUsers', icon: Users },
    { value: null, labelKey: 'statCoverage', icon: MapPin, sub: 'Tanzania' },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-tdop-primary">
            {t('landing.impactSubtitle')}
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-tdop-navy">
            {t('landing.impactTitle')}
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.labelKey} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-tdop-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-tdop-primary" />
                </div>
                <p className="mt-4 font-display text-3xl lg:text-4xl font-extrabold text-tdop-navy">
                  {isLoading ? '—' : stat.value === null ? t('landing.statAll') : stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500">
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
