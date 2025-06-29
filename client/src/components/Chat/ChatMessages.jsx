import React, { useEffect, useRef } from "react";

const ChatMessages = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-scroll">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex mb-2 ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-xs p-3 rounded-lg shadow-md ${
              message.senderId === currentUserId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
