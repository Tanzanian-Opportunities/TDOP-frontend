import React from 'react';
import { Link } from 'react-router-dom';
import { Opportunity } from '@/types/opportunity';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatSalary } from '@/utils/formatSalary';
import { useTranslation } from 'react-i18next';
import { X, ArrowRight, Scale } from 'lucide-react';

interface OpportunityCompareProps {
 opportunities: Opportunity[];
 onRemove: (id: string) => void;
 onClearAll: () => void;
}

export const OpportunityCompare: React.FC<OpportunityCompareProps> = ({
 opportunities,
 onRemove,
 onClearAll,
}) => {
 const { t } = useTranslation();

 if (opportunities.length < 2) {
 return (
 <div className="text-center py-12">
 <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
 <h3 className="text-lg font-semibold text-tdop-navy mb-2">{t('comparison.noSelection')}</h3>
 <p className="text-gray-500 mb-4">{t('comparison.selectOpportunities')}</p>
 </div>
 );
 }

 const columns = ['title', 'company', 'location', 'salary', 'type', 'experience', 'deadline'];

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <h2 className="text-xl font-bold text-tdop-navy">{t('comparison.title')}</h2>
  <div className="flex items-center gap-2">
  <Button variant="outline" size="sm" onClick={onClearAll}>
  {t('comparison.clearAll')}
  </Button>
  </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full min-w-[600px]">
 <thead>
 <tr className="border-b border-gray-200">
 <th className="text-left p-3 text-sm font-medium text-gray-500">{t('comparison.titleColumn')}</th>
 {opportunities.map(opp => (
 <th key={opp.id} className="text-left p-3 text-sm font-medium text-gray-500 relative">
 <Link to={`/opportunities/${opp.id}`} className="text-tdop-primary hover:underline">
 {opp.title}
 </Link>
 <button onClick={() => onRemove(opp.id)} className="absolute top-0 right-0 p-1 rounded hover:bg-red-100">
 <X className="w-3 h-3 text-red-500" />
 </button>
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {columns.map(col => (
 <tr key={col}>
 <td className="p-3 text-sm font-medium text-tdop-navy capitalize">{col}</td>
 {opportunities.map(opp => (
 <td key={`${opp.id}-${col}`} className="p-3 text-sm text-gray-600 capitalize">
 {col === 'salary' ? formatSalary(opp.salaryMin, opp.salaryMax) :
 col === 'type' ? t(`opportunities.type.${opp.type}`) :
 col === 'experience' ? opp.experienceLevel :
 col === 'company' ? opp.company :
 col === 'location' ? `${opp.location}${opp.isRemote ? ` (${t('opportunities.remote')})` : ''}` :
 col === 'deadline' ? opp.applicationDeadline : ''}
 </td>
 ))}
 </tr>
 ))}
 <tr>
 <td className="p-3 text-sm font-medium text-tdop-navy">{t('comparison.applyColumn')}</td>
 {opportunities.map(opp => (
 <td key={`${opp.id}-apply`} className="p-3">
 <Button size="sm" asChild>
 <Link to={`/opportunities/${opp.id}`}>{t('opportunities.apply')}</Link>
 </Button>
 </td>
 ))}
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 );
};
