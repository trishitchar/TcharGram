import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/feed/leftFeed/Sidebar';
import MobileNavbar from '@/components/common/MobileNavbar';
import MobileBottomNav from './components/common/MobileBottomNav';

const ProtectedLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - hidden on mobile */}
      {/* <div className="hidden md:flex"> */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Top Navigation - visible only on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <MobileNavbar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0 pt-14 md:pt-0">
        <Outlet />
      </div>
      
      {/* Mobile Bottom Navigation - visible only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default ProtectedLayout;