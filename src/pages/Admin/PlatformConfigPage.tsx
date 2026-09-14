import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/services/api/adminApi';
import { Shield, Settings, Users, RefreshCw } from 'lucide-react';

interface Config {
id: number;
configKey: string;
configValue: string;
description: string;
}

const PlatformConfigPage: React.FC = () => {
const [configs, setConfigs] = useState<Config[]>([]);
const [loading, setLoading] = useState(true);
const [editingKey, setEditingKey] = useState<string | null>(null);
const [editValue, setEditValue] = useState('');

useEffect(() => {
fetchConfigs();
}, []);

const fetchConfigs = async () => {
try {
const data = await adminApi.getConfig();
setConfigs(Array.isArray(data) ? data : []);
} catch (err) {
console.error(err);
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
console.error(err);
}
};

const handleAddConfig = async () => {
const key = prompt('Config key:');
if (!key) return;
const value = prompt('Config value:');
if (value === null) return;
const description = prompt('Description (optional):');
try {
await adminApi.setConfig(key, value, description || undefined);
fetchConfigs();
} catch (err) {
console.error(err);
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

return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
<div className="flex items-center justify-between">
<div>
<h1 className="text-3xl font-bold text-tdop-navy">Platform Configuration</h1>
<p className="text-gray-500 mt-1">Super Admin - Manage platform settings</p>
</div>
<div className="flex gap-2">
<Button onClick={fetchConfigs} variant="outline" size="sm">
<RefreshCw className="w-4 h-4 mr-1" /> Refresh
</Button>
<Button onClick={handleAddConfig} size="sm">
<Settings className="w-4 h-4 mr-1" /> Add Config
</Button>
</div>
</div>

<Card>
<div className="divide-y divide-gray-100">
{configs.length === 0 ? (
<div className="p-8 text-center text-gray-500">
<Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
<p>No platform configuration found</p>
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
<Button size="sm" onClick={() => handleSave(config.configKey)}>Save</Button>
<Button size="sm" variant="outline" onClick={() => setEditingKey(null)}>Cancel</Button>
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
Edit
</Button>
)}
</div>
</div>
))
)}
</div>
</Card>
</div>
);
};

export default PlatformConfigPage;
