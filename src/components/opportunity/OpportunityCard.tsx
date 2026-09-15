import React from 'react';
import { Link } from 'react-router-dom';
import { Opportunity } from '@/types/opportunity';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatSalary } from '@/utils/formatSalary';
import { formatDate } from '@/utils/formatDate';
import { useAuth } from '@/hooks/useAuth';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useTranslation } from 'react-i18next';
import { MapPin, Briefcase, Clock, Calendar, Users, FileText, Bookmark } from 'lucide-react';

const typeLabels: Record<string, string> = {
 'internship': 'Internship',
 'full-time': 'Full-time',
 'part-time': 'Part-time',
 'freelance': 'Freelance',
 'volunteer': 'Volunteer',
 'apprenticeship': 'Apprenticeship',
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, className = '' }) => {
 const { saveOpportunity, unsaveOpportunity, savedOpportunities } = useOpportunities();
 const { isAuthenticated: isAuth } = useAuth();
 const { t } = useTranslation();
 const isSaved = savedOpportunities.some(opp => opp.id === opportunity.id);

 const handleSave = async (e: React.MouseEvent) => {
 e.preventDefault();
 e.stopPropagation();
 if (!isAuth) return;
 if (isSaved) {
 await unsaveOpportunity(opportunity.id);
 } else {
 await saveOpportunity(opportunity.id);
 }
 };

 return (
 <Card className={`hover:shadow-lg transition-shadow ${className}`}>
 <div className="flex items-start justify-between mb-3">
 <div className="flex-1 min-w-0">
 <h3 className="font-semibold text-lg text-tdop-navy truncate">
 <Link to={`/opportunities/${opportunity.id}`} className="hover:text-tdop-primary transition-colors">
 {opportunity.title}
 </Link>
 </h3>
 <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
 <Briefcase className="w-3.5 h-3.5" />
 {opportunity.company}
 </p>
 </div>
 {isAuth && (
 <button
 onClick={handleSave}
 className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
 aria-label={isSaved ? t('opportunities.saved') : t('opportunities.save')}
 >
 <Bookmark className={`w-5 h-5 ${isSaved ? 'text-tdop-primary fill-tdop-primary' : 'text-gray-400'}`} />
 </button>
 )}
 </div>

 <div className="flex flex-wrap gap-2 mb-3">
  <Badge variant={opportunity.status === 'open' ? 'success' : opportunity.status === 'pending' ? 'warning' : 'gray'}>{typeLabels[opportunity.type]}</Badge>
  {opportunity.isVerified && <Badge variant="success">{t('opportunities.verified')}</Badge>}
 {opportunity.isFeatured && <Badge variant="warning">{t('opportunities.featured')}</Badge>}
 {opportunity.isRemote && <Badge variant="info">{t('opportunities.remote')}</Badge>}
 </div>

 <p className="text-sm text-gray-600 mb-3 line-clamp-2">{opportunity.description}</p>

 <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
 <span className="flex items-center gap-1">
 <MapPin className="w-3.5 h-3.5" />
 {opportunity.location}
 {opportunity.isRemote && ` (${t('opportunities.remote')})`}
 </span>
 <span className="flex items-center gap-1">
 <Clock className="w-3.5 h-3.5" />
 {formatSalary(opportunity.salaryMin, opportunity.salaryMax, opportunity.salaryCurrency)}
 </span>
 <span className="flex items-center gap-1">
 <Briefcase className="w-3.5 h-3.5" />
 {opportunity.experienceLevel}
 </span>
 </div>

 <div className="flex items-center justify-between pt-3 border-t border-gray-100">
 <span className="text-xs text-gray-400">{formatDate(opportunity.publishedAt, 'MMM d, yyyy')}</span>
 <span className="text-xs text-gray-400">{t('opportunities.applyCount', { count: opportunity.applicationsCount })}</span>
 <Button variant="outline" size="sm" asChild>
 <Link to={`/opportunities/${opportunity.id}`}>{t('opportunities.apply')}</Link>
 </Button>
 </div>
 </Card>
 );
};

interface OpportunityCardProps {
 opportunity: Opportunity;
 className?: string;
}
