import React, { useEffect, useState } from 'react';
import Post from './Post';
import { getAllPosts } from '@/api/post.api';
import { useDispatch, useSelector } from 'react-redux';
import { addPosts } from '@/redux/slices/allPostSlice';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
          if (response.posts.length === 0) {
            setHasMore(false);
            if (page === 1) {
              setError('No posts available.');
            }
          } else {
            dispatch(addPosts(response.posts));
          }
        } else {
          throw new Error(response.message || 'Unknown error');
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('404')) {
            setHasMore(false);
            if (page === 1) {
              setError('No posts available.');
            }
          } else {
            setError('Mmaybe You all cought up ' + error.message);
          }
        } else {
          setError('An unexpected error occurred.');
        }
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
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
      
      {hasMore ? (
        <button
          onClick={loadMorePosts}
          disabled={loading}
          className={`bg-blue-500 text-white py-2 px-4 rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      ) : posts.length > 0 && (
        <p className="text-center text-gray-600 mt-4">No more posts to load.</p>
      )}
    </div>
  );
};

export default Posts;