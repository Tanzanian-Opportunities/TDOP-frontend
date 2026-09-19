import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { superAdminApi } from '@/services/api/superAdminApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Wrench } from 'lucide-react';

interface ConfigEntry {
  key: string;
  value: string;
  description?: string;
}

const SuperAdminConfigPage: React.FC = () => {
  const [configs, setConfigs] = useState<ConfigEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchConfigs = async () => {
    try {
      const result = await superAdminApi.getConfig();
      const entries = Object.entries(result).map(([key, value]) => ({
        key,
        value: String(value?.value ?? value),
        description: value?.description,
      }));
      setConfigs(entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleAddConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    setSaving(true);
    try {
      await superAdminApi.setConfig(newKey, newValue);
      setNewKey('');
      setNewValue('');
      setNewDescription('');
      setShowAddForm(false);
      await fetchConfigs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Platform Configuration</h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {showAddForm ? 'Cancel' : 'Add Config'}
        </button>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">New Configuration Entry</h2>
          <form onSubmit={handleAddConfig} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Key</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g. maxUploadSize"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">Key</th>
                <th className="pb-3 font-medium">Value</th>
                <th className="pb-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {configs.map((config) => (
                <tr key={config.key} className="border-b last:border-0">
                  <td className="py-3">
                    <Badge variant="outline">{config.key}</Badge>
                  </td>
                  <td className="py-3 font-mono text-xs">{config.value}</td>
                  <td className="py-3 text-muted-foreground">
                    {config.description || '—'}
                  </td>
                </tr>
              ))}
              {configs.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-muted-foreground">
                    No configuration entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminConfigPage;
