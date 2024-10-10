import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { PlusCircle } from "lucide-react";

const Stories: React.FC = () => {
  const posts = useSelector((state: RootState) => state.posts.posts);

  const uniqueUserStories = useMemo(() => {
    const userMap = new Map();
    posts.forEach((post) => {
      if (!userMap.has(post?.author?._id) || post.createdAt > userMap.get(post?.author?._id).createdAt) {
        userMap.set(post?.author?._id, post);
      }
    });
    return Array.from(userMap.values());
  }, [posts]);

  const StoryItem: React.FC<{ profilePicture: string; username: string; isActive?: boolean }> = ({ profilePicture, username, isActive = false }) => (
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 rounded-full ${isActive ? 'p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600' : ''} flex-shrink-0`}>
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
          <img
            src={profilePicture || "/profilepic.png"}
            alt={`${username}'s story`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <span className="text-xs mt-1 truncate w-16 text-center">{username}</span>
    </div>
  );

  return (
    <div className="flex space-x-4 mb-4 overflow-x-auto p-2">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <PlusCircle className="w-8 h-8 text-blue-500" />
        </div>
        <span className="text-xs mt-1">Add Story</span>
      </div>
      
      {uniqueUserStories.length > 0 ? (
        uniqueUserStories.map((post, index) => (
          <StoryItem 
            key={post.author?.id || index}
            profilePicture={post.author?.profilePicture || "/profilepic.png"}
            username={post.author?.username || 'User'}
            isActive={index % 2 === 0} // Example: every other story is active
          />
        ))
      ) : (
        [...Array(7)].map((_, i) => (
          <StoryItem 
            key={i}
            profilePicture="/profilepic.png"
            username={`User ${i + 1}`}
            isActive={i % 2 === 0} // Example: every other story is active
          />
        ))
      )}
    </div>
  );
};

export default Stories;