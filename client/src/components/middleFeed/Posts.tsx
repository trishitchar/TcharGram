import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';
import { postBaseURL } from '@/data/data';

interface PostType {
  _id: string;
  caption: string;
  image: string;
  author: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  likes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // const response = await axios.get(
        //   `${postBaseURL}/allposttest?page=${page}&limit=10`
        // );
        const response = await axios.get(`${postBaseURL}/allposttest`, {
          params: { page, limit: 10 },
        });
        if (response.data.success) {
          const newPosts = response.data.posts;
          setPosts((prevPosts) => {
            const uniquePosts = newPosts.filter(
              (newPost: PostType) => !prevPosts.some((post) => post._id === newPost._id)
            );
            return [...prevPosts, ...uniquePosts];
          });
          setHasMore(newPosts.length > 0);
        } else {
          console.error('Failed to fetch posts:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
      {hasMore && (
        <button
          onClick={loadMorePosts}
          disabled={loading}
          className={`bg-blue-500 text-white py-2 px-4 rounded mt-4 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default Posts;
