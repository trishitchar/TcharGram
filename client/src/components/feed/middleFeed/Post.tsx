// one problem I found if I click on any user <Link to={`/profile/${post.author?._id} this will open up the user profile but showing extra things like edit profile, etc, I've used currentUserPost to fetch from backend, can use getAllPosts too
// one idea is currentUserPost acts like insta private id you can't see other's post
// but getAllPosts can see all user post kinda like public profile
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { HiDotsHorizontal } from "react-icons/hi";
import ViewAllComment from './ViewAllComment';
import {deletePost, likePost, dislikePost, addCommentt } from '@/api/post.api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { addComment, removePost, setPosts } from '@/redux/slices/allPostSlice';
import { FaHeart, FaRegHeart, FaRegComment, FaRegShareSquare } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { CommentType, PostType } from '@/data/interface.data';
import { Button } from '../../ui/button';

interface PostProps {
  post: PostType;
}

type OpenComponent = 'none' | 'optionsDialog' | 'commentsDialog';

const Post: React.FC<PostProps> = ({ post }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const allPosts = useSelector((state: RootState) => state.posts.posts);
  
  const [comment, setComment] = useState<string>('');
  const [openComponent, setOpenComponent] = useState<OpenComponent>('none');
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post.likes.length);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser?._id ?? ''));
    setLikeCount(post.likes.length);
  }, [post.likes, currentUser]);

  const handleDialogOpen = (component: OpenComponent) => {
    setOpenComponent(component);
  };

  const deletePostHandler = async () => {
    try {
      const response = await deletePost(post._id);
      dispatch(removePost(post._id));
  
      toast.success(response.message || 'Post deleted successfully');
      setOpenComponent('none');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleLikeFeature = async () => {
    if (!currentUser) {
      toast.error('Please log in to like posts');
      return;
    }
    try {
      let response;
      if (isLiked) {
        response = await dislikePost(post._id);
      } else {
        response = await likePost(post._id);
      }
      
      if (response && response.success) {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount(prevCount => newIsLiked ? prevCount + 1 : prevCount - 1);
        
        // Update the post in the Redux store
        const updatedPosts = allPosts.map(p => {
          if (p._id === post._id) {
            return {
              ...p,
              likes: newIsLiked 
                ? [...p.likes, currentUser._id]
                : p.likes.filter(id => id !== currentUser._id)
            };
          }
          return p;
        });
        
        dispatch(setPosts(updatedPosts));

        toast.success(response.message);
      }
    } catch (error) {
      toast.error('Failed to update like status');
    }
  };

  const handlePostComment = async () => {
    if (comment.trim()) {
      try {
        const response = await addCommentt(post._id, comment.trim());
        
        if (response.success) {
          // Dispatch the Redux action with the correct payload
          dispatch(addComment({
            postId: post._id,
            comment: response.comment
          }));
          
          toast.success(response.message);
          setComment(''); // Clear the comment input
        }
      } catch (error) {
        toast.error('Failed to add comment');
      }
    }
  };
  

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLikeFeature();
    }
  };

  const defaultProfilePicture = "https://via.placeholder.com/100";
  const defaultUsername = "Unknown User";

  return (
    <div className="bg-white border rounded-lg mb-4">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <img
              src={post.author?.profilePicture || defaultProfilePicture}
              alt="userIcon"
              className="w-full h-full object-cover"
            />
          </div>
          <Link to={`/profile/${post.author?._id}`} className="font-semibold">
            {post.author?.username || defaultUsername}
          </Link>
          {
            (currentUser?._id === post?.author?._id) && 
              <p className='bg-gray-400 text-center justify-center items-center px-2 rounded-2xl'>author</p>
          }
        </div>
        <Dialog open={openComponent === 'optionsDialog'} onOpenChange={() => setOpenComponent(prev => prev === 'optionsDialog' ? 'none' : 'optionsDialog')}>
          <DialogTrigger asChild>
            <span className="cursor-pointer">
              <HiDotsHorizontal />
            </span>
          </DialogTrigger>
          <DialogContent aria-describedby='' className="sm:max-w-[425px] max-w-[90%] mx-auto p-4">
            <DialogTitle className="sr-only">Post Options</DialogTitle>
            <div className="flex flex-col w-full gap-2">
              {currentUser && (
                <>
                  {currentUser._id !== post.author?._id && (
                    <Button 
                      variant="ghost" 
                      className="w-full py-6 text-base font-semibold hover:bg-gray-100"
                    >
                      {currentUser.following?.some((id) => id === post.author?._id) ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    className="w-full py-6 text-base font-semibold hover:bg-gray-100"
                  >
                    Add to Bookmark
                  </Button>
                  {currentUser._id === post.author?._id && (
                    <Button 
                      variant="ghost" 
                      className="w-full py-6 text-base font-semibold text-red-500 hover:bg-red-50"
                      onClick={deletePostHandler}
                    >
                      Delete
                    </Button>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full">
        <img src={post.image || defaultProfilePicture} alt="Post" className="w-full" onDoubleClick={handleDoubleTap} />
      </div>
      <div className="p-4">
        <div className="flex space-x-4 mb-2">
          <button onClick={handleLikeFeature} className="focus:outline-none">
            {isLiked ? (
              <FaHeart className="text-red-500 text-2xl" />
            ) : (
              <FaRegHeart className="text-2xl" />
            )}
          </button>
          <button onClick={() => handleDialogOpen('commentsDialog')} className="focus:outline-none">
            <FaRegComment className="text-2xl" />
          </button>
          <button className="focus:outline-none">
            <FaRegShareSquare className="text-2xl" />
          </button>
        </div>
        <p className="font-bold">{likeCount} likes</p>
        <p>
          <strong>{post.author?.username || defaultUsername}</strong> {post.caption || "No caption"}
        </p>
        <p className="text-gray-500 cursor-pointer" onClick={() => handleDialogOpen('commentsDialog')}>
          View all {post.comments?.length || 0} comments
        </p>
        <ViewAllComment
          post={{
            ...post,
            comments: post.comments || [] as CommentType[]
          }}
          openComponent={openComponent}
          handleDialogOpen={handleDialogOpen}
          comment={comment}
          handleCommentChange={handleCommentChange}
          handlePostComment={handlePostComment}
        />

        <div className="flex items-center mt-2">
          <input
            value={comment}
            onChange={handleCommentChange}
            type="text"
            placeholder="Add a comment..."
            className="flex-grow border rounded-l-md p-2"
          />
          {comment.trim() && (
            <button
              className="bg-blue-600 text-white p-2 rounded-r-md"
              onClick={handlePostComment}
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;