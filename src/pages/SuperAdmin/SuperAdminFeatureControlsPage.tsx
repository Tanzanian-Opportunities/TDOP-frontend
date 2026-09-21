import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { ToggleLeft, Plus, Trash2 } from 'lucide-react';

interface FeatureFlag {
  key: string;
  value: string;
  description?: string;
  updatedAt?: string;
}

const SuperAdminFeatureControlsPage: React.FC = () => {
  const { t } = useTranslation();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('true');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const loadFlags = async () => {
    try {
      const data = await superAdminApi.getFeatureFlags();
      setFlags(Array.isArray(data) ? data : []);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadFlags(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    setSaving(true);
    try {
      await superAdminApi.setFeatureFlag(newKey, newValue, newDesc || undefined);
      setNewKey(''); setNewValue('true'); setNewDesc(''); setShowAdd(false);
      await loadFlags();
    } catch { setError(true); }
    finally { setSaving(false); }
  };

  const handleToggle = async (flag: FeatureFlag) => {
    const newVal = flag.value === 'true' ? 'false' : 'true';
    try {
      await superAdminApi.setFeatureFlag(flag.key, newVal, flag.description);
      await loadFlags();
    } catch { /* ignore */ }
  };

  const handleDelete = async (key: string) => {
    try {
      await superAdminApi.deleteFeatureFlag(key);
      await loadFlags();
    } catch { /* ignore */ }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
            <ToggleLeft className="w-7 h-7 text-tdop-primary" />
            Feature Controls
          </h1>
          <p className="text-sm text-gray-500 mt-1">{t('superAdminDetail.enableDisableFeatures')}</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-tdop-primary text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> {showAdd ? t('superAdminDetail.cancel') : t('superAdminDetail.addFeatureFlag')}
        </button>
      </div>
      {showAdd && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-tdop-navy mb-3">{t('superAdminDetail.newFeatureFlag')}</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('superAdminDetail.keyFeature')}</label>
                <input type="text" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="e.g. darkMode" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('superAdminDetail.value')}</label>
                <select value={newValue} onChange={(e) => setNewValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary focus:border-transparent">
                  <option value="true">{t('superAdminDetail.enabled')}</option>
                  <option value="false">{t('superAdminDetail.disabled')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('superAdminDetail.description')}</label>
                <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Optional" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary focus:border-transparent" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-tdop-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
              {saving ? t('superAdminDetail.saving') : t('superAdminDetail.saveFlag')}
            </button>
          </form>
        </Card>
      )}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.feature')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.status')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.description')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {flags.map((flag) => (
                <tr key={flag.key} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><span className="text-sm font-medium text-tdop-navy font-mono">{flag.key}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(flag)} className="focus:outline-none">
                      <Badge variant={flag.value === 'true' ? 'secondary' : 'danger'}>
                        {flag.value === 'true' ? t('superAdminDetail.enabledBadge') : t('superAdminDetail.disabledBadge')}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{flag.description || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(flag.key)} className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {flags.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">{t('superAdminDetail.noFeatureFlags')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminFeatureControlsPage;
