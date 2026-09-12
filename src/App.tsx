import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuthContext } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleGate from '@/components/auth/RoleGate';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
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

const queryClient = new QueryClient();

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />

      <Route path="/browse" element={<BrowseOpportunitiesPage />} />
      <Route path="/organizations" element={<BrowseOrganizationsPage />} />
      <Route path="/compare" element={<ComparePage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<SeekerDashboardPage />} />
        <Route path="/recommendations" element={<SeekerRecommendationsPage />} />
        <Route path="/documents" element={<SeekerDocumentsPage />} />
        <Route path="/applications" element={<SeekerMyApplicationsPage />} />
        <Route path="/saved" element={<SavedOpportunitiesPage />} />
        <Route path="/profile" element={<SeekerProfilePage />} />

        <Route element={<RoleGate allowedRoles={['organization', 'admin']} />}>
          <Route path="/my-jobs" element={<OrganizationDashboardPage />} />
          <Route path="/create-opportunity" element={<CreateOpportunityPage />} />
          <Route path="/edit-opportunity/:id" element={<EditOpportunityPage />} />
          <Route path="/organization/applications" element={<OrgMyApplicationsPage />} />
          <Route path="/organization/profile" element={<OrganizationProfilePage />} />
          <Route path="/organization/verification" element={<VerificationPage />} />
        </Route>

        <Route element={<RoleGate allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/opportunities" element={<OpportunityModerationPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/audit-log" element={<AuditLogPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Layout>
                <AppRoutes />
              </Layout>
            </BrowserRouter>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
