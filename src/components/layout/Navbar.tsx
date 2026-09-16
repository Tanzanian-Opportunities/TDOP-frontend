import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useThemeContext } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import MobileMenu from './MobileMenu';
import Logo from './Logo';
import { Sun, Moon, Bell, Menu, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
 const { isAuthenticated, user, logout } = useAuth();
 const { unreadCount } = useNotifications();
 const { isDark, toggleTheme } = useThemeContext();
 const { t, i18n } = useTranslation();
 const location = useLocation();
 const [showUserMenu, setShowUserMenu] = React.useState(false);

 const currentLang = i18n.language.startsWith('sw') ? 'sw' : 'en';

 const setLanguage = (lng: string) => {
 i18n.changeLanguage(lng);
 localStorage.setItem('tdop-language', lng);
 };

const navLinks = [
  { to: '/', label: t('nav.home') },
  { to: '/browse', label: t('nav.opportunities') },
  { to: '/organizations', label: t('nav.organizations') },
  { to: '/#about', label: t('nav.about') },
  { to: '/#help', label: t('nav.help') },
  ...(isAuthenticated ? [{ to: '/dashboard', label: t('nav.dashboard') }] : []),
  ];

  const currentPath = location.pathname + location.hash;

 return (
 <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-800" role="navigation" aria-label="Main navigation">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between h-16 gap-4">
 <Link to="/" className="flex items-center shrink-0" aria-label="TDOP home">
 <Logo size="md" dark={isDark} />
 </Link>

 <div className="hidden lg:flex items-center gap-1">
 {navLinks.map(link => {
 const active = link.to === currentPath || (link.to !== '/' && link.to !== '/#about' && link.to !== '/#help' && location.pathname.startsWith(link.to));
 return (
 <Link
 key={link.to + link.label}
 to={link.to}
 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
active
  ? 'text-tdop-primary bg-tdop-primary/10'
  : 'text-gray-600 hover:text-tdop-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
  }`}
 >
 {link.label}
 </Link>
 );
 })}
 </div>

 <div className="flex items-center gap-2 sm:gap-3">
<div className="hidden sm:flex items-center gap-1 rounded-full border border-gray-200 p-0.5 dark:border-gray-700" aria-label="Language toggle">
  <button
  onClick={() => setLanguage('en')}
  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
  currentLang === 'en' ? 'bg-tdop-primary text-white' : 'text-gray-500 hover:text-tdop-primary dark:text-gray-400'
  }`}
 >
 EN
 </button>
 <button
 onClick={() => setLanguage('sw')}
 className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
currentLang === 'sw' ? 'bg-tdop-primary text-white' : 'text-gray-500 hover:text-tdop-primary dark:text-gray-400'
  }`}
 >
 SW
 </button>
 </div>

<button
  onClick={toggleTheme}
  className="p-2 rounded-lg hover:bg-gray-100 transition-all hover:-translate-y-0.5 cursor-pointer hidden sm:block dark:hover:bg-gray-800"
  aria-label="Toggle theme"
  >
  {isDark ? <Sun className="w-5 h-5 text-tdop-accent" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
  </button>

{isAuthenticated && (
 <div className="relative">
<Link
  to="/notifications"
  className="p-2 rounded-lg hover:bg-gray-100 relative transition-all hover:-translate-y-0.5 cursor-pointer active:translate-y-0 block dark:hover:bg-gray-800"
  aria-label="Notifications"
  >
  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
 {unreadCount > 0 && (
 <span className="absolute -top-1 -right-1 w-4 h-4 bg-tdop-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
 {unreadCount}
 </span>
 )}
 </Link>
 </div>
)}

 {isAuthenticated ? (
 <div className="relative">
<button
  onClick={() => setShowUserMenu(!showUserMenu)}
  className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100 transition-all hover:-translate-y-0.5 cursor-pointer dark:hover:bg-gray-800"
  >
 <div className="w-8 h-8 bg-tdop-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
 {user?.firstName?.[0] || 'U'}
 {user?.lastName?.[0] || ''}
 </div>
 <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
 </button>
 {showUserMenu && (
<div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-slide-down dark:bg-gray-800 dark:border-gray-700">
  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
  <p className="text-sm font-medium text-tdop-navy dark:text-gray-100">{user?.firstName} {user?.lastName}</p>
  <p className="text-xs text-gray-500 capitalize dark:text-gray-400">{user?.role}</p>
  </div>
  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
  {t('profile.title')}
  </Link>
  {user?.role !== 'seeker' && (
  <Link to="/my-jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
  {t('nav.myJobs')}
  </Link>
  )}
  <button onClick={() => logout()} className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left dark:hover:bg-red-950/40">
  {t('nav.logout')}
  </button>
 </div>
 )}
 </div>
 ) : (
 <div className="flex items-center gap-2">
 <Link
 to="/login"
 className="hidden sm:block px-4 py-2 text-sm font-medium text-tdop-primary border border-tdop-primary/30 rounded-lg hover:bg-tdop-primary hover:text-white transition-colors"
 >
 {t('auth.login')}
 </Link>
 <Link
 to="/register"
 className="px-4 py-2 text-sm font-semibold text-white bg-tdop-primary hover:bg-blue-700 rounded-lg shadow-soft transition-colors"
 >
 {t('nav.getStarted')}
 </Link>
 </div>
 )}

 <button
 className="lg:hidden p-2 transition-all hover:-translate-y-0.5 cursor-pointer active:translate-y-0 transition-transform hover:-translate-y-0.5 cursor-pointer"
 onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-menu'))}
 aria-label="Open menu"
 >
 <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
 </button>
 </div>
 </div>
 </div>
 <MobileMenu />
 </nav>
 );
};

export default Navbar;
