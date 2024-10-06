import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Send } from 'lucide-react';

interface RightChatProps {
  selectedUser: any;
  conversations: { [key: string]: string[] };
  onSendMessage: (message: string) => void;
}

const RightChat: React.FC<RightChatProps> = ({ selectedUser, conversations, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="w-2/3 flex flex-col">
      {selectedUser ? (
        <>
          {/* Chat header */}
          <div className="bg-white p-4 border-b border-gray-200 flex items-center">
            {selectedUser.profilePicture ? (
              <img
                src={selectedUser.profilePicture}
                alt={selectedUser.username}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <User className="text-gray-500" size={20} />
              </div>
            )}
            <div>
              <Link to={`/profile/${selectedUser._id}`} className="hover:underline">
                <p className="font-medium">{selectedUser.username}</p>
              </Link>
              <p className="text-sm text-gray-500">Active now</p>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {conversations[selectedUser._id]?.map((msg, index) => (
              <div key={index} className="bg-blue-100 p-2 rounded-lg max-w-xs ml-auto">
                {msg}
              </div>
            ))}
          </div>

          {/* Message input */}
          <div className="bg-white p-4 border-t border-gray-200">
            <div className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full bg-white">
          <User className="text-gray-300" size={64} />
          <p className="mt-4 text-xl text-gray-500">Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default RightChat;