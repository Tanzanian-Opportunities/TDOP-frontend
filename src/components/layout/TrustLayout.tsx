import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertTriangle, ClipboardList, CheckCircle, Eye, Flag, Clock,
  BarChart3, Shield, ChevronLeft, ChevronRight
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const TrustLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const isMod = user?.role === 'moderator';

  const navItems: NavItem[] = [
    { to: '/trust', label: 'Attention Center', icon: <AlertTriangle className="w-5 h-5" /> },
    { to: '/trust/work-queue', label: 'Work Queue', icon: <ClipboardList className="w-5 h-5" /> },
    { to: '/trust/verifications', label: 'Verifications', icon: <CheckCircle className="w-5 h-5" /> },
    { to: '/trust/moderation', label: 'Moderation', icon: <Eye className="w-5 h-5" /> },
    { to: '/trust/reports', label: 'Reports', icon: <Flag className="w-5 h-5" /> },
    { to: '/trust/activity', label: 'Activity Log', icon: <Clock className="w-5 h-5" /> },
    { to: '/trust/overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/trust/escalations', label: 'Escalations', icon: <AlertTriangle className="w-5 h-5" /> },
    { to: '/trust/appeals', label: 'Appeals', icon: <Shield className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/trust') return location.pathname === '/trust';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-tdop-navy text-white flex flex-col transition-all duration-300 shrink-0`}>
        <div className="p-2 border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Shield className="w-5 h-5" />
            {sidebarOpen && <span className="ml-2 text-sm font-semibold">Trust Ops</span>}
            {sidebarOpen ? <ChevronLeft className="w-4 h-4 ml-auto" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive(item.to) ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.to)
                  ? 'bg-tdop-accent text-tdop-navy font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              } ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className={`p-3 border-t border-white/10 ${sidebarOpen ? '' : 'hidden'}`}>
          <p className="text-xs text-white/50 truncate">
            {isMod ? 'Moderator' : 'Verification Officer'}
          </p>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default TrustLayout;
