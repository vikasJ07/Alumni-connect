import React, { useState, useEffect } from 'react';
import { useGetAlumniSuggestionsQuery, useConnectToFriendMutation } from '../../redux/api/apiSlice';
import useAuth from '../../redux/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ConnectionsSidebar = () => {
  const { currentUserId, user } = useAuth();
  const { data, isLoading } = useGetAlumniSuggestionsQuery(currentUserId);

  const [connectToFriend] = useConnectToFriendMutation();
  const navigate = useNavigate();

  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState({}); // Track loading state for each button
  const [connected, setConnected] = useState({}); // Track connected state for each friend

  useEffect(() => {
    if (data) {
      setPeople(data.data || []);
    }
  }, [data]);

  if (isLoading) {
    return <p>Loading......</p>;
  }

  const handleViewProfile = async (id) => {
    navigate(`/profile?id=${id}`);
  };

  const handleConnect = async (friend_id) => {
    setLoading((prev) => ({ ...prev, [friend_id]: true })); // Set loading state for the specific friend
    try {
      const response = await connectToFriend({ id: currentUserId, friend_id, friend_type: "alumni" }).unwrap();
      console.log(response.message);

      // Mark the friend as connected
      setConnected((prev) => ({ ...prev, [friend_id]: true }));
    } catch (error) {
      console.error(error.message || 'Something went wrong');
    } finally {
      setLoading((prev) => ({ ...prev, [friend_id]: false })); // Reset loading state
    }
  };

  return (
    <div className="w-1/4 p-4 min-h-screen mt-[83px] rounded-[10px] bg-white bg-opacity-20 backdrop-blur-lg border border-white/20 shadow-md">
      <h2 className="text-xl font-bold text-white mb-4">People You May Know</h2>
      <ul className="space-y-4">
        {people.map((person) => (
          <li
            key={person.id}
            className="p-2 rounded-md bg-[#045774] bg-opacity-20 backdrop-blur-lg border border-white/20 flex justify-between items-center"
          >
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleViewProfile(person.id)}
            >
              {/* Profile Photo */}
              <img
                src={person.profile_photo || 'https://via.placeholder.com/50'} // Default placeholder if no photo
                alt={person.username}
                className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white/30"
              />
              <div>
                <h3 className="font-bold text-white">{person.username}</h3>
                <p className="text-gray-300">{person.address}</p>
              </div>
            </div>
            <button
              className={`px-4 py-1 rounded-md transition ${
                connected[person.id]
                  ? 'bg-gray-500 text-white cursor-not-allowed'
                  : 'bg-[#045774] text-white'
              }`}
              onClick={() => handleConnect(person.id)}
              disabled={connected[person.id] || loading[person.id]} // Disable when connected or loading
            >
              {connected[person.id] ? 'Connected' : loading[person.id] ? 'Connecting...' : 'Connect'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectionsSidebar;
