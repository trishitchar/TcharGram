import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { decodeToken } from '../../middleware/DecodedToken';
import { userBaseURL } from '@/data/data';
import { useNavigate } from 'react-router-dom';
import { User } from '@/data/interface.data';

// interface User {
//   _id: string;
//   username: string;
//   profilePicture?: string;
//   isFollowing?: boolean;
//   following: string[]; 
// }

interface nowUser extends User{
  // user: User;
  isFollowing?: boolean;
}

const SuggestionPage: React.FC = () => {
  const [users, setUsers] = useState<nowUser[]>([]);
  const [currentUser, setCurrentUser] = useState<nowUser | null>(null);
  const [followingList, setFollowingList] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchSuggestedUsers();
    }
  }, [currentUser]);

  const fetchCurrentUser = async () => {
    const currentUserId = decodeToken();
    console.log("currentUserId"+currentUserId);
    if (currentUserId) {
      try {
        const response = await axios.get<{ user: nowUser; success: boolean }>(`${userBaseURL}/profile/${currentUserId}`, {
          withCredentials: true
        });
        setCurrentUser(response.data.user);
        setFollowingList(response.data.user.following);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const response = await axios.get<{ users: User[] }>(`${userBaseURL}/suggested`, {
        withCredentials: true
      });
      const suggestedUsers = response.data.users.map((user: User) => ({
        ...user,
        isFollowing: followingList.includes(user._id)
      }));
      setUsers(suggestedUsers);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const followUnfollow = async (targetUserId: string) => {
    try {
      const response = await axios.post<{ success: boolean }>(
        `${userBaseURL}/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === targetUserId 
              ? { ...user, isFollowing: !user.isFollowing } 
              : user
          )
        );

        // Update the followingList
        setFollowingList(prevList => 
          prevList.includes(targetUserId)
            ? prevList.filter(id => id !== targetUserId)
            : [...prevList, targetUserId]
        );

        // Update the currentUser's following list
        setCurrentUser(prevUser => {
          if (prevUser) {
            const newFollowing = prevUser.following.includes(targetUserId)
              ? prevUser.following.filter(id => id !== targetUserId)
              : [...prevUser.following, targetUserId];
            return { ...prevUser, following: newFollowing };
          }
          return prevUser;
        });
      }
    } catch (error) {
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
              <img src={currentUser.profilePicture} alt={currentUser.username} className="w-12 h-12 rounded-full mr-3" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 mr-3"></div>
            )}
            <div>
              <p className="font-semibold">{currentUser.username}</p>
              <p className="text-sm text-gray-500">{currentUser.username}</p>
            </div>
          </div>
          <button className="text-blue-500">Switch</button>
        </div>
      )}
      <div>
        <p className="font-semibold text-gray-500 mb-2">Suggested for you</p>
        <ul className="space-y-3">
          {users.slice(0, 5).map((user) => (
            <li key={user._id} className="flex items-center justify-between">
              <div className="flex items-center">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.username} className="w-8 h-8 rounded-full mr-2" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                )}
                <p>{user.username}</p>
              </div>
              <button onClick={() => followUnfollow(user._id)} className="text-blue-500">
                {user.isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={redirectToAllUsers} className="mt-4 text-blue-500">Show All Suggested</button>
      </div>
    </div>
  );
};

export default SuggestionPage;