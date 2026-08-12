import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 flex font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 p-6 lg:p-8 max-w-[1280px] w-full mx-auto animate-slide-up-fade">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
