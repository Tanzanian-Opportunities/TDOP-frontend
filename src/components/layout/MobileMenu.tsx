import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useThemeContext } from '@/context/ThemeContext';
import { X, Menu, Sun, Moon, Bell, LogOut, User, Settings } from 'lucide-react';

const MobileMenu: React.FC = () => {
 const { t } = useTranslation();
 const { isAuthenticated, user, logout } = useAuth();
 const { isDark, toggleTheme } = useThemeContext();
 const location = useLocation();
 const [isOpen, setIsOpen] = useState(false);

 useEffect(() => {
 const handler = () => setIsOpen(prev => !prev);
 window.addEventListener('toggle-mobile-menu', handler);
 return () => window.removeEventListener('toggle-mobile-menu', handler);
 }, []);

 const links = isAuthenticated
 ? [
 { to: '/', label: t('nav.home') },
 { to: '/browse', label: t('nav.browse') },
 { to: '/organizations', label: t('nav.organizations') },
 { to: '/dashboard', label: t('nav.dashboard') },
 { to: '/applications', label: t('nav.applications') },
 ...(user?.role === 'admin' ? [{ to: '/admin', label: t('nav.admin') }] : []),
 { to: '/profile', label: t('nav.profile') },
 ]
 : [
 { to: '/', label: t('nav.home') },
 { to: '/browse', label: t('nav.browse') },
 { to: '/login', label: t('auth.login') },
 { to: '/register', label: t('auth.register') },
 ];

 return (
 <>
 {isOpen && (
 <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
 )}
 <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
 <div className="flex items-center justify-between p-4 border-b border-gray-200">
  <span className="font-heading font-bold text-lg text-tdop-navy">Menu</span>
 <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
 <X className="w-5 h-5 text-gray-600" />
 </button>
 </div>
 <nav className="p-4 space-y-1">
 {links.map(link => {
 const isActive = location.pathname === link.to;
 return (
 <Link
 key={link.to}
 to={link.to}
 onClick={() => setIsOpen(false)}
 className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
 isActive
 ? 'bg-tdop-primary/10 text-tdop-primary'
 : 'text-gray-600 hover:bg-gray-100'
 }`}
 >
 {link.label}
 </Link>
 );
 })}
 {isAuthenticated && (
 <>
 <button
 onClick={() => { toggleTheme(); setIsOpen(false); }}
 className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 w-full"
 >
 {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
 {isDark ? 'Light Mode' : 'Dark Mode'}
 </button>
 <button
 onClick={() => { logout(); setIsOpen(false); }}
 className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full"
 >
 <LogOut className="w-5 h-5" />
 {t('nav.logout')}
 </button>
 </>
 )}
 </nav>
 </div>
 </>
 );
};

export default MobileMenu;
