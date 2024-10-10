import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { followorunfollow, suggestedUsers } from '@/api/user.api';
import { 
  fetchSuggestedUsersStart,
  fetchSuggestedUsersSuccess,
  fetchSuggestedUsersFailure,
  updateFollowStatus as updateSuggestedFollowStatus,
  ExtendedUser
} from '@/redux/slices/suggestedUsersSlice';
import { updateFollowStatus as updateAuthFollowStatus } from '@/redux/slices/authSlice';

const SuggestionPage: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { users, loading, error } = useSelector((state: RootState) => state.suggestedUsers);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      handleFetchSuggestedUsers();
    }
  }, [currentUser]);

  const handleFetchSuggestedUsers = async () => {
    dispatch(fetchSuggestedUsersStart());

    try {
      const response = await suggestedUsers();

      if (response && Array.isArray(response.users)) {
        const suggestedUsers = response.users.map((user: ExtendedUser) => ({
          ...user,
          isFollowing: currentUser?.following.includes(user._id) || false,
        }));

        dispatch(fetchSuggestedUsersSuccess(suggestedUsers));
      } else {
        dispatch(fetchSuggestedUsersFailure('No users found'));
      }
    } catch (err) {
      dispatch(fetchSuggestedUsersFailure('Failed to fetch suggested users'));
    }
  };

  const handleFollowUnfollow = async (targetUserId: string) => {
    try {
      // Optimistic update
      dispatch(updateSuggestedFollowStatus(targetUserId));
      dispatch(updateAuthFollowStatus(targetUserId));

      const response = await followorunfollow(targetUserId);
      
      if (!response.success) {
        // Revert if API call fails
        dispatch(updateSuggestedFollowStatus(targetUserId));
        dispatch(updateAuthFollowStatus(targetUserId));
      }
    } catch (error) {
      // Revert on error
      dispatch(updateSuggestedFollowStatus(targetUserId));
      dispatch(updateAuthFollowStatus(targetUserId));
      console.error('Error in follow/unfollow operation:', error);
    }
  };

  const redirectToAllUsers = () => {
    navigate('/explore/people', { state: { users } });
  };

  return (
    <div className="w-80 p-4">
      {currentUser && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {currentUser.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt={currentUser.username}
                className="w-12 h-12 rounded-full mr-3 object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="text-gray-500 text-xl uppercase">
                  {currentUser.username[0]}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold">{currentUser.username}</p>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-gray-500">Suggested for you</p>
          <button 
            onClick={redirectToAllUsers}
            className="text-sm font-medium text-gray-900 hover:text-gray-700"
          >
            See All
          </button>
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-2" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {users.slice(0, 5).map(user => (
              <li key={user._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <span className="text-gray-500 text-sm uppercase">
                        {user.username[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <Link to={`/profile/${user._id}`} className="font-semibold">
                      <p className="text-sm font-medium">{user.username}</p>
                    </Link>
                    <p className="text-xs text-gray-500">Suggested for you</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollowUnfollow(user._id)}
                  className={`text-sm font-medium ${
                    user.isFollowing 
                      ? 'text-gray-500 hover:text-gray-700' 
                      : 'text-blue-500 hover:text-blue-600'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SuggestionPage;