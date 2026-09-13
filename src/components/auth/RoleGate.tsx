import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RoleGateProps {
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

const RoleGate: React.FC<RoleGateProps> = ({ allowedRoles, fallback }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tdop-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <>{fallback || <Navigate to="/" replace />}</>;
  }

  const userRole = user.role?.toLowerCase();
  const hasAccess = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (!hasAccess) {
    return <>{fallback || <Navigate to="/" replace />}</>;
  }

  return <Outlet />;
};

export default RoleGate;
