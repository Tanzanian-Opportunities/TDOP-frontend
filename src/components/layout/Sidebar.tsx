import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Briefcase, Bookmark, FileText, Sparkles, FolderOpen, Building2,
  User, Settings, BarChart3, Users, Shield, Flag, UserCog, ChevronLeft, ChevronRight, ArrowRight
} from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { useNotifications } from '@/hooks/useNotifications';

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { applications } = useApplications();
  const { unreadCount } = useNotifications();
  const [collapsed, setCollapsed] = useState(false);

  const seekerLinks: SidebarLink[] = [
    { to: '/dashboard', label: t('dashboard.title'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/browse', label: t('nav.opportunities'), icon: <Briefcase className="w-5 h-5" /> },
    { to: '/organizations', label: t('nav.organizations'), icon: <Building2 className="w-5 h-5" /> },
    { to: '/saved', label: t('nav.saved'), icon: <Bookmark className="w-5 h-5" /> },
    { to: '/applications', label: t('application.title'), icon: <FileText className="w-5 h-5" />, count: applications.length },
    { to: '/recommendations', label: t('nav.recommendations'), icon: <Sparkles className="w-5 h-5" /> },
    { to: '/documents', label: t('nav.documents'), icon: <FolderOpen className="w-5 h-5" /> },
    { to: '/profile', label: t('profile.title'), icon: <User className="w-5 h-5" /> },
    { to: '/profile', label: t('profile.settings'), icon: <Settings className="w-5 h-5" /> },
  ];

  const orgLinks: SidebarLink[] = [
    { to: '/my-jobs', label: t('nav.myJobs'), icon: <Briefcase className="w-5 h-5" /> },
    { to: '/profile', label: t('organization.profile'), icon: <UserCog className="w-5 h-5" /> },
    { to: '/admin', label: t('admin.overview'), icon: <Shield className="w-5 h-5" /> },
  ];

  const adminLinks: SidebarLink[] = [
    { to: '/admin', label: t('admin.overview'), icon: <LayoutDashboard className="w-5 h-5" />, count: unreadCount },
    { to: '/admin/users', label: t('admin.users'), icon: <Users className="w-5 h-5" /> },
    { to: '/admin/opportunities', label: t('admin.opportunities'), icon: <Briefcase className="w-5 h-5" /> },
    { to: '/admin/analytics', label: t('admin.analytics'), icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/admin/reports', label: t('admin.reports'), icon: <Flag className="w-5 h-5" /> },
  ];

  const links = location.pathname.startsWith('/admin') ? adminLinks
    : location.pathname.includes('organization') ? orgLinks : seekerLinks;

  return (
    <aside
      className={`${collapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hidden lg:flex flex-col min-h-[calc(100vh-4rem)] transition-all duration-300 ${className}`}
    >
      <div className="p-3">
        <button
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="ml-auto flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map(link => {
          const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
          return (
            <Link
              key={link.label}
              to={link.to}
              title={collapsed ? link.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-tdop-primary text-white font-semibold shadow-soft'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-tdop-primary dark:hover:text-tdop-primary'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <span className="shrink-0">{link.icon}</span>
              {!collapsed && <span className="flex-1 truncate">{link.label}</span>}
              {!collapsed && typeof link.count === 'number' && link.count > 0 && (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-tdop-accent text-white text-xs font-bold flex items-center justify-center">
                  {link.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-4 mx-3 mb-4 rounded-xl bg-tdop-primary text-white">
          <p className="font-semibold text-sm">Your future starts here</p>
          <p className="text-xs text-white/70 mt-1 mb-3">Complete your profile to get personalized recommendations.</p>
          <Link to="/profile" className="inline-flex items-center gap-1.5 text-xs font-semibold text-tdop-accent hover:underline">
            Complete profile <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${collapsed ? 'hidden' : ''}`}>
        <p className="text-xs text-gray-500">TDOP</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">Tanzania Digital Opportunity Platform</p>
      </div>
    </aside>
  );
};

export default Sidebar;
