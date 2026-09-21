import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { useDocuments } from '@/hooks/useDocuments';
import { useNotificationContext } from '@/context/NotificationContext';
import { reportApi } from '@/services/api/reportApi';
import axiosInstance from '@/services/api/axiosInstance';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatSalary } from '@/utils/formatSalary';
import { formatDate } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';
import {
  MapPin, Briefcase, Clock, Calendar, Users, Check, FileText,
  ArrowLeft, X, AlertCircle, Share2, Flag, Bookmark, ExternalLink,
  Shield, ChevronRight, Sparkles, Eye, AlertTriangle,
} from 'lucide-react';

export const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { opportunities, isLoading } = useOpportunities();
  const { user, isAuthenticated, isSeeker } = useAuth();
  const { apply, isApplying } = useApplications();
  const { documents } = useDocuments();
  const { addNotification } = useNotificationContext();
  const { t } = useTranslation();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [applyError, setApplyError] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const opportunity = opportunities.find(opp => opp.id === id);

  const { data: relatedData } = useQuery({
    queryKey: ['related-opportunities', id],
    queryFn: async () => {
      if (!opportunity) return [];
      const { data } = await axiosInstance.get('/opportunities', {
        params: { type: opportunity.type, limit: 4 }
      });
      return (data?.data || []).filter((o: any) => o.id !== id).slice(0, 3);
    },
    enabled: !!opportunity,
    refetchOnWindowFocus: false,
  });

  const { data: profileCompletion } = useQuery({
    queryKey: ['profile-completion'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/profile/completion');
      return data?.completion || 0;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tdop-primary" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-tdop-light flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-tdop-navy mb-2">{t('opportunities.empty')}</h2>
        <p className="text-gray-500 mb-6">{t('opportunities.notFoundDescription')}</p>
        <Link to="/browse" className="inline-flex items-center gap-2 px-4 py-2 bg-tdop-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('opportunities.browseTitle')}
        </Link>
      </div>
    );
  }

  const isExpired = opportunity.applicationDeadline && new Date(opportunity.applicationDeadline) < new Date();
  const completion = typeof profileCompletion === 'number' ? profileCompletion : 0;

  const eligibilityChecks = [
    {
      label: t('opportunities.educationLevel'),
      met: !!opportunity.educationLevel,
      detail: opportunity.educationLevel || t('opportunities.notSpecified'),
    },
    {
      label: t('opportunities.experienceLevel'),
      met: !!opportunity.experienceLevel,
      detail: opportunity.experienceLevel || t('opportunities.notSpecified'),
    },
    {
      label: t('opportunities.skillsMatch'),
      met: opportunity.skills?.length > 0,
      detail: opportunity.skills?.length ? t('opportunities.skillsRequired', { count: opportunity.skills.length }) : t('opportunities.noSkillsRequired'),
    },
  ];

  const metCount = eligibilityChecks.filter(c => c.met).length;

  const handleApply = async () => {
    setApplyError('');
    try {
      await apply({
        opportunityId: opportunity.id,
        resumeUrl: selectedDocs[0] || '',
        coverLetter: coverLetter || undefined,
      });
      setShowApplyModal(false);
      setCoverLetter('');
      setSelectedDocs([]);
      addNotification({ type: 'success', title: t('opportunities.applicationSubmitted'), message: t('opportunities.appliedFor', { title: opportunity.title }) });
    } catch (err: any) {
      setApplyError(err?.message || t('opportunities.applicationFailed'));
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: opportunity.title, text: `Check out this opportunity: ${opportunity.title}`, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      addNotification({ type: 'info', title: t('opportunities.linkCopied'), message: t('opportunities.linkCopiedDescription') });
    }
  };

  const handleReport = async () => {
    if (!reportReason) return;
    try {
      await reportApi.createReport({
        type: reportReason,
        targetType: 'opportunity',
        targetId: opportunity.id,
        reason: reportReason,
        description: reportDescription || undefined,
      });
      setReportSubmitted(true);
      setTimeout(() => { setShowReportModal(false); setReportSubmitted(false); setReportReason(''); setReportDescription(''); }, 2000);
    } catch {
      addNotification({ type: 'error', title: t('common.error'), message: t('opportunities.reportFailed') });
    }
  };

  const toggleDoc = (docUrl: string) => {
    setSelectedDocs(prev => prev.includes(docUrl) ? prev.filter(u => u !== docUrl) : [...prev, docUrl]);
  };

  const daysLeft = opportunity.applicationDeadline
    ? Math.ceil((new Date(opportunity.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const related = relatedData || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-tdop-primary text-sm font-medium hover:gap-2.5 transition-all">
          <ArrowLeft className="w-4 h-4" /> {t('opportunities.backToOpportunities')}
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-1" /> {t('opportunities.share')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowReportModal(true)} className="text-gray-500 hover:text-red-600">
            <Flag className="w-4 h-4 mr-1" /> {t('opportunities.report')}
          </Button>
        </div>
      </div>

      <Card padding={false}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-tdop-navy">{opportunity.title}</h1>
              <p className="text-lg text-gray-600 mt-1 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {opportunity.company}
              </p>
            </div>
            <div className="flex gap-2">
              {opportunity.isVerified && (
                <div className="group relative">
                  <Badge variant="success"><Shield className="w-3 h-3 mr-1 inline" />{t('opportunities.verified')}</Badge>
                  <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white rounded-xl shadow-elevated border border-gray-100 text-xs text-gray-600 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                    This opportunity has been verified by TDOP. The organization and listing details have been reviewed.
                  </div>
                </div>
              )}
              {opportunity.isFeatured && <Badge variant="warning">{t('opportunities.featured')}</Badge>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {opportunity.location}{opportunity.isRemote ? ' (Remote)' : ''}
            </div>
            {opportunity.applicationDeadline && (
              <div className={`flex items-center gap-2 text-sm ${daysLeft !== null && daysLeft <= 3 ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
                <Calendar className="w-4 h-4" />
                {daysLeft !== null && daysLeft <= 3 ? (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {daysLeft <= 0 ? 'Deadline passed' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                  </span>
                ) : (
                  formatDate(opportunity.applicationDeadline, 'MMM d, yyyy')
                )}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              {opportunity.applicationsCount} {t('opportunities.applicants')}
            </div>
            {opportunity.category && (
              <Badge variant="gray">{opportunity.category}</Badge>
            )}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm text-gray-500">{t('opportunities.salary')}</p>
            <p className="text-xl font-bold text-tdop-navy mt-1">
              {formatSalary(opportunity.salaryMin, opportunity.salaryMax, opportunity.salaryCurrency)}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">{t('opportunities.typeLabel')}</p>
            <p className="text-xl font-bold text-tdop-navy mt-1 capitalize">{opportunity.type}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">{t('opportunities.experienceLabel')}</p>
            <p className="text-xl font-bold text-tdop-navy mt-1 capitalize">{opportunity.experienceLevel}</p>
          </Card>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-tdop-navy">{t('opportunities.description')}</h2>
          <p className="text-gray-600 leading-relaxed">{opportunity.description}</p>
        </div>

        {opportunity.skills?.length > 0 && (
          <div className="px-6 pb-4">
            <h3 className="font-medium text-tdop-navy mb-2">{t('opportunities.requiredSkills')}</h3>
            <div className="flex flex-wrap gap-2">
              {opportunity.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-tdop-primary/10 text-tdop-primary text-xs font-medium rounded-full">{skill}</span>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 pb-6 space-y-4">
          {(Array.isArray(opportunity.requirements) ? opportunity.requirements : (opportunity.requirements || '').split('\n').filter(Boolean)).length > 0 && (
            <div>
              <h3 className="font-medium text-tdop-navy mb-2">{t('opportunities.requirements')}</h3>
              <ul className="space-y-1">
                {(Array.isArray(opportunity.requirements) ? opportunity.requirements : (opportunity.requirements || '').split('\n').filter(Boolean)).map((req: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-tdop-primary mt-0.5 flex-shrink-0" />{req}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {opportunity.responsibilities.length > 0 && (
            <div>
              <h3 className="font-medium text-tdop-navy mb-2">{t('opportunities.responsibilities')}</h3>
              <ul className="space-y-1">
                {opportunity.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-tdop-primary mt-0.5 flex-shrink-0" />{resp}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(Array.isArray(opportunity.benefits) ? opportunity.benefits : (opportunity.benefits || '').split('\n').filter(Boolean)).length > 0 && (
            <div>
              <h3 className="font-medium text-tdop-navy mb-2">{t('opportunities.benefits')}</h3>
              <ul className="space-y-1">
                {(Array.isArray(opportunity.benefits) ? opportunity.benefits : (opportunity.benefits || '').split('\n').filter(Boolean)).map((benefit: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-tdop-primary mt-0.5 flex-shrink-0" />{benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Eligibility Match */}
      {isAuthenticated && isSeeker && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-tdop-primary" />
            <h3 className="font-semibold text-tdop-navy">Your match</h3>
          </div>
          <div className="space-y-2">
            {eligibilityChecks.map((check, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${check.met ? 'bg-emerald-100 text-tdop-secondary' : 'bg-gray-100 text-gray-400'}`}>
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-gray-700">{check.label}</span>
                <span className="text-gray-400 text-xs ml-auto">{check.detail}</span>
              </div>
            ))}
          </div>
          {completion < 80 && (
            <div className="mt-3 p-3 bg-amber-50 rounded-xl text-sm text-amber-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{t('opportunities.completeProfileForMatch')} <Link to="/profile" className="underline font-medium">{t('common.editProfile')}</Link></span>
            </div>
          )}
        </Card>
      )}

      {/* Related Opportunities */}
      {related.length > 0 && (
        <Card>
          <h3 className="font-semibold text-tdop-navy mb-3">{t('opportunities.relatedOpportunities')}</h3>
          <div className="space-y-2">
            {related.map((rel: any) => (
              <Link
                key={rel.id}
                to={`/opportunities/${rel.id}`}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-bento transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-tdop-primary/10 text-tdop-primary flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm text-tdop-navy truncate">{rel.title}</h4>
                    <p className="text-xs text-gray-400">{rel.company} · {rel.location}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Apply CTA */}
      {isAuthenticated && isSeeker && (
        <div className="sticky bottom-4 flex items-center justify-center gap-4">
          {isExpired ? (
            <div className="bg-white rounded-2xl shadow-elevated border border-gray-100 px-6 py-4 text-center">
              <p className="text-gray-500 font-medium">{t('opportunities.noLongerAccepting')}</p>
            </div>
          ) : (
            <Button size="lg" onClick={() => setShowApplyModal(true)} className="w-full md:w-auto">
              <FileText className="w-5 h-5 mr-2" />
              {t('opportunities.applyNow')}
            </Button>
          )}
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-label="Apply for opportunity">
          <div className="bg-white rounded-2xl shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-tdop-navy">{t('opportunities.applyFor', { title: opportunity.title })}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{t('opportunities.atCompany', { company: opportunity.company })}</p>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Close">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {applyError && (
                <div role="alert" className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{applyError}
                </div>
              )}

              {completion < 60 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">{t('opportunities.profileIncomplete', { percent: completion })}</p>
                    <p className="mt-1">{t('opportunities.completeProfileDescription')} <Link to="/profile" className="underline" onClick={() => setShowApplyModal(false)}>{t('common.completeProfile')}</Link></p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-tdop-navy mb-2">
                  {t('opportunities.coverLetter')} <span className="text-gray-400 font-normal">({t('common.optional')})</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  placeholder={t('opportunities.coverLetterPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tdop-navy mb-2">
                  {t('opportunities.attachDocuments')} <span className="text-gray-400 font-normal">({t('common.optional')})</span>
                </label>
                {documents.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">{t('opportunities.noDocumentsUploaded')}</p>
                    <Link to="/documents" className="text-sm text-tdop-primary hover:underline mt-1 inline-block">{t('opportunities.uploadDocuments')}</Link>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {documents.map((doc: any) => (
                      <label
                        key={doc.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          selectedDocs.includes(doc.fileUrl) ? 'border-tdop-primary bg-tdop-primary/5' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input type="checkbox" checked={selectedDocs.includes(doc.fileUrl)} onChange={() => toggleDoc(doc.fileUrl)} className="w-4 h-4 rounded border-gray-300 text-tdop-primary focus:ring-tdop-primary" />
                        <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-sm text-tdop-navy truncate flex-1">{doc.name || doc.fileName}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setShowApplyModal(false)}>{t('common.cancel')}</Button>
              <Button onClick={handleApply} loading={isApplying}>{t('opportunities.submitApplication')}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-label="Report opportunity">
          <div className="bg-white rounded-2xl shadow-elevated w-full max-w-md animate-modal-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-tdop-navy">{t('opportunities.reportOpportunity')}</h2>
              <button onClick={() => setShowReportModal(false)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Close">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {reportSubmitted ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-tdop-secondary flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="font-medium text-tdop-navy">{t('opportunities.reportSubmitted')}</p>
                  <p className="text-sm text-gray-500 mt-1">{t('opportunities.reportSubmittedDescription')}</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-tdop-navy mb-2">{t('opportunities.reason')}</label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-tdop-navy focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
                    >
                      <option value="">{t('opportunities.selectReason')}</option>
                      <option value="scam">{t('opportunities.reasonScam')}</option>
                      <option value="misleading">{t('opportunities.reasonMisleading')}</option>
                      <option value="expired">{t('opportunities.reasonExpired')}</option>
                      <option value="duplicate">{t('opportunities.reasonDuplicate')}</option>
                      <option value="inappropriate">{t('opportunities.reasonInappropriate')}</option>
                      <option value="other">{t('common.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tdop-navy mb-2">{t('opportunities.additionalDetails')} <span className="text-gray-400 font-normal">({t('common.optional')})</span></label>
                    <textarea
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      rows={3}
                      placeholder={t('opportunities.additionalDetailsPlaceholder')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary resize-none"
                    />
                  </div>
                </>
              )}
            </div>
            {!reportSubmitted && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                <Button variant="ghost" onClick={() => setShowReportModal(false)}>{t('common.cancel')}</Button>
                <Button variant="danger" onClick={handleReport} disabled={!reportReason}>{t('opportunities.submitReport')}</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
