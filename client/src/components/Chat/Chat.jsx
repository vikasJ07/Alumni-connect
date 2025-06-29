import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import useAuth from "../../redux/hooks/useAuth";
import { useFetchFriendsQuery } from "../../redux/api/apiSlice";
import FriendsList from "./FriendsList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useDispatch, useSelector } from 'react-redux';
import { updateUnreadCount, updateLastMessage } from '../../redux/slices/chatSlice';


import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  setDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";

const AlumniDashboard = () => {
  const dispatch = useDispatch();

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatRoomId, setChatRoomId] = useState("");
  const [unreadCount, setUnreadCount] = useState(0); // Default to 0
  const { user, currentUserId } = useAuth();
  const { data: friendsData = {}, isLoading: isLoadingFriends } = useFetchFriendsQuery(currentUserId);
  const friends = friendsData.friends || [];

  useEffect(() => {
    if (!chatRoomId) return;

    const messagesRef = collection(db, "chatRooms", chatRoomId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);

      // Mark messages as read for the current user when messages are fetched
      markMessagesAsRead(chatRoomId, currentUserId);
    });

    // Listen to unreadCounts in real-time
    const roomRef = doc(db, "chatRooms", chatRoomId);
    const unsubscribeUnreadCount = onSnapshot(roomRef, (snapshot) => {
      const roomData = snapshot.data();
      // console.log(roomData.lastMessage)
      if (roomData && roomData.unreadCounts) {
        const count = roomData.unreadCounts[selectedFriend.id] || 0;
        setUnreadCount(count); // Update unread count in real-time
        dispatch(
          updateUnreadCount({
            roomId: chatRoomId,
            count: roomData.unreadCounts?.[currentUserId] || 0,
          })
        );

        dispatch(
          updateLastMessage({
            roomId: chatRoomId,
            lastMessage: {
              ...roomData.lastMessage,
              timestamp: roomData.lastMessage?.timestamp?.toDate()?.toISOString() || null, // Ensure serialization
            },
          })
        );
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeUnreadCount();
    };
  }, [chatRoomId, selectedFriend]);

  const handleFriendClick = async (friend) => {
    setSelectedFriend(friend);
    
    const roomId =
      String(currentUserId) < String(friend.id)
        ? `${currentUserId}_${friend.id}`
        : `${friend.id}_${currentUserId}`;
    setChatRoomId(roomId);
  
    try {
      const roomRef = doc(db, "chatRooms", roomId);
      const roomDoc = await getDoc(roomRef);
      if (!roomDoc.exists()) {
        await setDoc(roomRef, { users: [currentUserId, friend.id], lastMessage: "", unreadCounts: {} });
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  };


  // const handleSendMessage = async () => {
  //   if (!newMessage.trim() || !chatRoomId) return;

  //   const messagesRef = collection(db, "chatRooms", chatRoomId, "messages");
  //   const roomRef = doc(db, "chatRooms", chatRoomId);

  //   try {
  //     // Add the new message to the messages collection
  //     await addDoc(messagesRef, {
  //       text: newMessage,
  //       senderId: currentUserId,
  //       timestamp: serverTimestamp(),
  //     });

  //     // Update the lastMessage and unread count for the friend
  //     await updateDoc(roomRef, {
  //       lastMessage: {
  //         text: newMessage,
  //         timestamp: serverTimestamp(),
  //         senderId: currentUserId,
  //       },
  //       [`unreadCounts.${selectedFriend.id}`]: increment(1), // Increment unread count for the friend
  //     });

  //     // Reset unread count for the current user after sending the message
  //     await updateDoc(roomRef, {
  //       [`unreadCounts.${currentUserId}`]: 0, // Reset unread count for the current user
  //     });

  //     setNewMessage(""); // Reset message input after sending
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatRoomId) return;
  
    const messagesRef = collection(db, "chatRooms", chatRoomId, "messages");
    const roomRef = doc(db, "chatRooms", chatRoomId);
    const currentUserRef = doc(db, "users", currentUserId);  // Reference to current user
    const friendRef = doc(db, "users", selectedFriend.id);    // Reference to selected friend
  
    try {
      // Step 1: Add the new message to the messages collection
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: currentUserId,
        timestamp: serverTimestamp(),
      });
  
      // Step 2: Get current user and friend data to check their online status
      const currentUserDoc = await getDoc(currentUserRef);
      const friendDoc = await getDoc(friendRef);
  
      const isCurrentUserOnline = currentUserDoc.exists() && currentUserDoc.data().isOnline;
      const isFriendOnline = friendDoc.exists() && friendDoc.data().isOnline;
  
      // Step 3: Update the lastMessage and unread count for the friend
      let unreadCount = 0;
      if (!(isCurrentUserOnline && isFriendOnline)) {
        unreadCount = increment(1);  // Increment unread count only if one of the users is offline
      }
  
      // Step 4: Update the room document with last message and unread count
      await updateDoc(roomRef, {
        lastMessage: {
          text: newMessage,
          timestamp: serverTimestamp(),
          senderId: currentUserId,
        },
        [`unreadCounts.${selectedFriend.id}`]: unreadCount, // Update unread count for the friend
      });
  
      // Step 5: Reset unread count for the current user after sending the message
      await updateDoc(roomRef, {
        [`unreadCounts.${currentUserId}`]: 0, // Reset unread count for the current user
      });
  
      // Step 6: Clear the message input
      setNewMessage(""); // Reset message input after sending
  
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const markMessagesAsRead = async (roomId, userId) => {
    const roomRef = doc(db, "chatRooms", roomId);
    try {
      await updateDoc(roomRef, {
        [`unreadCounts.${userId}`]: 0, // Reset unread count when messages are read
      });
      // setUnreadCount(0);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  if (isLoadingFriends) {
    return <p>Loading friends...</p>;
  }

  return (
    <div className="flex h-[623px] mt-[70px]">
      <FriendsList friends={friends} selectedFriend={selectedFriend} onFriendClick={handleFriendClick} />
      <div className="flex-1 flex flex-col">
        {selectedFriend ? (
          <>
            <ChatHeader friend={selectedFriend} unreadCount={unreadCount} />
            <ChatMessages messages={messages} currentUserId={currentUserId} />
            <ChatInput newMessage={newMessage} onMessageChange={(e) => setNewMessage(e.target.value)} onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a friend to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDashboard;
