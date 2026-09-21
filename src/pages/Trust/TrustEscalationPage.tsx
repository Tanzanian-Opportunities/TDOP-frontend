import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import InputDialog from '@/components/ui/InputDialog';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Pagination from '@/components/ui/Pagination';
import { trustApi } from '@/services/api/trustApi';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { useNotificationContext } from '@/context/NotificationContext';
import {
  AlertTriangle, CheckCircle, XCircle, Clock, ArrowUp,
  Search, User, MessageSquare, Shield
} from 'lucide-react';

interface Escalation {
  id: number;
  targetType: string;
  targetId: number;
  reason: string;
  description?: string;
  status: string;
  escalatedBy?: { firstName: string; lastName: string; email: string };
  assignedTo?: { firstName: string; lastName: string; email: string };
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
}

const PAGE_SIZE = 10;

const TrustEscalationPage: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [createTarget, setCreateTarget] = useState(false);
  const [resolveTarget, setResolveTarget] = useState<{ id: number; reason: string } | null>(null);
  const [dismissTarget, setDismissTarget] = useState<{ id: number; reason: string } | null>(null);
  const [assignTarget, setAssignTarget] = useState<{ id: number; reason: string } | null>(null);
  const [officers, setOfficers] = useState<any[]>([]);

  useEffect(() => { loadEscalations(); loadOfficers(); }, []);

  const loadEscalations = async () => {
    try {
      const data = await trustApi.getEscalations();
      setEscalations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadOfficers = async () => {
    try {
      const data = await trustApi.getTrustOfficers();
      setOfficers(Array.isArray(data) ? data : []);
    } catch (err) { /* ignore */ }
  };

  const handleCreate = async (reason: string) => {
    setActionLoading(true);
    try {
      await trustApi.createEscalation({ targetType: 'SYSTEM', targetId: 0, reason, description: reason });
      addNotification({ type: 'success', title: 'Created', message: 'Escalation created.' });
      setCreateTarget(false);
      loadEscalations();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: t('trustEscalation.failedCreate') });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async (resolution: string) => {
    if (!resolveTarget) return;
    setActionLoading(true);
    try {
      await trustApi.resolveEscalation(String(resolveTarget.id), resolution);
      addNotification({ type: 'success', title: 'Resolved', message: 'Escalation resolved.' });
      setResolveTarget(null);
      setSelectedEscalation(null);
      loadEscalations();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: t('trustEscalation.failedResolve') });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismiss = async () => {
    if (!dismissTarget) return;
    setActionLoading(true);
    try {
      await trustApi.dismissEscalation(String(dismissTarget.id));
      addNotification({ type: 'info', title: 'Dismissed', message: 'Escalation dismissed.' });
      setDismissTarget(null);
      setSelectedEscalation(null);
      loadEscalations();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: t('trustEscalation.failedDismiss') });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async (officerId: string) => {
    if (!assignTarget) return;
    setActionLoading(true);
    try {
      await trustApi.assignEscalation(String(assignTarget.id), officerId);
      addNotification({ type: 'success', title: 'Assigned', message: 'Escalation assigned.' });
      setAssignTarget(null);
      loadEscalations();
    } catch (err) {
      addNotification({ type: 'error', title: 'Error', message: t('trustEscalation.failedAssign') });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError />;

  const filtered = escalations.filter(e => {
    const matchesSearch = !searchQuery || e.reason?.toLowerCase().includes(searchQuery.toLowerCase()) || e.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || e.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = {
    open: escalations.filter(e => e.status === 'OPEN').length,
    inProgress: escalations.filter(e => e.status === 'IN_PROGRESS').length,
    resolved: escalations.filter(e => e.status === 'RESOLVED').length,
    dismissed: escalations.filter(e => e.status === 'DISMISSED').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OPEN': return <Badge variant="danger">{t('trustEscalation.open')}</Badge>;
      case 'IN_PROGRESS': return <Badge variant="primary">{t('trustEscalation.inProgress')}</Badge>;
      case 'RESOLVED': return <Badge className="bg-tdop-secondary text-white">{t('trustEscalation.resolved')}</Badge>;
      case 'DISMISSED': return <Badge variant="secondary">{t('trustEscalation.dismissed')}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {selectedEscalation ? (
        <div className="space-y-6">
          <button onClick={() => setSelectedEscalation(null)} className="flex items-center gap-2 text-sm text-tdop-primary hover:underline focus:outline-none focus:ring-2 focus:ring-tdop-primary rounded" aria-label="Go back">
            {t('trustEscalation.backToEscalations')}
          </button>
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-tdop-navy flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Escalation #{selectedEscalation.id}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{selectedEscalation.reason}</p>
              </div>
              {getStatusBadge(selectedEscalation.status)}
            </div>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('trustEscalation.target')}</label>
                  <p className="mt-1 text-sm text-gray-600 capitalize">{selectedEscalation.targetType?.replace('_', ' ')} #{selectedEscalation.targetId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('trustEscalation.created')}</label>
                  <p className="mt-1 text-sm text-gray-600">{selectedEscalation.createdAt ? new Date(selectedEscalation.createdAt).toLocaleString() : '—'}</p>
                </div>
              </div>
              {selectedEscalation.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('trustEscalation.description')}</label>
                  <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{selectedEscalation.description}</p>
                </div>
              )}
              {selectedEscalation.escalatedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('trustEscalation.escalatedBy')}</label>
                  <p className="mt-1 text-sm text-gray-600">{selectedEscalation.escalatedBy.firstName} {selectedEscalation.escalatedBy.lastName}</p>
                </div>
              )}
              {selectedEscalation.assignedTo && (
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('trustEscalation.assignedTo')}</label>
                  <p className="mt-1 text-sm text-gray-600">{selectedEscalation.assignedTo.firstName} {selectedEscalation.assignedTo.lastName}</p>
                </div>
              )}
              {selectedEscalation.resolution && (
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('trustEscalation.resolution')}</label>
                  <p className="mt-1 text-sm text-gray-600 bg-teal-50 p-3 rounded-lg">{selectedEscalation.resolution}</p>
                </div>
              )}
            </div>
            {selectedEscalation.status !== 'RESOLVED' && selectedEscalation.status !== 'DISMISSED' && (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => setResolveTarget({ id: selectedEscalation.id, reason: selectedEscalation.reason })} disabled={actionLoading} className="bg-tdop-secondary hover:bg-teal-700 text-white">
                   <CheckCircle className="w-4 h-4 mr-2" /> {t('trustEscalation.resolve')}
                </Button>
                <Button onClick={() => setAssignTarget({ id: selectedEscalation.id, reason: selectedEscalation.reason })} variant="outline" disabled={actionLoading}>
                   <User className="w-4 h-4 mr-2" /> {t('trustEscalation.assign')}
                </Button>
                <Button onClick={() => setDismissTarget({ id: selectedEscalation.id, reason: selectedEscalation.reason })} variant="danger" disabled={actionLoading}>
                   <XCircle className="w-4 h-4 mr-2" /> {t('trustEscalation.dismiss')}
                </Button>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-tdop-navy flex items-center gap-2">
                <ArrowUp className="w-7 h-7 text-amber-500" />
                Escalations
              </h1>
              <p className="text-sm text-gray-500 mt-1">{t('trustEscalation.subtitle')}</p>
            </div>
            <Button onClick={() => setCreateTarget(true)} className="bg-tdop-primary hover:bg-blue-700 text-white">
              <AlertTriangle className="w-4 h-4 mr-2" /> {t('trustEscalation.newEscalation')}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-5 h-5" /><span className="text-sm font-medium">{t('trustEscalation.open')}</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.open}</p>
            </Card>
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 text-tdop-primary"><Clock className="w-5 h-5" /><span className="text-sm font-medium">{t('trustEscalation.inProgress')}</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.inProgress}</p>
            </Card>
            <Card className="p-4 bg-teal-50 border border-teal-200">
              <div className="flex items-center gap-2 text-tdop-secondary"><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">{t('trustEscalation.resolved')}</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.resolved}</p>
            </Card>
            <Card className="p-4 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600"><XCircle className="w-5 h-5" /><span className="text-sm font-medium">{t('trustEscalation.dismissed')}</span></div>
              <p className="text-2xl font-bold text-tdop-navy mt-1">{stats.dismissed}</p>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder={t('trustEscalation.searchPlaceholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary focus:border-transparent"
                  aria-label="Search escalations"
                />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tdop-primary" aria-label="Filter by status">
                <option value="all">{t('trustEscalation.allStatus')}</option>
                <option value="open">{t('trustEscalation.open')}</option>
                <option value="in_progress">{t('trustEscalation.inProgress')}</option>
                <option value="resolved">{t('trustEscalation.resolved')}</option>
                <option value="dismissed">{t('trustEscalation.dismissed')}</option>
              </select>
            </div>
          </Card>

          <Card className="overflow-hidden">
            {paginated.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-medium">{t('trustEscalation.noEscalations')}</p>
              </div>
            ) : (
              <div className="divide-y" role="list" aria-label="Escalations list">
                {paginated.map(e => (
                  <button key={e.id} onClick={() => setSelectedEscalation(e)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-tdop-primary"
                    role="listitem"
                    aria-label={`Escalation: ${e.reason}, status ${e.status}`}
                  >
                    <div className="p-2 bg-amber-50 rounded-lg shrink-0"><AlertTriangle className="w-5 h-5 text-amber-500" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-tdop-navy truncate">{e.reason}</p>
                      <p className="text-xs text-gray-500 truncate">{e.targetType?.replace('_', ' ')} #{e.targetId}</p>
                    </div>
                    {getStatusBadge(e.status)}
                    <span className="text-xs text-gray-400 shrink-0">{e.createdAt ? new Date(e.createdAt).toLocaleDateString() : '—'}</span>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </>
      )}

      <InputDialog open={!!createTarget} onCancel={() => setCreateTarget(false)} onConfirm={handleCreate} title={t('trustEscalation.newEscalation')} label={t('trustEscalation.reason')} placeholder={t('trustEscalation.reasonPlaceholder')} loading={actionLoading} />
      <InputDialog open={!!resolveTarget} onCancel={() => setResolveTarget(null)} onConfirm={handleResolve} title={t('trustEscalation.resolveEscalation')} label={t('trustEscalation.resolution')} placeholder={t('trustEscalation.resolvePlaceholder')} loading={actionLoading} />
      <ConfirmDialog open={!!dismissTarget} onCancel={() => setDismissTarget(null)} onConfirm={handleDismiss} title={t('trustEscalation.dismissEscalation')} message={`Dismiss: "${dismissTarget?.reason}"?`} confirmLabel={t('trustEscalation.dismiss')} loading={actionLoading} />

      {assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Assign escalation">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAssignTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-tdop-navy mb-4">{t('trustEscalation.assignEscalation')}</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {officers.filter(o => o.role === 'VERIFICATION_OFFICER' || o.role === 'MODERATOR' || o.role === 'ADMIN').map(officer => (
                <button key={officer.id} onClick={() => handleAssign(String(officer.id))}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="p-2 bg-tdop-primary/10 rounded-full"><User className="w-4 h-4 text-tdop-primary" /></div>
                  <div>
                    <p className="text-sm font-medium text-tdop-navy">{officer.firstName} {officer.lastName}</p>
                    <p className="text-xs text-gray-500">{officer.email}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setAssignTarget(null)}>{t('trustEscalation.cancel')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustEscalationPage;
