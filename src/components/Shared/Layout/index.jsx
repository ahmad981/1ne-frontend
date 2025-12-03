import React, { useState } from 'react';
import SideMenu from '../SideMenu';
import { Header } from '../Header';

export const Layout = ({ children }) => {
  const [sideMenuOpen, setSideMenuOpen] = useState(true);
  return (
    <main className='flex w-screen h-screen relative'>
      <SideMenu sideMenuOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />

      <div
        className={
          sideMenuOpen
            ? 'w-full lg:w-[calc(100vw-250px)]'
            : 'w-full pl-[65px] lg:pl-0 lg:w-[calc(100vw-65px)]'
        }
      >
        <Header sideMenuOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
        <div className='h-[calc(100vh-70px)] overflow-auto w-full bg-gray-50 pt-16 lg:pt-16'>
          <div className='px-6 lg:px-8 py-6'>
            <React.Fragment>{children}</React.Fragment>
          </div>
        </div>

        {/* OVERLAY */}
        {sideMenuOpen && (
          <div
            onClick={() => setSideMenuOpen(false)}
            className='w-full h-full bg-black/50 absolute top-0 left-0 lg:hidden z-30' />
        )}
      </div>
    </main>
  );
};

