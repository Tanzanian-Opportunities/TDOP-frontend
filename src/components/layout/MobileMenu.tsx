import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useThemeContext } from '@/context/ThemeContext';
import { X, Moon, Sun } from 'lucide-react';

const MobileMenu: React.FC = () => {
 const { t } = useTranslation();
 const { isAuthenticated, user, logout } = useAuth();
 const { isDark, toggleTheme } = useThemeContext();
 const location = useLocation();
 const [isOpen, setIsOpen] = useState(false);
 const closeButtonRef = useRef<HTMLButtonElement>(null);

 const close = useCallback(() => setIsOpen(false), []);

 useEffect(() => {
 const handler = () => setIsOpen(prev => !prev);
 window.addEventListener('toggle-mobile-menu', handler);
 return () => window.removeEventListener('toggle-mobile-menu', handler);
 }, []);

 useEffect(() => {
 if (isOpen) {
   closeButtonRef.current?.focus();
   document.body.style.overflow = 'hidden';
 } else {
   document.body.style.overflow = 'unset';
 }
 return () => { document.body.style.overflow = 'unset'; };
 }, [isOpen]);

 useEffect(() => {
 close();
 }, [location.pathname, close]);

 useEffect(() => {
 if (!isOpen) return;
 const handleKey = (e: KeyboardEvent) => {
   if (e.key === 'Escape') close();
 };
 document.addEventListener('keydown', handleKey);
 return () => document.removeEventListener('keydown', handleKey);
 }, [isOpen, close]);

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
 <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={close} aria-hidden="true" />
 )}
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Navigation menu"
    className={`fixed top-0 right-0 h-full w-72 bg-white/95 backdrop-blur-xl shadow-elevated z-50 transform transition-transform duration-300 lg:hidden dark:bg-gray-900/95 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
  <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
  <span className="font-heading font-bold text-lg text-tdop-primary dark:text-white">Menu</span>
  <button ref={closeButtonRef} onClick={close} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Close menu">
 <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
 </button>
 </div>
 <nav className="p-4 space-y-1" aria-label="Mobile navigation">
 {links.map(link => {
 const isActive = location.pathname === link.to;
 return (
  <Link
  key={link.to}
  to={link.to}
  onClick={close}
  aria-current={isActive ? 'page' : undefined}
  className={`block px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
  isActive
    ? 'bg-tdop-primary/10 text-tdop-primary'
    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
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
 className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 w-full dark:text-gray-300 dark:hover:bg-gray-800"
 >
 {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
 {isDark ? 'Light Mode' : 'Dark Mode'}
 </button>
 <button
 onClick={() => { logout(); close(); }}
 className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 w-full dark:hover:bg-red-950/40"
 >
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
