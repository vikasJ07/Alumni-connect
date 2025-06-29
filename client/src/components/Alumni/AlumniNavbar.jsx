import React from 'react';
import { AiOutlineMail } from 'react-icons/ai';

const AlumniNavbar = () => {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 rounded-md bg-gray-700 text-white"
        />
        <button className="p-2 bg-gray-700 rounded-md">🔍</button>
        <button className="p-2 bg-gray-700 rounded-md">
          <AiOutlineMail className="text-xl relative" />
          {/* <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span> Notification dot */}
        </button>
        
      </div>
    </nav>
  );
};

export default AlumniNavbar;
