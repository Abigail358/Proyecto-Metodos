import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, currentPage, setCurrentPage }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 lg:ml-72 transition-all duration-300">
        <div className="p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;