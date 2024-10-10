import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/feed/leftFeed/Sidebar';

const ProtectedLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;