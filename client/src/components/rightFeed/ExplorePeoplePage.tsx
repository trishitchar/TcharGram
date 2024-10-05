import React from 'react';
import { useLocation } from 'react-router-dom';

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  isFollowing?: boolean;
}

const ExplorePeoplePage: React.FC = () => {
  const location = useLocation();
  const { users } = location.state || {};

  return (
    <div className="flex h-screen">
      {/* Main content: suggested users on the right */}
      <div className="flex-1 p-6 overflow-y-auto">
        <p className="font-semibold text-gray-500 mb-4">All Suggested Users</p>
        <ul className="space-y-4">
          {users && users.length > 0 ? (
            users.map((user: User) => (
              <li key={user._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} className="w-8 h-8 rounded-full mr-4" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-4"></div>
                  )}
                  <p>{user.username}</p>
                </div>
                <button className="text-blue-500">
                  {user.isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </li>
            ))
          ) : (
            <p>No users found</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ExplorePeoplePage;
