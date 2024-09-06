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
  const [posts, setPosts] = useState<PostType[]>([]); // State to hold posts
  const [page, setPage] = useState<number>(1); // State to track the current page
  const [loading, setLoading] = useState<boolean>(false); // State to manage loading state
  const [hasMore, setHasMore] = useState<boolean>(true); // State to track if there are more posts to load

  // Fetch posts with pagination
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Assuming the backend accepts page and limit query parameters for pagination
      const response = await axios.get(
        `${postBaseURL}/allposttest?page=${page}&limit=10`
      );
      if (response.data.success) {
        setPosts((prevPosts) => {
          const newPosts = response.data.posts;
          // Filter out any posts that already exist to avoid duplicates
          const uniqueNewPosts = newPosts.filter(
            (newPost: PostType) => !prevPosts.some((post) => post._id === newPost._id)
          );
          return [...prevPosts, ...uniqueNewPosts];
        });
        setHasMore(response.data.posts.length > 0); // Check if more posts are available
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, [page]);

  // Load more posts when clicking the button
  const loadMorePosts = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment the page number
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
      {hasMore && (
        <button
          onClick={loadMorePosts}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default Posts;
