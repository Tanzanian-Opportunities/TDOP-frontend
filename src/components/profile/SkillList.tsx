import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skill } from '@/types/profile';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface SkillListProps {
  skills: Skill[];
  onAdd?: (data: { name: string; category: string; level: string }) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

const levelColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-blue-100 text-blue-800',
  advanced: 'bg-purple-100 text-purple-800',
  expert: 'bg-red-100 text-red-800',
};

export const SkillList: React.FC<SkillListProps> = ({ skills, onAdd, onRemove, className = '' }) => {
  const { t } = useTranslation();
  const [showAdd, setShowAdd] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: '', level: 'intermediate' });

  const handleAdd = () => {
    if (newSkill.name && newSkill.category && onAdd) {
      onAdd(newSkill);
      setNewSkill({ name: '', category: '', level: 'intermediate' });
      setShowAdd(false);
    }
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-tdop-navy">{t('profile.skills')}</h3>
        {onAdd && (
          <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="w-4 h-4 mr-1" />
            {t('profile.addSkill')}
          </Button>
        )}
      </div>

      {showAdd && onAdd && (
        <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-lg animate-slide-up">
          <input
            type="text"
            placeholder={t('profile.addSkill')}
            value={newSkill.name}
            onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm text-tdop-navy"
          />
          <select
            value={newSkill.category}
            onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 bg-white border border-gray-300 rounded text-sm text-tdop-navy"
          >
            <option value="">Category</option>
            {['Technology', 'Business', 'Design', 'Marketing'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={newSkill.level}
            onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
            className="px-3 py-2 bg-white border border-gray-300 rounded text-sm text-tdop-navy"
          >
            {['beginner', 'intermediate', 'advanced', 'expert'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <Button size="sm" onClick={handleAdd}>{t('common.save')}</Button>
        </div>
      )}

      {skills.length === 0 ? (
        <p className="text-center text-gray-500 py-4">{t('profile.noSkills')}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <div key={skill.id} className="flex items-center gap-2 group">
              <Badge variant={skill.level as string}>{skill.name}</Badge>
              {onRemove && (
                <button
                  onClick={() => onRemove(skill.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-100"
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
