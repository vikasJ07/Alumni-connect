import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineBarChart, AiOutlineUsergroupAdd } from 'react-icons/ai';

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center mt-[75px]">
      <div className="text-lg font-bold">Admin Panel</div>

      <div className="flex items-center space-x-6">
        <Link to="/analytics" className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
          <AiOutlineBarChart size={24} />
          <span className="hidden md:inline">Analytics</span>
        </Link>

        {/* <Link to="/alumni-requests" className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
          <AiOutlineUsergroupAdd size={24} />
          <span className="hidden md:inline">Friend Requests</span>
        </Link> */}
      </div>
    </nav>
  );
};

export default AdminNavbar;
