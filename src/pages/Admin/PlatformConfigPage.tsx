import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import InputDialog from '@/components/ui/InputDialog';
import { PageError } from '@/components/ui/PageStates';
import { adminApi } from '@/services/api/adminApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { Shield, Settings, Users, RefreshCw, Search } from 'lucide-react';

interface Config {
id: number;
configKey: string;
configValue: string;
description: string;
}

const PlatformConfigPage: React.FC = () => {
const { t } = useTranslation();
const { addNotification } = useNotificationContext();
const [configs, setConfigs] = useState<Config[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const [editingKey, setEditingKey] = useState<string | null>(null);
const [editValue, setEditValue] = useState('');
const [addStep, setAddStep] = useState<'key' | 'value' | 'description' | null>(null);
const [newKey, setNewKey] = useState('');
const [newValue, setNewValue] = useState('');
const [actionLoading, setActionLoading] = useState(false);

useEffect(() => {
fetchConfigs();
}, []);

const fetchConfigs = async () => {
try {
const data = await adminApi.getConfig();
setConfigs(Array.isArray(data) ? data : []);
} catch (err) {
console.error(err);
setError(true);
} finally {
setLoading(false);
}
};

const handleSave = async (key: string) => {
try {
await adminApi.setConfig(key, editValue);
setEditingKey(null);
fetchConfigs();
} catch (err) {
addNotification({ type: 'error', title: 'Error', message: t('adminPlatformConfig.failedSave') });
console.error(err);
}
};

const handleAddConfig = async () => {
setAddStep('key');
};

const handleKeyConfirm = (key: string) => {
setNewKey(key);
setAddStep('value');
};

const handleValueConfirm = async (value: string) => {
setNewValue(value);
setAddStep('description');
};

const handleDescriptionConfirm = async (description: string) => {
setActionLoading(true);
try {
  await adminApi.setConfig(newKey, newValue, description || undefined);
  fetchConfigs();
} catch (err) {
  addNotification({ type: 'error', title: 'Error', message: t('adminPlatformConfig.failedAdd') });
  console.error(err);
} finally {
  setActionLoading(false);
  setAddStep(null);
  setNewKey('');
  setNewValue('');
}
};

if (loading) {
return (
<div className="max-w-7xl mx-auto px-4 py-8">
<div className="animate-pulse space-y-4">
{[...Array(5)].map((_, i) => (
<div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
))}
</div>
</div>
);
}

if (error) return <PageError message={t('adminPlatformConfig.failedToLoad')} onRetry={fetchConfigs} />;

return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
<div className="flex items-center justify-between">
<div>
<h1 className="text-3xl font-bold text-tdop-navy">{t('adminPlatformConfig.title')}</h1>
<p className="text-gray-500 mt-1">{t('adminPlatformConfig.subtitle')}</p>
</div>
<div className="flex gap-2">
<Button onClick={fetchConfigs} variant="outline" size="sm">
<RefreshCw className="w-4 h-4 mr-1" /> {t('adminPlatformConfig.refresh')}
</Button>
<Button onClick={handleAddConfig} size="sm">
<Settings className="w-4 h-4 mr-1" /> {t('adminPlatformConfig.addConfig')}
</Button>
</div>
</div>

<Card>
<div className="divide-y divide-gray-100">
{configs.length === 0 ? (
<div className="p-8 text-center text-gray-500">
<Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
<p>{t('adminPlatformConfig.noConfig')}</p>
</div>
) : (
configs.map((config) => (
<div key={config.id} className="p-4 hover:bg-gray-50 transition-colors">
<div className="flex items-center justify-between">
<div className="flex-1">
<div className="flex items-center gap-3">
<code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
{config.configKey}
</code>
{editingKey === config.configKey ? (
<div className="flex items-center gap-2">
<input
type="text"
value={editValue}
onChange={(e) => setEditValue(e.target.value)}
className="px-2 py-1 border rounded text-sm"
/>
<Button size="sm" onClick={() => handleSave(config.configKey)}>{t('adminPlatformConfig.save')}</Button>
<Button size="sm" variant="outline" onClick={() => setEditingKey(null)}>{t('adminPlatformConfig.cancel')}</Button>
</div>
) : (
<span className="text-sm text-tdop-navy">{config.configValue}</span>
)}
</div>
{config.description && (
<p className="text-xs text-gray-500 mt-1">{config.description}</p>
)}
</div>
{editingKey !== config.configKey && (
<Button size="sm" variant="outline" onClick={() => { setEditingKey(config.configKey); setEditValue(config.configValue); }}>
{t('adminPlatformConfig.edit')}
</Button>
)}
</div>
</div>
))
)}
</div>
</Card>

<InputDialog
  open={addStep === 'key'}
  title={t('adminPlatformConfig.addConfigKey')}
  label={t('adminPlatformConfig.keyPlaceholder')}
  placeholder={t('adminPlatformConfig.defaultKey')}
  onConfirm={handleKeyConfirm}
  onCancel={() => { setAddStep(null); setNewKey(''); setNewValue(''); }}
/>
<InputDialog
  open={addStep === 'value'}
  title={t('adminPlatformConfig.addConfigValue')}
  label={t('adminPlatformConfig.valuePlaceholder')}
  placeholder={t('adminPlatformConfig.defaultValue')}
  onConfirm={handleValueConfirm}
  onCancel={() => setAddStep('key')}
/>
<InputDialog
  open={addStep === 'description'}
  title={t('adminPlatformConfig.addConfigDesc')}
  label={t('adminPlatformConfig.descPlaceholder')}
  placeholder={t('adminPlatformConfig.defaultDesc')}
  required={false}
  onConfirm={handleDescriptionConfirm}
  onCancel={() => setAddStep(null)}
  loading={actionLoading}
/>
</div>
);
};

export default PlatformConfigPage;
