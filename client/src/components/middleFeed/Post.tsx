import React from 'react';

interface PostProps {
  post: {
    caption: string;
    image: string;
    author: {
      username: string;
      profilePicture: string;
    };
    likes: string[];
    comments: string[];
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="bg-white border rounded-md mb-4">
      <div className="p-4 flex gap-3">
        <div className='w-8 h-8'>
          <img
            src={post.author.profilePicture}
            alt="userIcon"
            className="w-full rounded-full"
          />
        </div>
        <p className="font-semibold">{post.author.username}</p>
      </div>
      <div className='justify-center items-center w-full'>
        <img src={post.image} alt="Post" className="w-full" />
      </div>
      <div className="p-4">
        <div className="flex space-x-4 mb-2">
          <button>Like</button>
          <button>Comment</button>
          <button>Share</button>
        </div>
        <p>{post.likes.length} likes</p>
        <p>
          <strong>{post.author.username}</strong> {post.caption}
        </p>
        <p className="text-gray-500">View all {post.comments.length} comments</p>
        <input type="text" placeholder="Add a comment..." className="w-full mt-2" />
      </div>
    </div>
  );
};

export default Post;
