import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNotificationContext } from '@/context/NotificationContext';
import { Toast } from '@/components/ui/Toast';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { notifications } = useNotificationContext();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-tdop-dark">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {notifications.slice(0, 3).map(notif => (
        <Toast key={notif.id} notification={notif} />
      ))}
    </div>
  );
};

export default Layout;
