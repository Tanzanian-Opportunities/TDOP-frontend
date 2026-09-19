import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { SkipToContent } from '@/components/ui/SkipToContent';
import { useNotificationContext } from '@/context/NotificationContext';
import { Toast } from '@/components/ui/Toast';

const Layout: React.FC = () => {
  const { notifications, removeNotification } = useNotificationContext();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <SkipToContent />
      <Navbar />
      <main id="main-content" className="flex-1" role="main">
        <Outlet />
      </main>
      <Footer />
      {notifications.slice(0, 3).map(notif => (
        <Toast key={notif.id} notification={notif} onDismiss={removeNotification} />
      ))}
    </div>
  );
};

export default Layout;
