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

const DollarSign = (props: any) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="12" y1="1" x2="12" y2="23" />
 <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
 </svg>
);

const Clock = (props: any) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10" />
 <polyline points="12 6 12 12 16 14" />
 </svg>
);

const MapPin = (props: any) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
 <circle cx="12" cy="10" r="3" />
 </svg>
);

const BookmarkIcon = (props: any) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
 </svg>
);
