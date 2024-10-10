import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProfile } from '@/api/user.api';
// import { getCurrentUserPost } from '@/api/post.api';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UserType, PostType } from '@/data/interface.data';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAllPosts } from '@/api/post.api';
import EditProfile from '@/components/profile/EditProfile';

const Profile: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [open, setOpen] = React.useState(false);

  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserType | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const response = await getProfile(userId!);

        // eita emon kora jete pare like if user set private profile then getprofile will call otherwise for public profile getAllpost
        // public profile
        const allPosts = await getAllPosts();
        // private profile 
        // const allPosts = await getCurrentUserPost();

        if (response.success && allPosts.success) {
          setUser(response.user);
          setPosts(allPosts.posts.filter((post: PostType) => post.author._id === userId)); //jegula OP er post only, tho backend handled it already 
        } else {
          setError('Failed to load profile or posts');
        }
      } catch (error) {
        setError('An error occurred while fetching the profile or posts');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
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

  const handleEditProfile = async () => {
    setOpen(true)
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center mb-8">
          {/* facing some problem here, 
            1. if I show the photo after fetching (user?.profilePicture) then after updating phto is's showing the previous photo
            2. if I show the phot after dispatching (currentUser?.profilePicture) then after opeing someone other's profile it's showing current user photo still 
)
          */}
          <img
            src={user?.profilePicture || "https://via.placeholder.com/150"}
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
            <p className="mb-2">{user?.bio}</p>
            {
              (currentUser?._id === userId) && <Button onClick={handleEditProfile} variant="outline">Edit Profile</Button>
            }
          </div>
          <EditProfile open={open} setOpen={setOpen} />
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <div 
              key={post._id} 
              className="relative aspect-square bg-gray-200 group"
            >
              {/* Image */}
              <img 
                src={post.image} 
                alt={post.caption} 
                className="object-cover w-full h-full"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                <div className="text-center">
                  <div className="mb-1">
                    <span className="font-bold">{post.likes.length}</span> Likes
                  </div>
                  <div>
                    <span className="font-bold">{post.comments.length}</span> Comments
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
