import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SeekerLayout from '@/components/layout/SeekerLayout';
import OrganizationLayout from '@/components/layout/OrganizationLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleGate from '@/components/auth/RoleGate';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageNotFound } from '@/components/ui/PageStates';
import WelcomeOnboarding from '@/components/WelcomeOnboarding';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/Auth/ResetPasswordPage';
import HomePage from '@/pages/HomePage';
import OpportunityDetailPage from '@/pages/OpportunityDetailPage';
import BrowseOpportunitiesPage from '@/pages/Seeker/BrowseOpportunitiesPage';
import BrowseOrganizationsPage from '@/pages/Seeker/BrowseOrganizationsPage';
import SeekerMyApplicationsPage from '@/pages/Seeker/MyApplicationsPage';
import SavedOpportunitiesPage from '@/pages/Seeker/SavedOpportunitiesPage';
import ComparePage from '@/pages/Seeker/ComparePage';
import SeekerProfilePage from '@/pages/Seeker/SeekerProfilePage';
import SeekerDashboardPage from '@/pages/Seeker/SeekerDashboardPage';
import SeekerRecommendationsPage from '@/pages/Seeker/SeekerRecommendationsPage';
import SeekerDocumentsPage from '@/pages/Seeker/SeekerDocumentsPage';
import SeekerNotificationsPage from '@/pages/Seeker/SeekerNotificationsPage';
import ApplicationDetailPage from '@/pages/Seeker/ApplicationDetailPage';
import OrganizationDashboardPage from '@/pages/Organization/OrganizationDashboardPage';
import CreateOpportunityPage from '@/pages/Organization/CreateOpportunityPage';
import EditOpportunityPage from '@/pages/Organization/EditOpportunityPage';
import OrgMyApplicationsPage from '@/pages/Organization/MyApplicationsPage';
import OrganizationProfilePage from '@/pages/Organization/OrganizationProfilePage';
import VerificationPage from '@/pages/Organization/VerificationPage';
import AdminDashboardPage from '@/pages/Admin/AdminDashboardPage';
import UserManagementPage from '@/pages/Admin/UserManagementPage';
import OpportunityModerationPage from '@/pages/Admin/OpportunityModerationPage';
import AnalyticsPage from '@/pages/Admin/AnalyticsPage';
import ReportsPage from '@/pages/Admin/ReportsPage';
import AuditLogPage from '@/pages/Admin/AuditLogPage';
import VerificationOfficerPage from '@/pages/Admin/VerificationOfficerPage';
import ModerationPage from '@/pages/Admin/ModerationPage';
import PlatformConfigPage from '@/pages/Admin/PlatformConfigPage';
import AdminOrganizationsPage from '@/pages/Admin/OrganizationsPage';
import OrganizationTeamPage from '@/pages/Organization/TeamManagementPage';
import OpportunitiesListPage from '@/pages/Organization/OpportunitiesListPage';
import OrgOpportunityDetailPage from '@/pages/Organization/OpportunityDetailPage';
import OpportunityPreviewPage from '@/pages/Organization/OpportunityPreviewPage';
import DeadlinesPage from '@/pages/Organization/DeadlinesPage';
import OrgNotificationsPage from '@/pages/Organization/NotificationsPage';
import OrgDocumentsPage from '@/pages/Organization/DocumentsPage';
import OrgAnalyticsPage from '@/pages/Organization/AnalyticsPage';
import OrgSettingsPage from '@/pages/Organization/SettingsPage';
import TrustLayout from '@/components/layout/TrustLayout';
import TrustAttentionPage from '@/pages/Trust/TrustAttentionPage';
import TrustWorkQueuePage from '@/pages/Trust/TrustWorkQueuePage';
import TrustVerificationReviewPage from '@/pages/Trust/TrustVerificationReviewPage';
import TrustOpportunityReviewPage from '@/pages/Trust/TrustOpportunityReviewPage';
import TrustReportReviewPage from '@/pages/Trust/TrustReportReviewPage';
import TrustActivityPage from '@/pages/Trust/TrustActivityPage';
import TrustOverviewPage from '@/pages/Trust/TrustOverviewPage';
import TrustEscalationPage from '@/pages/Trust/TrustEscalationPage';
import TrustAppealPage from '@/pages/Trust/TrustAppealPage';
import SuperAdminLayout from '@/components/layout/SuperAdminLayout';
import SuperAdminOverviewPage from '@/pages/SuperAdmin/SuperAdminOverviewPage';
import SuperAdminAttentionPage from '@/pages/SuperAdmin/SuperAdminAttentionPage';
import SuperAdminPulsePage from '@/pages/SuperAdmin/SuperAdminPulsePage';
import SuperAdminHealthPage from '@/pages/SuperAdmin/SuperAdminHealthPage';
import SuperAdminRolesPage from '@/pages/SuperAdmin/SuperAdminRolesPage';
import SuperAdminAccessPage from '@/pages/SuperAdmin/SuperAdminAccessPage';
import SuperAdminOrgGovernancePage from '@/pages/SuperAdmin/SuperAdminOrgGovernancePage';
import SuperAdminTrustGovernancePage from '@/pages/SuperAdmin/SuperAdminTrustGovernancePage';
import SuperAdminIntelligencePage from '@/pages/SuperAdmin/SuperAdminIntelligencePage';
import SuperAdminSecurityPage from '@/pages/SuperAdmin/SuperAdminSecurityPage';
import SuperAdminAuditPage from '@/pages/SuperAdmin/SuperAdminAuditPage';
import SuperAdminConfigPage from '@/pages/SuperAdmin/SuperAdminConfigPage';
import SuperAdminTaxonomyPage from '@/pages/SuperAdmin/SuperAdminTaxonomyPage';
import SuperAdminFeatureControlsPage from '@/pages/SuperAdmin/SuperAdminFeatureControlsPage';
import SuperAdminSessionControlPage from '@/pages/SuperAdmin/SuperAdminSessionControlPage';
import SuperAdminNotificationConfigPage from '@/pages/SuperAdmin/SuperAdminNotificationConfigPage';
import SuperAdminIntegrationConfigPage from '@/pages/SuperAdmin/SuperAdminIntegrationConfigPage';
import SuperAdminBackgroundJobsPage from '@/pages/SuperAdmin/SuperAdminBackgroundJobsPage';
import ContactPage from '@/pages/Support/ContactPage';
import HelpCenterPage from '@/pages/Support/HelpCenterPage';
import PrivacyPage from '@/pages/Support/PrivacyPage';
import TermsPage from '@/pages/Support/TermsPage';
import AboutPage from '@/pages/Support/AboutPage';

const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public pages - wrapped by Layout (Navbar + Footer) */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
          <Route path="/browse" element={<BrowseOpportunitiesPage />} />
          <Route path="/organizations" element={<BrowseOrganizationsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Seeker pages - sidebar layout, no Navbar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<SeekerLayout />}>
            <Route path="/dashboard" element={<SeekerDashboardPage />} />
            <Route path="/recommendations" element={<SeekerRecommendationsPage />} />
            <Route path="/documents" element={<SeekerDocumentsPage />} />
            <Route path="/applications" element={<SeekerMyApplicationsPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="/saved" element={<SavedOpportunitiesPage />} />
            <Route path="/notifications" element={<SeekerNotificationsPage />} />
            <Route path="/profile" element={<SeekerProfilePage />} />
          </Route>

          {/* Organization pages - sidebar layout, no Navbar */}
          <Route element={<RoleGate allowedRoles={['organization', 'admin', 'super_admin']} />}>
            <Route element={<OrganizationLayout />}>
              <Route path="/my-jobs" element={<OrganizationDashboardPage />} />
              <Route path="/organization/opportunities" element={<OpportunitiesListPage />} />
              <Route path="/organization/opportunity/:id" element={<OrgOpportunityDetailPage />} />
              <Route path="/organization/preview/:id" element={<OpportunityPreviewPage />} />
              <Route path="/create-opportunity" element={<CreateOpportunityPage />} />
              <Route path="/edit-opportunity/:id" element={<EditOpportunityPage />} />
              <Route path="/organization/applications" element={<OrgMyApplicationsPage />} />
              <Route path="/organization/deadlines" element={<DeadlinesPage />} />
              <Route path="/organization/notifications" element={<OrgNotificationsPage />} />
              <Route path="/organization/documents" element={<OrgDocumentsPage />} />
              <Route path="/organization/analytics" element={<OrgAnalyticsPage />} />
              <Route path="/organization/profile" element={<OrganizationProfilePage />} />
              <Route path="/organization/verification" element={<VerificationPage />} />
              <Route path="/organization/team" element={<OrganizationTeamPage />} />
              <Route path="/organization/settings" element={<OrgSettingsPage />} />
            </Route>
          </Route>

          {/* Admin pages - sidebar layout, no Navbar. Super admin has full access. */}
          <Route element={<RoleGate allowedRoles={['admin', 'verification_officer', 'moderator', 'super_admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/organizations" element={<AdminOrganizationsPage />} />
              <Route path="/admin/opportunities" element={<OpportunityModerationPage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/audit-log" element={<AuditLogPage />} />
              <Route path="/admin/verification" element={<VerificationOfficerPage />} />
              <Route path="/admin/moderation" element={<ModerationPage />} />
              <Route path="/admin/config" element={<PlatformConfigPage />} />
            </Route>

            {/* Trust & Safety pages - sidebar layout, no Navbar */}
            <Route element={<TrustLayout />}>
              <Route path="/trust" element={<TrustAttentionPage />} />
              <Route path="/trust/work-queue" element={<TrustWorkQueuePage />} />
              <Route path="/trust/verifications" element={<TrustVerificationReviewPage />} />
              <Route path="/trust/moderation" element={<TrustOpportunityReviewPage />} />
              <Route path="/trust/reports" element={<TrustReportReviewPage />} />
              <Route path="/trust/activity" element={<TrustActivityPage />} />
              <Route path="/trust/overview" element={<TrustOverviewPage />} />
              <Route path="/trust/escalations" element={<TrustEscalationPage />} />
              <Route path="/trust/appeals" element={<TrustAppealPage />} />
            </Route>
          </Route>

          {/* Super Admin pages - sidebar layout, no Navbar. Full system control. */}
          <Route element={<RoleGate allowedRoles={['super_admin']} />}>
            <Route element={<SuperAdminLayout />}>
              <Route path="/super-admin" element={<SuperAdminOverviewPage />} />
              <Route path="/super-admin/attention" element={<SuperAdminAttentionPage />} />
              <Route path="/super-admin/pulse" element={<SuperAdminPulsePage />} />
              <Route path="/super-admin/health" element={<SuperAdminHealthPage />} />
              <Route path="/super-admin/roles" element={<SuperAdminRolesPage />} />
              <Route path="/super-admin/access" element={<SuperAdminAccessPage />} />
              <Route path="/super-admin/org-governance" element={<SuperAdminOrgGovernancePage />} />
              <Route path="/super-admin/trust-governance" element={<SuperAdminTrustGovernancePage />} />
              <Route path="/super-admin/intelligence" element={<SuperAdminIntelligencePage />} />
              <Route path="/super-admin/security" element={<SuperAdminSecurityPage />} />
              <Route path="/super-admin/audit" element={<SuperAdminAuditPage />} />
              <Route path="/super-admin/config" element={<SuperAdminConfigPage />} />
              <Route path="/super-admin/taxonomy" element={<SuperAdminTaxonomyPage />} />
              <Route path="/super-admin/features" element={<SuperAdminFeatureControlsPage />} />
              <Route path="/super-admin/sessions" element={<SuperAdminSessionControlPage />} />
              <Route path="/super-admin/notifications" element={<SuperAdminNotificationConfigPage />} />
              <Route path="/super-admin/integrations" element={<SuperAdminIntegrationConfigPage />} />
              <Route path="/super-admin/jobs" element={<SuperAdminBackgroundJobsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <WelcomeOnboarding />
    </BrowserRouter>
  );
};

export default App;
