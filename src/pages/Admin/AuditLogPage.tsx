import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { adminApi } from '@/services/api/adminApi';
import { ScrollText, Shield, Edit, Trash2, User, Clock, Search, RefreshCw } from 'lucide-react';

interface AuditLog {
id: number;
action: string;
entityType: string;
entityId?: number;
userId?: number;
oldValue?: string;
newValue?: string;
ipAddress?: string;
timestamp: string;
}

const AuditLogPage: React.FC = () => {
const [logs, setLogs] = useState<AuditLog[]>([]);
const [loading, setLoading] = useState(true);
const [filter, setFilter] = useState('');

useEffect(() => {
fetchLogs();
}, []);

const fetchLogs = async () => {
try {
const data = await adminApi.getAuditLog();
setLogs(Array.isArray(data) ? data : []);
} catch (err) {
console.error(err);
} finally {
setLoading(false);
}
};

const filteredLogs = filter
? logs.filter(log =>
log.action.toLowerCase().includes(filter.toLowerCase()) ||
log.entityType.toLowerCase().includes(filter.toLowerCase())
)
: logs;

const getActionIcon = (action: string) => {
if (action.toLowerCase().includes('delete')) return <Trash2 className="w-4 h-4 text-red-500" />;
if (action.toLowerCase().includes('create') || action.toLowerCase().includes('register')) return <Edit className="w-4 h-4 text-green-500" />;
if (action.toLowerCase().includes('login')) return <Shield className="w-4 h-4 text-blue-500" />;
if (action.toLowerCase().includes('update') || action.toLowerCase().includes('change')) return <Edit className="w-4 h-4 text-yellow-500" />;
return <Shield className="w-4 h-4 text-gray-400" />;
};

const getActionColor = (action: string) => {
if (action.toLowerCase().includes('delete')) return 'danger';
if (action.toLowerCase().includes('create') || action.toLowerCase().includes('register')) return 'success';
if (action.toLowerCase().includes('login')) return 'info';
return 'default';
};

if (loading) {
return (
<div className="max-w-7xl mx-auto px-4 py-8">
<div className="animate-pulse space-y-4">
{[...Array(10)].map((_, i) => (
<div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
))}
</div>
</div>
);
}

return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
<div>
<h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
<ScrollText className="w-8 h-8 text-tdop-primary" />
Audit Log
</h1>
<p className="text-gray-500 mt-1">Track all platform activities and changes</p>
</div>

<div className="flex items-center gap-3">
<div className="relative flex-1 max-w-sm">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
<input
type="text"
placeholder="Filter logs..."
value={filter}
onChange={(e) => setFilter(e.target.value)}
className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
/>
</div>
<button
onClick={fetchLogs}
className="px-3 py-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
>
<RefreshCw className="w-4 h-4" />
</button>
</div>

<Card padding={false}>
<div className="divide-y divide-gray-100">
{filteredLogs.length === 0 ? (
<div className="p-8 text-center text-gray-500">
<ScrollText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
<p>No audit logs found</p>
</div>
) : (
filteredLogs.map((log) => (
<div key={log.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
{getActionIcon(log.action)}
</div>
<div>
<div className="flex items-center gap-2">
<p className="font-medium text-tdop-navy">{log.action}</p>
<Badge variant={getActionColor(log.action) as any}>{log.entityType}</Badge>
</div>
<p className="text-xs text-gray-500 mt-1">
{log.entityId && <span>Entity #{log.entityId}</span>}
{log.userId && <span> • User #{log.userId}</span>}
{log.oldValue && log.newValue && (
<span> • Changed from "{log.oldValue}" to "{log.newValue}"</span>
)}
</p>
</div>
</div>
<div className="flex items-center gap-2 text-xs text-gray-400">
<Clock className="w-3 h-3" />
{new Date(log.timestamp).toLocaleString()}
{log.ipAddress && <span className="text-gray-300">• {log.ipAddress}</span>}
</div>
</div>
))
)}
</div>
</Card>
</div>
);
};

export default AuditLogPage;
