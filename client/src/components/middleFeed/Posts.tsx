// src/components/Posts.tsx

import React, { useEffect, useState } from 'react';
import Post from './Post';
import { getAllPosts, PostType } from '@/api/post.api.ts';

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllPosts(page, 10);
        if (response.success && response.posts) {
          setPosts((prevPosts) => {
            const uniquePosts = response.posts.filter(
              (newPost) => !prevPosts.some((post) => post._id === newPost._id)
            );
            return [...prevPosts, ...uniquePosts];
          });
          setHasMore(response.posts.length > 0);
        } else {
          setError('Failed to fetch posts: ' + (response.message || 'Unknown error'));
          setHasMore(false);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Unauthorized') {
            setError('Your session has expired. Please log in again.');
            // Here you might want to redirect to login page or refresh the token
          } else {
            setError('An error occurred while fetching posts. Please try again.');
          }
        } else {
          setError('An unexpected error occurred.');
        }
        console.error('Error fetching posts:', error);
        setHasMore(false);
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
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
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