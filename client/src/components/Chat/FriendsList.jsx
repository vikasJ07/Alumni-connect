import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import useAuth from "../../redux/hooks/useAuth";

const FriendsList = ({ friends, selectedFriend, onFriendClick }) => {
  const { currentUserId } = useAuth();


  
  // State to keep track of the last message and unread count for each friend
  const [friendDetails, setFriendDetails] = useState({});

  useEffect(() => {
    const unsubscribeListeners = friends.map((friend) => {
      const roomId = getRoomId(friend.id);
      const roomRef = doc(db, "chatRooms", roomId);

      return onSnapshot(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const lastMessage = data.lastMessage || null;
          const unreadCount = data.unreadCounts?.[currentUserId] || 0;

          // Update the state for the specific friend
          setFriendDetails((prevDetails) => ({
            ...prevDetails,
            [friend.id]: { lastMessage, unreadCount },
          }));
        }
      });
    });

    return () => {
      // Unsubscribe from all listeners when the component unmounts
      unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [friends, currentUserId]);

  // useEffect(() => {
  //   // Create an array of unsubscribe functions
  //   const unsubscribeListeners = friends.map((friend) => {
  //     const roomId = getRoomId(friend.id);
  //     const roomRef = doc(db, "chatRooms", roomId);
  //     const userRef = doc(db, "users", currentUserId); // Reference to current user
  //     const friendRef = doc(db, "users", friend.id); // Reference to friend's user document

  //     // Listen for changes in the chat room
  //     const unsubscribeRoom = onSnapshot(roomRef, (snapshot) => {
  //       if (snapshot.exists()) {
  //         const data = snapshot.data();
  //         const lastMessage = data.lastMessage || null;
  //         const unreadCount = data.unreadCounts?.[currentUserId] || 0;

  //         // Listen for online status of both users (current user and friend)
  //         const unsubscribeUser = onSnapshot(userRef, (userDoc) => {
  //           const isCurrentUserOnline = userDoc.exists() && userDoc.data().isOnline;

  //           const unsubscribeFriend = onSnapshot(friendRef, (friendDoc) => {
  //             const isFriendOnline = friendDoc.exists() && friendDoc.data().isOnline;

  //             // If both users are online, set unread count to 0
  //             const updatedUnreadCount = (isCurrentUserOnline && isFriendOnline) ? 0 : unreadCount;

  //             // Update the state for the specific friend
  //             setFriendDetails((prevDetails) => {
  //               const updatedDetails = { ...prevDetails };
  //               updatedDetails[friend.id] = { lastMessage, unreadCount: updatedUnreadCount };
  //               return updatedDetails;
  //             });
  //           });

  //           // Clean up friend listener when user data changes
  //           return () => unsubscribeFriend();
  //         });

  //         // Clean up user listener when room data changes
  //         return () => unsubscribeUser();
  //       }
  //     });

  //     // Clean up the room listener
  //     return () => unsubscribeRoom();
  //   });

  //   // Cleanup all listeners when the component unmounts
  //   return () => {
  //     unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
  //   };
  // }, [friends, currentUserId]);

  const getRoomId = (friendId) => {
    return String(currentUserId) < String(friendId)
      ? `${currentUserId}_${friendId}`
      : `${friendId}_${currentUserId}`;
  };

  const displayLastMessage = (lastMessage) => {
    if (lastMessage && lastMessage.text) {
      const messageText =
        lastMessage.text.length > 30
          ? lastMessage.text.substring(0, 30) + "..."
          : lastMessage.text;
      return messageText;
    }
    return "No messages yet";
  };

  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Friends</h2>
      {friends.map((friend) => {
        const details = friendDetails[friend.id] || {};
        return (
          <div
            key={friend.id}
            onClick={() => onFriendClick(friend)}
            className={`flex items-center p-2 mb-2 cursor-pointer ${
              selectedFriend?.id === friend.id ? "bg-gray-200" : ""
            }`}
          >
            <img
              src={friend.profile_photo || "https://via.placeholder.com/50"}
              alt={friend.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex-1">
              <p className="font-bold">{friend.username}</p>
              <p className="text-sm text-gray-600">
                {displayLastMessage(details.lastMessage)}
              </p>
            </div>
            {details.unreadCount > 0 && (
              <div className="ml-auto bg-green-500 text-white rounded-full text-xs px-2 py-1">
                {details.unreadCount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FriendsList;
