import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Plug, Plus } from 'lucide-react';

interface ConfigEntry { key: string; value: string; description?: string; updatedAt?: string; }

const SuperAdminIntegrationConfigPage: React.FC = () => {
  const { t } = useTranslation();
  const [configs, setConfigs] = useState<ConfigEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const loadConfigs = async () => {
    try {
      const data = await superAdminApi.getIntegrationConfig();
      setConfigs(Array.isArray(data) ? data : []);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadConfigs(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    setSaving(true);
    try {
      await superAdminApi.setIntegrationConfig(newKey, newValue, newDesc || undefined);
      setNewKey(''); setNewValue(''); setNewDesc(''); setShowAdd(false);
      await loadConfigs();
    } catch { setError(true); }
    finally { setSaving(false); }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
            <Plug className="w-7 h-7 text-tdop-primary" />
            Integration Configuration
          </h1>
          <p className="text-sm text-gray-500 mt-1">{t('superAdminDetail.externalServiceSettings')}</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-tdop-primary text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> {showAdd ? t('superAdminDetail.cancel') : t('superAdminDetail.addIntegration')}
        </button>
      </div>
      {showAdd && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-tdop-navy mb-3">{t('superAdminDetail.newIntegrationSetting')}</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('superAdminDetail.keyIntegration')}</label>
                <input type="text" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="e.g. email.provider" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('superAdminDetail.value')}</label>
                <input type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="e.g. SENDGRID" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('superAdminDetail.description')}</label>
                <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Optional" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary focus:border-transparent" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-tdop-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
              {saving ? t('superAdminDetail.saving') : t('superAdminDetail.save')}
            </button>
          </form>
        </Card>
      )}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.integration')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.value')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{t('superAdminDetail.description')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {configs.map((config) => (
                <tr key={config.key} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><span className="text-sm font-medium text-tdop-navy font-mono">{config.key}</span></td>
                  <td className="px-4 py-3">
                    <Badge variant={config.value === 'NOT_CONFIGURED' ? 'outline' : config.value === 'false' ? 'danger' : 'secondary'}>
                      {config.value}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{config.description || '—'}</td>
                </tr>
              ))}
              {configs.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500 text-sm">{t('superAdminDetail.noIntegrations')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminIntegrationConfigPage;
