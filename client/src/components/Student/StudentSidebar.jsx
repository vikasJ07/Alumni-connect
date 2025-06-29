import React, { useState } from 'react';
import { useGetStudentProfileQuery } from '../../redux/api/apiSlice';  
import useAuth from '../../redux/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { TiMessages } from "react-icons/ti";
import { IoIosNotifications } from "react-icons/io";  

const StudentSidebar = () => {
  const { user, currentUserId } = useAuth();
  const { data: alumni, isLoading, isError } = useGetStudentProfileQuery(currentUserId);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading Profile...</p>;
  }

  if (isError || !alumni) {
    return <p>Failed to load profile.</p>;
  }

  const handleMyNetwork = () => {
    navigate('/chat');
  };

  const handleViewProfile = () => {
    navigate('/view-student-profile'); 
  };

  const handleUpdateProfile = () => {
    navigate('/update-student-profile', { state: { alumni: alumni.data } });
  };

  const handleNotifications = () => {
    navigate('/notification')
  }

  return (
    <div className="w-1/4 p-4 mt-[83px] rounded-[10px] bg-white  bg-opacity-20 backdrop-blur-lg border border-white/20 shadow-md">
      {/* Profile Section */}
      <div 
        className="text-center mb-6 relative p-4 rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={alumni.data.profile_photo || "/profile.png"} 
          alt="Profile"
          className="rounded-full mx-auto w-36 h-36 object-cover border-2 border-white/30"
        />
        {isHovered && (
          <button 
            className="absolute inset-0  bg-opacity-20 flex items-center justify-center rounded-full"
            onClick={handleViewProfile}
          >
          </button>
        )}
        <h2 className="text-lg font-bold text-black">{alumni.data.username || "John Doe"}</h2>
        <p className="text-black">{alumni.data.profession || ""}</p>
      </div>

      {/* Sidebar Menu */}
      <ul className="space-y-4">
        <li
          className="flex items-center gap-2 p-2 bg-[#045774] bg-opacity-20 backdrop-blur-lg border border-white/20 rounded-md cursor-pointer hover:bg-opacity-30 transition text-white"
          onClick={handleUpdateProfile}
        >
          <CgProfile className="text-xl text-white" /> Update Profile
        </li>
        <li
          className="flex items-center gap-2 p-2 bg-[#045774] bg-opacity-20 backdrop-blur-lg border border-white/20 rounded-md cursor-pointer hover:bg-opacity-30 transition text-white"
          onClick={handleMyNetwork} 
        >
          <TiMessages className="text-xl text-white" /> Messages
        </li>
        <li
          className="flex items-center gap-2 p-2 bg-[#045774] bg-opacity-20 backdrop-blur-lg border border-white/20 rounded-md cursor-pointer hover:bg-opacity-30 transition text-white"
          onClick={handleNotifications}
        >
          <IoIosNotifications className="text-xl text-white" /> Notifications
        </li>
      </ul>
    </div>
  );
};

export default StudentSidebar;
