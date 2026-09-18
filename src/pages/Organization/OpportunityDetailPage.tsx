import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { opportunityApi } from '@/services/api/opportunityApi';
import { applicationApi } from '@/services/api/applicationApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { formatDate } from '@/utils/formatDate';
import { PageError } from '@/components/ui/PageStates';
import { EmptyState } from '@/components/dashboard/EmptyState';
import axiosInstance from '@/services/api/axiosInstance';
import { ArrowLeft, Clock, FileText, Users, Activity, MapPin, Briefcase, Send, Globe, XCircle, CheckCircle, Calendar, Mail, User } from 'lucide-react';

type TabType = 'overview' | 'applications' | 'activity';

const statusColors: Record<string, any> = {
  DRAFT: 'gray', draft: 'gray', SUBMITTED: 'info', submitted: 'info',
  UNDER_REVIEW: 'warning', PUBLISHED: 'success', published: 'success',
  ACTIVE: 'success', open: 'success', CLOSED: 'danger', closed: 'danger',
  EXPIRED: 'gray', expired: 'gray',
};

const toList = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return String(val).split('\n').filter(Boolean);
};

const OpportunityDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();
  const [opp, setOpp] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { if (id) fetchOpp(); }, [id]);
  useEffect(() => { if (activeTab === 'applications' && id) fetchApplicants(); }, [activeTab, id]);

  const fetchOpp = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await opportunityApi.getOpportunity(id);
      setOpp(data?.data || data);
    } catch (err: any) {
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async () => {
    if (!id) return;
    try {
      const data = await applicationApi.getApplicants(id);
      setApplicants(Array.isArray(data) ? data : data?.data || []);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await opportunityApi.submitOpportunity(id);
      addNotification({ type: 'success', title: t('common.success'), message: t('manageOpp.submitForReview') });
      fetchOpp();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || 'Failed' });
    } finally { setActionLoading(false); }
  };

  const handlePublish = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await opportunityApi.publishOpportunity(id);
      addNotification({ type: 'success', title: t('common.success'), message: t('manageOpp.publish') });
      fetchOpp();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || 'Failed' });
    } finally { setActionLoading(false); }
  };

  const handleClose = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await axiosInstance.post(`/organization/opportunities/${id}/close`);
      addNotification({ type: 'success', title: t('common.success'), message: t('manageOpp.close') });
      fetchOpp();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || 'Failed' });
    } finally { setActionLoading(false); }
  };

  const handleShortlist = async (appId: string) => {
    try {
      await applicationApi.shortlistApplication(appId);
      addNotification({ type: 'success', title: t('common.success'), message: t('manageOpp.shortlistSuccess') });
      fetchApplicants();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || 'Failed' });
    }
  };

  const handleReject = async (appId: string) => {
    try {
      await applicationApi.rejectApplication(appId);
      addNotification({ type: 'success', title: t('common.success'), message: t('manageOpp.rejectSuccess') });
      fetchApplicants();
    } catch (err: any) {
      addNotification({ type: 'error', title: t('common.error'), message: err?.message || 'Failed' });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tdop-primary" /></div>;
  if (error || !opp) return <div className="max-w-5xl mx-auto px-4 py-8"><PageError message={error || t('common.notFound')} onRetry={fetchOpp} /></div>;

  const status = (opp.status || '').toUpperCase();
  const requirements = toList(opp.requirements);
  const benefits = toList(opp.benefits);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <button onClick={() => navigate('/organization/opportunities')} className="flex items-center gap-2 text-gray-500 hover:text-tdop-navy transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('common.back')}
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-tdop-navy">{opp.title}</h1>
            <Badge variant={statusColors[status] || 'gray'}>{status}</Badge>
          </div>
          {opp.updatedAt && <p className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {t('manageOpp.title')}: {formatDate(opp.updatedAt)}</p>}
        </div>
        <div className="flex items-center gap-2">
          {status === 'DRAFT' && <Button onClick={handleSubmit} loading={actionLoading}><Send className="w-4 h-4 mr-2" />{t('manageOpp.submitForReview')}</Button>}
          {status === 'SUBMITTED' && <Button onClick={handlePublish} loading={actionLoading}><Globe className="w-4 h-4 mr-2" />{t('manageOpp.publish')}</Button>}
          {(status === 'PUBLISHED' || status === 'ACTIVE' || status === 'open') && <Button variant="danger" onClick={handleClose} loading={actionLoading}><XCircle className="w-4 h-4 mr-2" />{t('manageOpp.close')}</Button>}
          <Button variant="outline" onClick={() => navigate(`/edit-opportunity/${opp.id}`)}>{t('manageOpp.edit')}</Button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {(['overview', 'applications', 'activity'] as TabType[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab ? 'border-tdop-primary text-tdop-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab === 'overview' && <FileText className="w-4 h-4 inline mr-1" />}
              {tab === 'applications' && <Users className="w-4 h-4 inline mr-1" />}
              {tab === 'activity' && <Activity className="w-4 h-4 inline mr-1" />}
              {t(`manageOpp.${tab}`)}
              {tab === 'applications' && applicants.length > 0 && <span className="ml-1 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">{applicants.length}</span>}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <Card><div className="space-y-3">
            <h3 className="font-semibold text-tdop-navy">{t('createOpp.basicInfo')}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">{t('opportunities.typeLabel')}</span><p className="text-tdop-navy">{opp.type}</p></div>
              <div><span className="text-gray-500">{t('createOpp.category')}</span><p className="text-tdop-navy">{opp.category || '-'}</p></div>
              <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" /><span className="text-gray-500">{t('opportunities.location')}</span><p className="text-tdop-navy ml-4">{opp.location || '-'}</p></div>
              <div><span className="text-gray-500">{t('opportunities.experience')}</span><p className="text-tdop-navy">{opp.experienceLevel || '-'}</p></div>
            </div>
          </div></Card>

          <Card><div className="space-y-2">
            <h3 className="font-semibold text-tdop-navy">{t('opportunities.description')}</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{opp.description}</p>
          </div></Card>

          {requirements.length > 0 && <Card><div className="space-y-2">
            <h3 className="font-semibold text-tdop-navy">{t('createOpp.requirements')}</h3>
            <ul className="space-y-1">{requirements.map((r, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-tdop-primary mt-0.5 flex-shrink-0" />{r}</li>)}</ul>
          </div></Card>}

          {benefits.length > 0 && <Card><div className="space-y-2">
            <h3 className="font-semibold text-tdop-navy">{t('createOpp.benefits')}</h3>
            <ul className="space-y-1">{benefits.map((b, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-tdop-secondary mt-0.5 flex-shrink-0" />{b}</li>)}</ul>
          </div></Card>}

          {opp.eligibility && <Card><div className="space-y-2">
            <h3 className="font-semibold text-tdop-navy">{t('createOpp.eligibility')}</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{opp.eligibility}</p>
          </div></Card>}

          <Card><div className="grid grid-cols-2 gap-3 text-sm">
            {opp.salaryRange && <div><span className="text-gray-500">{t('createOpp.salaryRange')}</span><p className="text-tdop-navy">{opp.salaryRange}</p></div>}
            {(opp.deadline || opp.applicationDeadline) && <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" /><span className="text-gray-500">{t('opportunities.deadline')}</span><p className="text-tdop-navy ml-4">{formatDate(opp.deadline || opp.applicationDeadline)}</p></div>}
            {opp.applicationUrl && <div><span className="text-gray-500">{t('createOpp.applicationUrl')}</span><a href={opp.applicationUrl} target="_blank" rel="noopener noreferrer" className="block text-tdop-primary hover:underline text-sm break-all">{opp.applicationUrl}</a></div>}
            {opp.requiredDocuments && <div className="col-span-2"><span className="text-gray-500">{t('createOpp.requiredDocuments')}</span><p className="text-sm text-tdop-navy whitespace-pre-wrap">{typeof opp.requiredDocuments === 'string' ? opp.requiredDocuments : opp.requiredDocuments?.join(', ')}</p></div>}
          </div></Card>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-3">
          {applicants.length === 0 ? (
            <EmptyState icon={<Users className="w-8 h-8 text-gray-300" />} title={t('manageOpp.noApplicants')} description={t('manageOpp.noApplicantsDescription')} />
          ) : applicants.map(app => (
            <Card key={app.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"><User className="w-5 h-5 text-gray-500" /></div>
                  <div>
                    <h4 className="font-medium text-tdop-navy">{app.user?.fullName || app.applicantName || t('common.user')}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{app.user?.email || app.applicantEmail || ''}</p>
                    {app.createdAt && <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" />{formatDate(app.createdAt)}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={app.status === 'SHORTLISTED' ? 'success' : app.status === 'REJECTED' ? 'danger' : 'gray'} size="sm">{app.status}</Badge>
                  {(app.status === 'APPLIED' || app.status === 'UNDER_REVIEW' || app.status === 'PENDING') && (
                    <>
                      <Button size="sm" onClick={() => handleShortlist(app.id)}>{t('manageOpp.shortlist')}</Button>
                      <Button size="sm" variant="danger" onClick={() => handleReject(app.id)}>{t('manageOpp.reject')}</Button>
                    </>
                  )}
                </div>
              </div>
              {app.coverLetter && <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 whitespace-pre-wrap">{app.coverLetter}</div>}
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'activity' && (
        <Card>
          <div className="space-y-4">
            <h3 className="font-semibold text-tdop-navy">{t('manageOpp.activityTimeline')}</h3>
            {opp.createdAt && <div className="flex items-center gap-3 text-sm"><div className="w-2 h-2 rounded-full bg-gray-400" /><span className="text-gray-600">Created</span><span className="text-gray-400 ml-auto">{formatDate(opp.createdAt)}</span></div>}
            {opp.publishedAt && <div className="flex items-center gap-3 text-sm"><div className="w-2 h-2 rounded-full bg-tdop-secondary" /><span className="text-gray-600">Published</span><span className="text-gray-400 ml-auto">{formatDate(opp.publishedAt)}</span></div>}
            {opp.updatedAt && opp.updatedAt !== opp.createdAt && <div className="flex items-center gap-3 text-sm"><div className="w-2 h-2 rounded-full bg-tdop-primary" /><span className="text-gray-600">Last Updated</span><span className="text-gray-400 ml-auto">{formatDate(opp.updatedAt)}</span></div>}
            {!opp.publishedAt && !opp.updatedAt && <p className="text-sm text-gray-500">{t('manageOpp.noActivity')}</p>}
          </div>
        </Card>
      )}
    </div>
  );
};

export default OpportunityDetailPage;
