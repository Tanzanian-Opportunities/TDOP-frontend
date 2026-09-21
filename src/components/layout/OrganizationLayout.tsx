import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationContext } from '@/context/NotificationContext';
import { Toast } from '@/components/ui/Toast';
import {
  LayoutDashboard, Briefcase, FileText, Clock, Bell, FolderOpen, BarChart3,
  Building2, CheckCircle, UsersRound, Settings, Plus, ChevronLeft, ChevronRight,
  LogOut
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  group: string;
}

const OrganizationLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, removeNotification } = useNotificationContext();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const navItems: NavItem[] = [
    { to: '/my-jobs', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, group: 'Operations' },
    { to: '/organization/opportunities', label: 'Opportunities', icon: <Briefcase className="w-5 h-5" />, group: 'Operations' },
    { to: '/create-opportunity', label: 'Create Opportunity', icon: <Plus className="w-5 h-5" />, group: 'Operations' },
    { to: '/organization/applications', label: 'Applications', icon: <FileText className="w-5 h-5" />, group: 'Operations' },
    { to: '/organization/deadlines', label: 'Deadlines', icon: <Clock className="w-5 h-5" />, group: 'Operations' },
    { to: '/organization/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, group: 'Operations' },
    { to: '/organization/documents', label: 'Documents', icon: <FolderOpen className="w-5 h-5" />, group: 'Operations' },
    { to: '/organization/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, group: 'Insights' },
    { to: '/organization/profile', label: 'Org Profile', icon: <Building2 className="w-5 h-5" />, group: 'Settings' },
    { to: '/organization/verification', label: 'Verification', icon: <CheckCircle className="w-5 h-5" />, group: 'Settings' },
    { to: '/organization/team', label: 'Team', icon: <UsersRound className="w-5 h-5" />, group: 'Settings' },
    { to: '/organization/settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, group: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/my-jobs') return location.pathname === '/my-jobs';
    return location.pathname.startsWith(path);
  };

  const groupedItems = navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col transition-all duration-300 shrink-0`}>
        <div className="p-3 border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-tdop-primary/20 hover:bg-tdop-primary/30 transition-colors"
          >
            <Building2 className="w-5 h-5 text-tdop-accent" />
            {sidebarOpen && <span className="ml-2 text-sm font-semibold">Organization</span>}
            {sidebarOpen ? <ChevronLeft className="w-4 h-4 ml-auto" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group}>
              {sidebarOpen && (
                <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-white/40">{group}</p>
              )}
              {items.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.to)
                      ? 'bg-white/15 text-white shadow-lg shadow-black/10'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  } ${!sidebarOpen ? 'justify-center' : ''}`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className={`p-3 border-t border-white/10 ${sidebarOpen ? '' : 'hidden'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-tdop-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.firstName?.[0] || 'O'}
              {user?.lastName?.[0] || ''}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-white/50 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
        <Outlet />
      </main>
      {notifications.slice(0, 3).map(notif => (
        <Toast key={notif.id} notification={notif} onDismiss={removeNotification} />
      ))}
    </div>
  );
};

export default OrganizationLayout;
