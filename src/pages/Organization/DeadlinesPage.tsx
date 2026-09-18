import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageError } from '@/components/ui/PageStates';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { formatDate } from '@/utils/formatDate';
import axiosInstance from '@/services/api/axiosInstance';
import { Clock, Calendar, AlertTriangle, ChevronRight, Briefcase } from 'lucide-react';

interface DeadlineItem {
  opportunityId: number;
  opportunityTitle: string;
  deadline: string;
  status: string;
  daysUntil?: number;
}

const DeadlinesPage: React.FC = () => {
  const { t } = useTranslation();
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { fetchDeadlines(); }, []);

  const fetchDeadlines = async () => {
    try {
      const { data } = await axiosInstance.get('/dashboard/deadlines');
      const list = Array.isArray(data) ? data : data?.deadlines || [];
      setDeadlines(list);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const groupByTimeframe = (items: DeadlineItem[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const weekEnd = new Date(today); weekEnd.setDate(today.getDate() + 7);

    const groups: { label: string; items: DeadlineItem[]; urgent: boolean }[] = [
      { label: t('deadlines.today'), items: [], urgent: true },
      { label: t('deadlines.tomorrow'), items: [], urgent: true },
      { label: t('deadlines.thisWeek'), items: [], urgent: false },
      { label: t('deadlines.later'), items: [], urgent: false },
      { label: t('deadlines.expired'), items: [], urgent: false },
    ];

    items.forEach(item => {
      const d = new Date(item.deadline);
      if (d < today) { groups[4].items.push(item); return; }
      if (d.toDateString() === today.toDateString()) { groups[0].items.push(item); return; }
      if (d.toDateString() === tomorrow.toDateString()) { groups[1].items.push(item); return; }
      if (d <= weekEnd) { groups[2].items.push(item); return; }
      groups[3].items.push(item);
    });

    return groups.filter(g => g.items.length > 0);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><PageError message={t('common.errorLoading')} onRetry={fetchDeadlines} /></div>;

  const groups = groupByTimeframe(deadlines);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <Clock className="w-8 h-8 text-tdop-primary" />
          {t('deadlines.title')}
        </h1>
        <p className="text-gray-500 mt-1">{t('deadlines.description')}</p>
      </div>

      {deadlines.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-8 h-8 text-gray-300" />}
          title={t('deadlines.noDeadlines')}
          description={t('deadlines.noDeadlinesDescription')}
        />
      ) : (
        <div className="space-y-6">
          {groups.map(group => (
            <div key={group.label}>
              <div className="flex items-center gap-2 mb-3">
                {group.urgent && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                <h2 className={`text-lg font-semibold ${group.urgent ? 'text-red-600' : 'text-tdop-navy'}`}>
                  {group.label}
                </h2>
                <Badge variant={group.urgent ? 'warning' : 'gray'} size="sm">{group.items.length}</Badge>
              </div>
              <div className="space-y-2">
                {group.items.map(item => (
                  <Card key={item.opportunityId}>
                    <Link to={`/organization/opportunity/${item.opportunityId}`} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${group.urgent ? 'bg-red-50' : 'bg-tdop-light'}`}>
                          <Briefcase className={`w-5 h-5 ${group.urgent ? 'text-red-500' : 'text-tdop-primary'}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-tdop-navy group-hover:text-tdop-primary transition-colors">
                            {item.opportunityTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.deadline)}
                            {item.status && <Badge variant="gray" size="sm">{item.status}</Badge>}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-tdop-primary transition-colors" />
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeadlinesPage;
