import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-bold text-gray-900">GigHub</h1>
          <nav>{/* Navigation items will go here */}</nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
