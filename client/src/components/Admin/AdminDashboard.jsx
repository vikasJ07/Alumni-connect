import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import BroadcastMessage from './BroadcastMessage';
import GetDetails from './GetDetails';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('');

  // Back to Main Dashboard
  const goBack = () => {
    setActivePage('');
  };

  return (
    <div className="min-h-screen bg-[#045774] text-white">
      <AdminNavbar />
      <div className="mt-[72px] flex justify-center items-center p-4">
        {!activePage && (
          <div className="flex space-x-8">
            {/* Broadcast Message Card */}
            <div
              className="w-64 h-64 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl transition-shadow duration-300"
              onClick={() => setActivePage('BroadcastMessage')}
            >
              <div className="text-[#045774] text-4xl mb-4">📢</div>
              <h2 className="text-xl font-bold text-[#045774]">Broadcast Message</h2>
              <p className="text-sm text-gray-600 mt-2 text-center">Send a message to all users</p>
            </div>

            {/* Get Details Card */}
            <div
              className="w-64 h-64 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl transition-shadow duration-300"
              onClick={() => setActivePage('GetDetails')}
            >
              <div className="text-[#045774] text-4xl mb-4">📊</div>
              <h2 className="text-xl font-bold text-[#045774]">Get Details</h2>
              <p className="text-sm text-gray-600 mt-2 text-center">View user details and analytics</p>
            </div>
          </div>
        )}

        {/* Broadcast Message Page */}
        {activePage === 'BroadcastMessage' && (
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
            <button
              className="bg-[#045774] text-white px-4 py-2 rounded-lg hover:bg-[#C0C596] hover:text-[#045774] transition-colors duration-300 mb-4"
              onClick={goBack}
            >
              Back to Dashboard
            </button>
            <BroadcastMessage />
          </div>
        )}

        {/* Get Details Page */}
        {activePage === 'GetDetails' && (
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
            <button
              className="bg-[#045774] text-white px-4 py-2 rounded-lg hover:bg-[#C0C596] hover:text-[#045774] transition-colors duration-300 mb-4"
              onClick={goBack}
            >
              Back to Dashboard
            </button>
            <GetDetails />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;