import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { adminApi } from '@/services/api/adminApi';
import { formatDate } from '@/utils/formatDate';
import { ScrollText, User, Edit, Trash2, Shield } from 'lucide-react';

const AuditLogPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');

  const mockAuditLogs = [
    { id: '1', action: 'User login', user: 'admin', target: 'N/A', timestamp: '2024-01-15T10:30:00Z', metadata: {} },
    { id: '2', action: 'Opportunity created', user: 'john@example.com', target: 'Software Engineer', timestamp: '2024-01-15T09:00:00Z', metadata: {} },
    { id: '3', action: 'User verified', user: 'admin', target: 'jane@example.com', timestamp: '2024-01-14T15:00:00Z', metadata: {} },
  ];

  const filteredLogs = mockAuditLogs.filter(log =>
    `${log.action} ${log.user} ${log.target}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const actionIcons: Record<string, React.ReactNode> = {
    'User login': <Shield className="w-4 h-4 text-blue-500" />,
    'Opportunity created': <Edit className="w-4 h-4 text-green-500" />,
    'User verified': <Shield className="w-4 h-4 text-purple-500" />,
    'User deactivated': <Trash2 className="w-4 h-4 text-red-500" />,
    'Opportunity deleted': <Trash2 className="w-4 h-4 text-red-500" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
          <ScrollText className="w-8 h-8 text-tdop-primary" />
          {t('admin.auditLog')}
        </h1>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={t('admin.searchAuditLogs')} />

      <Card padding={false}>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {filteredLogs.map(log => (
            <div key={log.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  {actionIcons[log.action] || <Shield className="w-4 h-4 text-gray-400" />}
                </div>
                <div>
                  <p className="font-medium text-tdop-navy">{log.action}</p>
                  <p className="text-xs text-gray-500">by {log.user} → {log.target}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{formatDate(log.timestamp)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AuditLogPage;
