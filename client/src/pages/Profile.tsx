import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProfile } from '@/api/user.api';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  followers: string[];
  following: string[];
  posts: string[];
  gender: string;
}

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(userId!);
        if (response.success) {
          setUser(response.user);
        } else {
          setError('Failed to load profile');
        }
      } catch (error) {
        setError('An error occurred while fetching the profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return <div className="text-red-500 text-center mt-8">{error || 'User not found'}</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center mb-8">
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt={user.username}
            className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-8"
          />
          <div>
            <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
            <div className="flex space-x-4 mb-4">
              <span><strong>{user.posts.length}</strong> posts</span>
              <span><strong>{user.followers.length}</strong> followers</span>
              <span><strong>{user.following.length}</strong> following</span>
            </div>
            <p className="mb-2">{user.bio}</p>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {user.posts.map((postId) => (
            <div key={postId} className="aspect-square bg-gray-200">
              {/* You would typically fetch and display the actual post image here */}
              <div className="w-full h-full flex items-center justify-center">
                Post {postId}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;