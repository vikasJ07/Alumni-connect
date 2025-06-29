import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../redux/api/apiSlice";

const ChatHeader = ({ friend }) => {
  const navigate = useNavigate();
  // console.log(friend);
  const {data, isLoading} = useGetProfileQuery(friend.username);

  if(isLoading){
    return <p>Loading.....</p>
  }
  console.log(data)
  const handleViewProfile = () => {
    navigate('/profile', { state: { alumni: data.data } });
  };

  return (
    <div className="p-4 bg-gray-200 flex items-center">
      <img
        src={friend.profile_photo || "https://via.placeholder.com/50"}
        alt={"img"}
        className="w-12 h-12 rounded-full mr-4"
      />
      <div className="flex flex-col">
        <p className="font-bold">{friend.username}</p>
        <button
          onClick={handleViewProfile}
          className="text-blue-500 text-sm mt-1 hover:underline"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
