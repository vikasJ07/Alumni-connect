import React, { useEffect, useState } from 'react';
import useAuth from '../../redux/hooks/useAuth';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const { role, currentUserId } = useAuth();
  // Fetch Notifications Based on Role
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/notification?role=${role}`);
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch on Component Mount
  useEffect(() => {
    fetchNotifications();
  }, [role]);

  return (
    <div className='h-[623px] mt-[72px] flex flex-col items-center text-xl bg-gradient-to-r bg-[#045774] p-4'>
      <h1 className='text-2xl font-bold text-cyan-100 mb-4'>Notifications</h1>
      {notifications.length > 0 ? (
        <div className='w-full max-w-3xl space-y-4'>
          {notifications.map((notification, index) => (
            <div
              key={index}
              className='bg-white rounded-lg shadow-md p-4 text-gray-800'
            >
              <h3 className='font-semibold'>From Admin</h3>
              <p>{notification.message}</p>
              <span className='text-sm text-gray-500'>{new Date(notification.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <h2 className='text-cyan-100'>No Notifications Right Now</h2>
      )}
    </div>
  );
};

export default Notification;
