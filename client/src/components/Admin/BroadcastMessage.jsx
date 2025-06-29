import React, { useState } from 'react';

const BroadcastMessage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState('');
  const [message, setMessage] = useState('');

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSelection = (audience) => {
    setSelectedAudience(audience);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !selectedAudience) {
      alert('Please enter a message and select an audience.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/notification/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audience: selectedAudience, message }),
      });

      if (response.ok) {
        alert('Notification sent successfully!');
        setMessage('');
        setSelectedAudience('');
      } else {
        alert('Failed to send notification.');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-[#045774] mb-6">Broadcast Message</h2>

      {/* Audience Selection Dropdown */}
      <div className="relative mb-6">
        <button
          className="bg-[#045774] text-white px-4 py-2 rounded-lg hover:bg-[#C0C596] hover:text-[#045774] transition-colors duration-300"
          onClick={toggleDropdown}
        >
          Select Audience
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute mt-2 w-48 bg-white border text-black border-gray-200 rounded-lg shadow-lg z-10">
            <div
              className="p-3 hover:bg-[#045774] hover:text-white cursor-pointer transition-colors duration-300"
              onClick={() => handleSelection('Student')}
            >
              Student
            </div>
            <div
              className="p-3 hover:bg-[#045774] hover:text-white cursor-pointer transition-colors duration-300"
              onClick={() => handleSelection('Alumni')}
            >
              Alumni
            </div>
            <div
              className="p-3 hover:bg-[#045774] hover:text-white cursor-pointer transition-colors duration-300"
              onClick={() => handleSelection('Both')}
            >
              Both
            </div>
          </div>
        )}
      </div>

      {/* Message Form */}
      {selectedAudience && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-md font-medium text-gray-700">
            Send to: <span className="text-[#045774] font-semibold">{selectedAudience}</span>
          </h3>

          {/* Message Textarea */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#045774] focus:border-transparent"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#045774] text-white px-4 py-2 rounded-lg hover:bg-[#C0C596] hover:text-[#045774] transition-colors duration-300"
          >
            Send Notification
          </button>
        </form>
      )}
    </div>
  );
};

export default BroadcastMessage;