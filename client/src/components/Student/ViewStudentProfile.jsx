import React,{ useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetStudentProfileQuery, useGetAddStudentInfoQuery } from '../../redux/api/apiSlice';
import useAuth from '../../redux/hooks/useAuth';

const ViewStudentProfile = () => {
  const { currentUserId } = useAuth();
  const { data: user, isLoading } = useGetStudentProfileQuery(currentUserId);
  const { data: addInfo, isLoading: addInfoLoader } = useGetAddStudentInfoQuery(currentUserId);

    useEffect(() => {
      console.log(user)
    }, [user])
    

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 mt-[63px]">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <div className="flex items-center space-x-6">
          <img
            src={user.data.profile_photo || "https://via.placeholder.com/150"}
            alt="Profile"
            className="rounded-full w-36 h-36 border-4 border-gray-300 object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{user.data.username}</h2>
            <p className="text-gray-500">{user.data.department || "Department not specified"}</p>
            <p className="text-gray-500">Admission Year: {user.data.admission_year}</p>
            <p className="text-gray-500">Email: {user.data.email}</p>
          </div>
        </div>

        <div className="mt-6">
          
          <div className="mt-4">
            {addInfo ? (
              <>
                <p><strong>About me:</strong> {addInfo.data.about || "Not provided"}</p>
                <p><strong>Hobbies:</strong> {addInfo.data.hobbies || "Not specified"}</p>
                <p><strong>Skills:</strong> {addInfo.data.skills || "No skills mentioned"}</p>
                <p><strong>Interested Fields:</strong> {addInfo.data.interested_fields || "None"}</p>
              </>
            ) : (
              <p className="text-gray-500">No additional information available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentProfile;
