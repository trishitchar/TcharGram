import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { User as UserType } from '@/data/interface.data';
import { setOnlineUsers, addMessage } from '@/redux/slices/chatSlice';
import LeftChat from '@/components/chatting/LeftChat';
import RightChat from '@/components/chatting/RightChat';

const Chat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const dispatch = useDispatch();
  const socket = useSelector((state: RootState) => state.socket.socket);
  const user = useSelector((state: RootState) => state.auth.user);

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

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <LeftChat onUserSelect={handleUserSelect} />
      <RightChat selectedUser={selectedUser} />
    </div>
  );
};

export default Chat;