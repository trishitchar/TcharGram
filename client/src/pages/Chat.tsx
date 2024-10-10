import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { UserType } from '@/data/interface.data';
import { setOnlineUsers, addMessage } from '@/redux/slices/chatSlice';
import LeftChat from '@/components/chatting/LeftChat';
import RightChat from '@/components/chatting/RightChat';

const Chat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const dispatch = useDispatch();
  const socket = useSelector((state: RootState) => state.socket.socket);
  const user = useSelector((state: RootState) => state.auth.user);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    if (socket && user) {
      // Add user to online users
      socket.emit('addUser', user._id);

      // Listen for online users updates
      socket.on('getUsers', (users: string[]) => {
        dispatch(setOnlineUsers(users));
      });

      // Listen for incoming messages
      socket.on('getMessage', (data: {
        senderId: string,
        message: string,
        _id: string,
        createdAt: string
      }) => {
        dispatch(addMessage({
          userId: data.senderId,
          message: {
            ...data,
            receiverId: user._id,
            isRead: false
          }
        }));
      });
    }

    return () => {
      if (socket) {
        socket.off('getUsers');
        socket.off('getMessage');
      }
    };
  }, [socket, user, dispatch]);

  const handleUserSelect = (user: UserType) => {
    setSelectedUser(user);
  };
  
  const handleBackToUsers = () => {
    setSelectedUser(null);
  };


  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Left Chat - Hidden on mobile when a user is selected */}
      <div className={`${isMobileView && selectedUser ? 'hidden' : 'w-full md:w-1/3'}`}>
        <LeftChat onUserSelect={handleUserSelect} />
      </div>
      
      {/* Right Chat - Full width on mobile when a user is selected */}
      <div className={`${isMobileView ? (selectedUser ? 'w-full' : 'hidden') : 'w-2/3'}`}>
        <RightChat 
          selectedUser={selectedUser} 
          onBack={isMobileView ? handleBackToUsers : undefined}
        />
      </div>
    </div>
  );
};


export default Chat;