import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { User as UserIcon } from 'lucide-react';
import { UserType } from '@/data/interface.data';

interface LeftChatProps {
  onUserSelect: (user: UserType) => void;
}

const LeftChat: React.FC<LeftChatProps> = ({ onUserSelect }) => {
  const { users, loading, error } = useSelector((state: RootState) => state.suggestedUsers);
  const onlineUsers = useSelector((state: RootState) => state.chat.onlineUsers);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aOnline = onlineUsers.includes(a._id);
      const bOnline = onlineUsers.includes(b._id);
      if (aOnline === bOnline) return 0;
      return aOnline ? -1 : 1;
    });
  }, [users, onlineUsers]);

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      <h1 className="text-xl font-semibold p-4 md:p-6 border-b border-gray-200">Messages</h1>
      <div className="flex-grow overflow-y-auto">
        {loading && <p className="p-4 text-center">Loading...</p>}
        {error && <p className="p-4 text-center text-red-500">Error: {error}</p>}
        {sortedUsers.length > 0 ? (
          sortedUsers.map((user: UserType) => (
            <div
              key={user._id}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => onUserSelect(user)}
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <UserIcon className="text-gray-500" size={24} />
                </div>
              )}
              <div className='flex w-full justify-between'>
                <div>
                  <p className="font-medium">{user.username}</p>
                  {user.bio && <p className="text-sm text-gray-500 truncate">{user.bio}</p>}
                </div>
                <div className={`${onlineUsers.includes(user._id) ? 'text-green-500' : 'text-red-500'} font-bold`}>
                  {onlineUsers.includes(user._id) ? 'online' : 'offline'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftChat;