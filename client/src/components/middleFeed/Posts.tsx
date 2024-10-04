import React, { useEffect, useState } from 'react';
import Post from './Post';
import { getAllPosts, PostType } from '@/api/post.api';
import { useDispatch, useSelector } from 'react-redux';
import { addPosts } from '@/redux/slices/allPostSlice';
import { RootState } from '@/redux/store';

const Posts: React.FC = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);
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
          dispatch(addPosts(response.posts));
          setHasMore(response.posts.length > 0);
        } else {
          setError('Failed to fetch posts: ' + (response.message || 'Unknown error'));
          setHasMore(false);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError('An error occurred: ' + error.message);
        } else {
          setError('An unexpected error occurred.');
        }
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, dispatch]);

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* if any error show the error on top of the post */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {/* sending data to its child post components */}
      {Array.isArray(posts) && posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
      {/* loadmore component */}
      {hasMore && (
        <button
          onClick={loadMorePosts}
          disabled={loading}
          className={`bg-blue-500 text-white py-2 px-4 rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default Posts;