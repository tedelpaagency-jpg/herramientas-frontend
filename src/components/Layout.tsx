'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import RightSidebar from './RightSidebar';
import PageTransition from './PageTransition';

import ImpersonationBanner from './ImpersonationBanner';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isKanbanPage = pathname === '/crm' || pathname === '/tasks' || pathname?.startsWith('/tasks');

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isKanbanPage);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  useEffect(() => {
    if (isKanbanPage) {
      setIsSidebarCollapsed(true);
    }
  }, [isKanbanPage]);


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
    <div className="flex h-screen overflow-hidden print:h-auto print:overflow-visible bg-background text-on-background font-body-md">
      {/* Left Navigation Sidebar */}
      <Sidebar
        leftSidebarOpen={leftSidebarOpen}
        setLeftSidebarOpen={setLeftSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Main Content Container */}
      <main className={`flex-1 overflow-y-auto relative h-screen transition-all duration-300 print:ml-0 print:p-0 print:bg-white print:overflow-visible print:h-auto ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} ${rightSidebarOpen ? '2xl:mr-80' : 'mr-0'}`}>
        <ImpersonationBanner />
        {/* Header Bar */}
        <Navbar
          leftSidebarOpen={leftSidebarOpen}
          setLeftSidebarOpen={setLeftSidebarOpen}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          rightSidebarOpen={rightSidebarOpen}
          setRightSidebarOpen={setRightSidebarOpen}
        />

        {/* Dynamic Page Views */}
        <div className={isKanbanPage ? 'p-4 lg:p-6 pb-6 animate-fade-in w-full max-w-none' : 'p-6 lg:p-8 pb-32 animate-fade-in max-w-[1400px] mx-auto w-full'}>
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
