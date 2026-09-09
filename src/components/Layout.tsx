'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import RightSidebar from './RightSidebar';
import PageTransition from './PageTransition';

import ImpersonationBanner from './ImpersonationBanner';
import { useTheme } from '../context/ThemeContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isKanbanPage = pathname === '/crm' || pathname === '/tasks' || pathname?.startsWith('/tasks');

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('santun_sidebar_collapsed');
      if (saved !== null) {
        return saved === 'true';
      }
    }
    return isKanbanPage;
  });
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const handleSetIsSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('santun_sidebar_collapsed', String(collapsed));
      window.dispatchEvent(new Event('sidebar-state-changed'));
    }
  };

  useEffect(() => {
    const handleSidebarChange = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('santun_sidebar_collapsed');
        if (saved !== null) {
          setIsSidebarCollapsed(saved === 'true');
        }
      }
    };
    window.addEventListener('sidebar-state-changed', handleSidebarChange);
    window.addEventListener('branding-updated', handleSidebarChange);
    return () => {
      window.removeEventListener('sidebar-state-changed', handleSidebarChange);
      window.removeEventListener('branding-updated', handleSidebarChange);
    };
  }, []);

  const { theme } = useTheme();

  useEffect(() => {
    // Sync any branding-updated changes
    const handleBrandingUpdate = () => {
      // handled reactively
    };
    window.addEventListener('branding-updated', handleBrandingUpdate);
    return () => {
      window.removeEventListener('branding-updated', handleBrandingUpdate);
    };
  }, []);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1536) {
        setRightSidebarOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLeftSidebarOpen(false);
        setRightSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden print:h-auto print:overflow-visible bg-slate-100 dark:bg-[#121413] text-slate-900 dark:text-slate-100 font-body-md transition-colors duration-200">
      {/* Left Navigation Sidebar */}
      <Sidebar
        leftSidebarOpen={leftSidebarOpen}
        setLeftSidebarOpen={setLeftSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Main Content Container */}
      <main className={`flex-1 min-w-0 overflow-y-auto overflow-x-hidden relative h-screen transition-all duration-300 print:ml-0 print:p-0 print:bg-white print:overflow-visible print:h-auto bg-slate-100 dark:bg-[#121413] text-slate-900 dark:text-slate-100 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} ${rightSidebarOpen ? '2xl:mr-80' : 'mr-0'}`}>
        <ImpersonationBanner />
        {/* Header Bar */}
        <Navbar
          leftSidebarOpen={leftSidebarOpen}
          setLeftSidebarOpen={setLeftSidebarOpen}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={handleSetIsSidebarCollapsed}
          rightSidebarOpen={rightSidebarOpen}
          setRightSidebarOpen={setRightSidebarOpen}
        />

        {/* Dynamic Page Views */}
        <div className={isKanbanPage ? 'p-2 sm:p-4 lg:p-6 pb-6 animate-fade-in w-full max-w-none min-w-0' : 'p-3 sm:p-4 md:p-6 lg:p-8 pb-24 sm:pb-32 animate-fade-in max-w-[1400px] mx-auto w-full min-w-0'}>
          <PageTransition>
            {children}
          </PageTransition>
        </div>

      </main>

      {/* Right Sidebar */}
      <RightSidebar
        rightSidebarOpen={rightSidebarOpen}
        setRightSidebarOpen={setRightSidebarOpen}
      />
    </div>
  );
};

export default Layout;
