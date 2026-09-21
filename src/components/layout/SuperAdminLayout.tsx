import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationContext } from '@/context/NotificationContext';
import { Toast } from '@/components/ui/Toast';
import {
  Shield, AlertTriangle, Activity, HeartPulse, Users, Building2, Eye, Lock, Brain,
  Database, Settings, ChevronLeft, ChevronRight, Wrench, BarChart3, Bell, Plug, Clock,
  LogOut
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  group: string;
}

const SuperAdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, removeNotification } = useNotificationContext();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const navItems: NavItem[] = [
    { to: '/super-admin', label: 'Overview', icon: <BarChart3 className="w-5 h-5" />, group: 'Control Center' },
    { to: '/super-admin/attention', label: 'Platform Attention', icon: <AlertTriangle className="w-5 h-5" />, group: 'Control Center' },
    { to: '/super-admin/pulse', label: 'Platform Pulse', icon: <Activity className="w-5 h-5" />, group: 'Control Center' },
    { to: '/super-admin/health', label: 'Platform Health', icon: <HeartPulse className="w-5 h-5" />, group: 'Control Center' },
    { to: '/super-admin/roles', label: 'Roles & Permissions', icon: <Lock className="w-5 h-5" />, group: 'Governance' },
    { to: '/super-admin/access', label: 'Access Governance', icon: <Users className="w-5 h-5" />, group: 'Governance' },
    { to: '/super-admin/org-governance', label: 'Org Governance', icon: <Building2 className="w-5 h-5" />, group: 'Governance' },
    { to: '/super-admin/trust-governance', label: 'Trust Governance', icon: <Shield className="w-5 h-5" />, group: 'Governance' },
    { to: '/super-admin/intelligence', label: 'Ecosystem Intelligence', icon: <Brain className="w-5 h-5" />, group: 'Intelligence & Security' },
    { to: '/super-admin/security', label: 'Security Center', icon: <Lock className="w-5 h-5" />, group: 'Intelligence & Security' },
    { to: '/super-admin/audit', label: 'Audit & Compliance', icon: <Eye className="w-5 h-5" />, group: 'Intelligence & Security' },
    { to: '/super-admin/config', label: 'Platform Config', icon: <Wrench className="w-5 h-5" />, group: 'Configuration' },
    { to: '/super-admin/taxonomy', label: 'Taxonomy', icon: <Database className="w-5 h-5" />, group: 'Configuration' },
    { to: '/super-admin/features', label: 'Feature Controls', icon: <Settings className="w-5 h-5" />, group: 'Configuration' },
    { to: '/super-admin/sessions', label: 'Session Control', icon: <Users className="w-5 h-5" />, group: 'Configuration' },
    { to: '/super-admin/notifications', label: 'Notification Config', icon: <Bell className="w-5 h-5" />, group: 'Configuration' },
    { to: '/super-admin/integrations', label: 'Integration Config', icon: <Plug className="w-5 h-5" />, group: 'Configuration' },
    { to: '/super-admin/jobs', label: 'Background Jobs', icon: <Clock className="w-5 h-5" />, group: 'Configuration' },
  ];

  const isActive = (path: string) => {
    if (path === '/super-admin') return location.pathname === '/super-admin';
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
            <Shield className="w-5 h-5 text-tdop-accent" />
            {sidebarOpen && <span className="ml-2 text-sm font-semibold">Super Admin</span>}
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
            <div className="w-8 h-8 bg-tdop-accent rounded-full flex items-center justify-center text-tdop-navy text-sm font-bold">
              {user?.firstName?.[0] || 'SA'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-white/50">Super Administrator</p>
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

export default SuperAdminLayout;
