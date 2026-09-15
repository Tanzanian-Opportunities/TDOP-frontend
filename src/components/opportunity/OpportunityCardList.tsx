import React from 'react';
import { Opportunity } from '@/types/opportunity';
import { OpportunityCard } from './OpportunityCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTranslation } from 'react-i18next';

interface OpportunityCardListProps {
 opportunities: Opportunity[];
 isLoading?: boolean;
 className?: string;
}

export const OpportunityCardList: React.FC<OpportunityCardListProps> = ({ opportunities, isLoading = false, className = '' }) => {
 const { t } = useTranslation();

 if (isLoading) {
 return (
 <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
 {Array.from({ length: 6 }).map((_, i) => (
 <Skeleton key={i} className="h-64" />
 ))}
 </div>
 );
 }

 if (opportunities.length === 0) {
 return (
 <div className="text-center py-16">
 <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
 <h3 className="text-lg font-semibold text-tdop-navy mb-2">{t('opportunities.noOpportunities')}</h3>
 <p className="text-gray-500">{t('opportunities.noOpportunities')}</p>
 </div>
 );
 }

 return (
 <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
 {opportunities.map(opportunity => (
 <OpportunityCard key={opportunity.id} opportunity={opportunity} />
 ))}
 </div>
 );
};

const Briefcase = (props: any) => (
 <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
 <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
 </svg>
);
