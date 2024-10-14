import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, UserIcon } from "lucide-react";
import { allmsg, sendmsg } from "@/api/message.api";
import { UserType } from "@/data/interface.data";
import { addMessage, setMessages } from "@/redux/slices/chatSlice";
import { RootState } from "@/redux/store";
import { formatDistanceToNow } from 'date-fns';

interface RightChatProps {
  selectedUser: UserType | null;
  onBack?: () => void;
}

const RightChat: React.FC<RightChatProps> = ({ selectedUser, onBack }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const socket = useSelector((state: RootState) => state.socket.socket);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const chatMessages = useSelector((state: RootState) => 
    state.chat.messages[selectedUser?._id || ''] || []
  );
  const onlineUsers = useSelector((state: RootState) => state.chat.onlineUsers);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        setIsLoading(true);
        try {
          const allmsgResponse = await allmsg(selectedUser._id,page);
          if (allmsgResponse.success) {
            dispatch(setMessages({ userId: selectedUser._id, messages: allmsgResponse.messages }));
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
          // Implement user feedback for error
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMessages();
    setPage(1); // Reset page when selecting a new user
  }, [selectedUser, dispatch]);

  const handleSendMessage = useCallback(() => {
    if (message.trim() && socket && currentUser && selectedUser) {
      const newMessage = {
        senderId: currentUser._id,
        receiverId: selectedUser._id,
        message: message.trim(),
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      // Dispatch to Redux store immediately for instant feedback
      dispatch(addMessage({
        userId: selectedUser._id,
        message: newMessage
      }));

      // Emit the message through socket
      socket.emit('sendMessage', { message: newMessage });

      // Clear the input field
      setMessage('');

      // Send the message to the server
      sendmsg(selectedUser._id, newMessage.message)
        .catch(error => {
          console.error('Error sending message:', error);
          // Implement user feedback for error
          // Optionally, remove the message from Redux if it failed to send
        });
    }
  }, [message, socket, currentUser, selectedUser, dispatch]);

  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (container && container.scrollTop === 0 && !isLoading) {
      // Load more messages when scrolled to top
      setPage(prevPage => prevPage + 1);
    }
  }, [isLoading]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {selectedUser ? (
        <>
          <div className="bg-white p-4 border-b border-gray-200 flex items-center">
            {onBack && (
              <button 
                onClick={onBack}
                className="mr-2 p-2 hover:bg-gray-100 rounded-full md:hidden"
              >
                <ArrowLeft size={20} />
              </button>
            )}
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

          {/* msg content */}
          <div 
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-4 space-y-4"
          >
            {isLoading && <div className="text-center">Loading...</div>}
            {chatMessages.map((msg) => (
              <div
                key={msg._id}
                className={`p-2 rounded-lg max-w-xs ${
                  msg.senderId === currentUser?._id 
                  ? 'bg-blue-100 ml-auto' 
                  : 'bg-gray-100 mr-auto'
                }`}
                >
                {msg.message}
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

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
          <UserIcon className="text-gray-300" size={64} />
          <p className="mt-4 text-xl text-gray-500">Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default RightChat;