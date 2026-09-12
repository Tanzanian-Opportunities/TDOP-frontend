import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Interest } from '@/types/profile';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface InterestListProps {
  interests: Interest[];
  onAdd?: (data: { category: string; subcategory: string }) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

export const InterestList: React.FC<InterestListProps> = ({ interests, onAdd, onRemove, className = '' }) => {
  const { t } = useTranslation();
  const [showAdd, setShowAdd] = useState(false);
  const [newInterest, setNewInterest] = useState({ category: '', subcategory: '' });

  const handleAdd = () => {
    if (newInterest.category && newInterest.subcategory && onAdd) {
      onAdd(newInterest);
      setNewInterest({ category: '', subcategory: '' });
      setShowAdd(false);
    }
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('profile.interests')}</h3>
        {onAdd && (
          <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="w-4 h-4 mr-1" />
            {t('profile.addInterest')}
          </Button>
        )}
      </div>

      {showAdd && onAdd && (
        <div className="flex gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-slide-up">
          <input
            type="text"
            placeholder={t('common.category')}
            value={newInterest.category}
            onChange={(e) => setNewInterest(prev => ({ ...prev, category: e.target.value }))}
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
          />
          <input
            type="text"
            placeholder={t('common.subcategory')}
            value={newInterest.subcategory}
            onChange={(e) => setNewInterest(prev => ({ ...prev, subcategory: e.target.value }))}
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
          />
          <Button size="sm" onClick={handleAdd}>{t('common.save')}</Button>
        </div>
      )}

      {interests.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('common.noInterests')}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {interests.map(interest => (
            <div key={interest.id} className="flex items-center gap-2 group">
              <Badge variant="info">{interest.subcategory || interest.category}</Badge>
              {onRemove && (
                <button
                  onClick={() => onRemove(interest.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
