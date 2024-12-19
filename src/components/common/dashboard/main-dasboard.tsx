'use client';
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './sidebar';
import Header from './header';

const MainDashboard = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isSidebarOpen]);

  return (
    <div className='flex'>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed z-20 top-0 left-0 h-0 md:h-screen bg-transparent md:bg-white  shadow-lg transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:w-64`}
      >
        <Sidebar />
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black opacity-50 lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className='flex-1 w-full ml-0 '>
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className='h-screen bg-gray-100 px-5 py-5 relative'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
