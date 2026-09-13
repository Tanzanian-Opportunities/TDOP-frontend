import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Education } from '@/types/profile';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

interface EducationListProps {
  education: Education[];
  onAdd?: (data: { institution: string; degree: string; fieldOfStudy: string }) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

export const EducationList: React.FC<EducationListProps> = ({ education, onAdd, onRemove, className = '' }) => {
  const { t } = useTranslation();
  const [showAdd, setShowAdd] = useState(false);
  const [newEducation, setNewEducation] = useState({ institution: '', degree: '', fieldOfStudy: '' });

  const handleAdd = () => {
    if (newEducation.institution && newEducation.degree && newEducation.fieldOfStudy && onAdd) {
      onAdd(newEducation);
      setNewEducation({ institution: '', degree: '', fieldOfStudy: '' });
      setShowAdd(false);
    }
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-tdop-navy flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-tdop-primary" />
          {t('profile.education')}
        </h3>
        {onAdd && (
          <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="w-4 h-4 mr-1" />
            {t('profile.addEducation')}
          </Button>
        )}
      </div>

      {showAdd && onAdd && (
        <div className="flex gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-slide-up">
          <input
            type="text"
            placeholder={t('common.institution')}
            value={newEducation.institution}
            onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-tdop-navy"
          />
          <input
            type="text"
            placeholder={t('common.degree')}
            value={newEducation.degree}
            onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-tdop-navy"
          />
          <input
            type="text"
            placeholder={t('common.fieldOfStudy')}
            value={newEducation.fieldOfStudy}
            onChange={(e) => setNewEducation(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-tdop-navy"
          />
          <Button size="sm" onClick={handleAdd}>{t('common.save')}</Button>
        </div>
      )}

      {education.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('profile.noEducation')}</p>
      ) : (
        <div className="space-y-3">
          {education.map(edu => (
            <div key={edu.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-tdop-navy">{edu.degree}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                <p className="text-xs text-gray-400">
                  {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  {edu.isCurrent && ' (Current)'}
                </p>
              </div>
              {onRemove && (
                <button onClick={() => onRemove(edu.id)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 opacity-70 hover:opacity-100 transition-opacity">
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
