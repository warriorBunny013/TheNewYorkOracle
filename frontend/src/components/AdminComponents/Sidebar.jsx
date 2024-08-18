import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex-shrink-0 hidden md:block">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav className="mt-4">
        <Link to="/" className="block py-2 px-4 hover:bg-gray-700">Dashboard</Link>
        <Link to="/settings" className="block py-2 px-4 hover:bg-gray-700">Settings</Link>
        <Link to="/profile" className="block py-2 px-4 hover:bg-gray-700">Profile</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
