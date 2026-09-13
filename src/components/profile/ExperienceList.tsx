import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { Plus, Trash2, Briefcase } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

interface ExperienceListProps {
  experiences: Experience[];
  onAdd?: (data: { company: string; title: string; location?: string; startDate?: string; endDate?: string; isCurrent?: boolean; description?: string }) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

export const ExperienceList: React.FC<ExperienceListProps> = ({ experiences, onAdd, onRemove, className = '' }) => {
  const { t } = useTranslation();
  const [showAdd, setShowAdd] = useState(false);
  const [newExp, setNewExp] = useState({ company: '', title: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '' });

  const handleAdd = () => {
    if (newExp.company && newExp.title && onAdd) {
      onAdd({
        company: newExp.company,
        title: newExp.title,
        location: newExp.location || undefined,
        startDate: newExp.startDate || undefined,
        endDate: newExp.isCurrent ? undefined : newExp.endDate || undefined,
        isCurrent: newExp.isCurrent,
        description: newExp.description || undefined,
      });
      setNewExp({ company: '', title: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '' });
      setShowAdd(false);
    }
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-tdop-primary" />
          {t('profile.experience') || 'Experience'}
        </h3>
        {onAdd && (
          <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="w-4 h-4 mr-1" />
            {t('profile.addExperience') || 'Add Experience'}
          </Button>
        )}
      </div>

      {showAdd && onAdd && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-slide-up space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('common.company') || 'Company'}
              value={newExp.company}
              onChange={(e) => setNewExp(prev => ({ ...prev, company: e.target.value }))}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
            />
            <input
              type="text"
              placeholder={t('common.jobTitle') || 'Job Title'}
              value={newExp.title}
              onChange={(e) => setNewExp(prev => ({ ...prev, title: e.target.value }))}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
            />
          </div>
          <input
            type="text"
            placeholder={t('common.location') || 'Location'}
            value={newExp.location}
            onChange={(e) => setNewExp(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
          />
          <div className="flex gap-2">
            <input
              type="date"
              placeholder={t('common.startDate') || 'Start Date'}
              value={newExp.startDate}
              onChange={(e) => setNewExp(prev => ({ ...prev, startDate: e.target.value }))}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
            />
            {!newExp.isCurrent && (
              <input
                type="date"
                placeholder={t('common.endDate') || 'End Date'}
                value={newExp.endDate}
                onChange={(e) => setNewExp(prev => ({ ...prev, endDate: e.target.value }))}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
              />
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={newExp.isCurrent}
              onChange={(e) => setNewExp(prev => ({ ...prev, isCurrent: e.target.checked }))}
              className="rounded border-gray-300"
            />
            {t('common.currentPosition') || 'I currently work here'}
          </label>
          <textarea
            placeholder={t('common.description') || 'Description'}
            value={newExp.description}
            onChange={(e) => setNewExp(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleAdd}>{t('common.save')}</Button>
          </div>
        </div>
      )}

      {experiences.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('profile.noExperience') || 'No experience added yet'}</p>
      ) : (
        <div className="space-y-3">
          {experiences.map(exp => (
            <div key={exp.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{exp.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                {exp.location && <p className="text-xs text-gray-400">{exp.location}</p>}
                <p className="text-xs text-gray-400">
                  {exp.startDate ? formatDate(exp.startDate) : ''} - {exp.isCurrent ? (t('common.present') || 'Present') : (exp.endDate ? formatDate(exp.endDate) : '')}
                </p>
                {exp.description && <p className="text-xs text-gray-500 mt-1">{exp.description}</p>}
              </div>
              {onRemove && (
                <button onClick={() => onRemove(exp.id)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 opacity-70 hover:opacity-100 transition-opacity">
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
