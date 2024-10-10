import { allmsg, sendmsg } from "@/api/message.api";
import { UserType } from "@/data/interface.data";
import { addMessage, setMessages } from "@/redux/slices/chatSlice";
import { RootState } from "@/redux/store";
import { Send, UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface RightChatProps {
  selectedUser: UserType | null;
}

const RightChat: React.FC<RightChatProps> = ({ selectedUser }) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const socket = useSelector((state: RootState) => state.socket.socket);
  const user = useSelector((state: RootState) => state.auth.user);
  const chatMessages = useSelector((state: RootState) => 
    state.chat.messages[selectedUser?._id || '']
  );
  const onlineUsers = useSelector((state: RootState) => state.chat.onlineUsers);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        const allmsgResponse = await allmsg(selectedUser._id);
        if (allmsgResponse.success) {
          dispatch(setMessages({ userId: selectedUser._id, messages: allmsgResponse.messages }));
        }
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedUser && socket && user) {
      // Emit the message through socket
      socket.emit('sendMessage', {
        senderId: user._id,
        receiverId: selectedUser._id,
        message: message
      });

      // Send message through API as well
      const sendmsgResponse = await sendmsg(selectedUser._id, message);
      if (sendmsgResponse.success) {
        dispatch(addMessage({
          userId: selectedUser._id,
          message: sendmsgResponse.newMessage
        }));
        setMessage('');
      }
    }
  };

  return (
    <div className="w-2/3 flex flex-col">
      {selectedUser ? (
        <>
          <div className="bg-white p-4 border-b border-gray-200 flex items-center">
            {selectedUser.profilePicture ? (
              <img
                src={selectedUser.profilePicture}
                alt={selectedUser.username}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <UserIcon className="text-gray-500" size={20} />
              </div>
            )}
            <div>
              <Link to={`/profile/${selectedUser._id}`} className="hover:underline">
                <p className="font-medium">{selectedUser.username}</p>
              </Link>
              <p className="text-sm text-gray-500">
                {onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}
              </p>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {chatMessages?.map((msg) => (
              <div
                key={msg._id}
                className={`p-2 rounded-lg max-w-xs ${
                  msg.senderId === selectedUser._id ? 'bg-gray-100' : 'bg-blue-100 ml-auto'
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>

          <div className="bg-white p-4 border-t border-gray-200">
            <div className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
          <UserIcon className="text-gray-300" size={64} />
          <p className="mt-4 text-xl text-gray-500">Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default RightChat;