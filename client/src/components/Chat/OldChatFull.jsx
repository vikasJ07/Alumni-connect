import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Adjust the path to your firebase.js file
import  useAuth  from '../../redux/hooks/useAuth'
import { useFetchFriendsQuery} from "../../redux/api/apiSlice";


import {
getFirestore,
collection,
doc,
query,
orderBy,
onSnapshot,
getDoc,
setDoc,
addDoc,
serverTimestamp,
} from "firebase/firestore";

// const db = getFirestore(firestore);

const AlumniDashboard = () => {
//   const [friends, setFriends] = useState([]);
const [selectedFriend, setSelectedFriend] = useState(null);
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");
const [chatRoomId, setChatRoomId] = useState("");
const { user, currentUserId} = useAuth()
const { data: friends = [], isLoading: isLoadingFriends } = useFetchFriendsQuery(user);





//   console.log(currentUserId)
// Fetch friends list (dummy data for now; replace with API)
//   useEffect(() => {
//     const fetchFriends = async () => {
//       const response = await fetch(`http://localhost:3000/api/friend/display?username=${user}`)
//       const data = await response.json();
//     //   console.log(typeof(data.friends[0].id))
//       setFriends(data.friends);
//     };
//     fetchFriends();
//   }, []);

// Fetch chat room messages when a friend is selected
useEffect(() => {
    if (!chatRoomId) return;

    const messagesRef = collection(db, "chatRooms", chatRoomId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    setMessages(fetchedMessages);
    });

    return () => unsubscribe();
}, [chatRoomId]);

if (isLoadingFriends) {
    return <p>Loading friends...</p>;
}
    // console.log(friends)

const handleFriendClick = async (friend) => {
    setSelectedFriend(friend);
    
    const roomId =
    String(currentUserId) < String(friend.id)
        ? `${currentUserId}_${friend.id}`
        : `${friend.id}_${currentUserId}`;
        console.log(roomId)
    setChatRoomId(roomId);

    try {
    const roomRef = doc(db, "chatRooms", roomId);
    const roomDoc = await getDoc(roomRef);
    if (!roomDoc.exists()) {
        await setDoc(roomRef, { users: [currentUserId, friend.id] });
    }
    } catch (error) {
    console.error("Error creating chat room:", error);
    }
};

const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatRoomId) return;

    const messagesRef = collection(db, "chatRooms", chatRoomId, "messages");
    try {
    await addDoc(messagesRef, {
        text: newMessage,
        senderId: currentUserId,
        timestamp: serverTimestamp(),
    });
    setNewMessage(""); // Reset message input after sending
    } catch (error) {
    console.error("Error sending message:", error);
    }
};

return (
    <div className="flex h-screen">
    {/* Left Sidebar for Friends List */}
    <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Friends</h2>
        <ul>
        {friends.friends.map((friend) => (
            <li
            key={friend.id}
            onClick={() => handleFriendClick(friend)}
            className={`p-2 cursor-pointer rounded-md mb-2 ${
                selectedFriend?.id === friend.id
                ? "bg-blue-500 text-white"
                : "bg-white"
            }`}
            >
            {friend.name}
            </li>
        ))}
        </ul>
    </div>

    {/* Chat Section */}
    <div className="flex-1 flex flex-col">
        {selectedFriend ? (
        <>
            {/* Chat Header */}
            <div className="bg-blue-500 text-white p-4">
            <h3 className="text-lg font-bold">{selectedFriend.name}</h3>
            </div>

            {/* Chat Messages */}
<div className="flex-1 p-4 overflow-y-scroll">
{messages.map((message) => (
    <div
    key={message.id}
    className={`flex mb-2 ${
        message.senderId === currentUserId ? "justify-end" : "justify-start"
    }`}
    >
    <div
        className={`max-w-xs p-3 rounded-lg shadow-md ${
        message.senderId === currentUserId
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-900"
        }`}
        style={{
        wordWrap: "break-word",
        borderRadius: "12px 12px 0 12px",
        }}
    >
        {message.text}
    </div>
    </div>
))}
</div>


            {/* Chat Input */}
            <div className="p-4 bg-gray-100 flex">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 p-2 rounded-md"
            />
            <button
                onClick={handleSendMessage}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Send
            </button>
            </div>
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
