import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Target } from 'lucide-react';

interface CareerGoal {
  id: string;
  title: string;
  description?: string;
  targetIndustry?: string;
  targetRole?: string;
  timeline?: string;
}

interface CareerGoalListProps {
  careerGoals: CareerGoal[];
  onAdd?: (data: { title: string; description?: string; targetIndustry?: string; targetRole?: string; timeline?: string }) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

export const CareerGoalList: React.FC<CareerGoalListProps> = ({ careerGoals, onAdd, onRemove, className = '' }) => {
  const { t } = useTranslation();
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', targetIndustry: '', targetRole: '', timeline: '' });

  const handleAdd = () => {
    if (newGoal.title && onAdd) {
      onAdd({
        title: newGoal.title,
        description: newGoal.description || undefined,
        targetIndustry: newGoal.targetIndustry || undefined,
        targetRole: newGoal.targetRole || undefined,
        timeline: newGoal.timeline || undefined,
      });
      setNewGoal({ title: '', description: '', targetIndustry: '', targetRole: '', timeline: '' });
      setShowAdd(false);
    }
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-tdop-primary" />
          {t('profile.careerGoals') || 'Career Goals'}
        </h3>
        {onAdd && (
          <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="w-4 h-4 mr-1" />
            {t('profile.addCareerGoal') || 'Add Goal'}
          </Button>
        )}
      </div>

      {showAdd && onAdd && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-slide-up space-y-2">
          <input
            type="text"
            placeholder={t('common.goalTitle') || 'Goal title'}
            value={newGoal.title}
            onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
          />
          <textarea
            placeholder={t('common.description') || 'Description'}
            value={newGoal.description}
            onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('common.targetIndustry') || 'Target Industry'}
              value={newGoal.targetIndustry}
              onChange={(e) => setNewGoal(prev => ({ ...prev, targetIndustry: e.target.value }))}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
            />
            <input
              type="text"
              placeholder={t('common.targetRole') || 'Target Role'}
              value={newGoal.targetRole}
              onChange={(e) => setNewGoal(prev => ({ ...prev, targetRole: e.target.value }))}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
            />
          </div>
          <input
            type="text"
            placeholder={t('common.timeline') || 'Timeline (e.g., 2 years)'}
            value={newGoal.timeline}
            onChange={(e) => setNewGoal(prev => ({ ...prev, timeline: e.target.value }))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleAdd}>{t('common.save')}</Button>
          </div>
        </div>
      )}

      {careerGoals.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('profile.noCareerGoals') || 'No career goals added yet'}</p>
      ) : (
        <div className="space-y-3">
          {careerGoals.map(goal => (
            <div key={goal.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                {goal.description && <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>}
                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                  {goal.targetIndustry && <span>{goal.targetIndustry}</span>}
                  {goal.targetRole && <span>{goal.targetRole}</span>}
                  {goal.timeline && <span>{goal.timeline}</span>}
                </div>
              </div>
              {onRemove && (
                <button onClick={() => onRemove(goal.id)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 opacity-70 hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
