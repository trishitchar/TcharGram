import LeftChat from '@/components/chatting/LeftChat';
import RightChat from '@/components/chatting/RightChat';
import React, { useState } from 'react';
import {  User as UserType } from '@/data/interface.data';

const Chat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null); // Properly typed
  const [conversations, setConversations] = useState<{ [key: string]: string[] }>({});

  const handleUserSelect = (user: UserType) => {
    setSelectedUser(user);
    if (!conversations[user._id]) {
      setConversations({ ...conversations, [user._id]: [] });
    }
  };

  const handleSendMessage = (message: string) => {
    if (selectedUser) {
      setConversations({
        ...conversations,
        [selectedUser._id]: [...conversations[selectedUser._id], message],
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <LeftChat onUserSelect={handleUserSelect} />
      <RightChat
        selectedUser={selectedUser}
        conversations={conversations}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Chat;
