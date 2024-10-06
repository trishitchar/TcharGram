import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { followorunfollow } from '@/api/user.api';
import { RootState, AppDispatch } from '@/redux/store';
import {updateFollowStatus as updateSuggestedFollowStatus } from '@/redux/slices/suggestedUsersSlice';
import { updateFollowStatus as updateAuthFollowStatus } from '@/redux/slices/authSlice';
import { User } from '@/data/interface.data';

interface ExtendedUser extends User{
  isFollowing?: boolean;
}

const ExplorePeoplePage: React.FC = () => {
  const location = useLocation();
  const { users: initialUsers } = location.state || { users: [] };
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleFollowUnfollow = async (targetUserId: string) => {
    try {
      // Optimistic update
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === targetUserId ? { ...user, isFollowing: !user.isFollowing } : user
        )
      );
      dispatch(updateSuggestedFollowStatus(targetUserId));
      dispatch(updateAuthFollowStatus(targetUserId));

      const response = await followorunfollow(targetUserId);
      
      if (!response.success) {
        // Revert changes if API call fails
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === targetUserId ? { ...user, isFollowing: !user.isFollowing } : user
          )
        );
        dispatch(updateSuggestedFollowStatus(targetUserId));
        dispatch(updateAuthFollowStatus(targetUserId));
      }
    } catch (error) {
      // Revert changes on error
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === targetUserId ? { ...user, isFollowing: !user.isFollowing } : user
        )
      );
      dispatch(updateSuggestedFollowStatus(targetUserId));
      dispatch(updateAuthFollowStatus(targetUserId));
      console.error('Error in follow/unfollow operation:', error);
    }
  };

  useEffect(() => {
    if (initialUsers && currentUser) {
      const updatedUsers = initialUsers.map((user: ExtendedUser) => ({
        ...user,
        isFollowing: currentUser.following.includes(user._id),
      }));
      setUsers(updatedUsers);
    }
  }, [initialUsers, currentUser]);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Suggested Users</h2>
      <div className="space-y-4">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
              <div className="flex items-center">
                {/* profile pic */}
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <span className="text-gray-500 text-xl uppercase">
                      {user.username ? user.username[0] : '?'}
                    </span>
                  </div>
                )}
                {/* username section */}
                <div>
                  <Link to={`/profile/${user._id}`} className="font-semibold">
                  <p className="font-medium">{user.username}</p>
                  {user.bio && <p className="text-sm text-gray-500">{user.bio}</p>}
                  </Link>
                </div>
              </div>
              <button
                onClick={() => handleFollowUnfollow(user._id)}
                className={`px-4 py-2 rounded transition-colors ${
                  user.isFollowing
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No suggested users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePeoplePage;