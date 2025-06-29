import React from "react";

const ChatInput = ({ newMessage, onMessageChange, onSendMessage }) => {
  return (
    <div className="p-4 bg-gray-100 flex">
      <input
        type="text"
        value={newMessage}
        onChange={onMessageChange}  
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 p-2 rounded-md"
      />
      <button onClick={onSendMessage} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md">
        Send
      </button>
    </div>
  );
};

export default ChatInput;
