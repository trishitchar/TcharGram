import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { HiDotsHorizontal } from "react-icons/hi";
import { Button } from '../ui/button';
import ViewAllComment from './ViewAllComment';
import { CommentType, deletePost, PostType } from '@/api/post.api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { removePost } from '@/redux/slices/allPostSlice';

interface PostProps {
  post: PostType;
}

type OpenComponent = 'none' | 'optionsDialog' | 'commentsDialog';

const Post: React.FC<PostProps> = ({ post }) => {
  const [comment, setComment] = useState<string>('');
  const [openComponent, setOpenComponent] = useState<OpenComponent>('none');
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user)

  const handleDialogOpen = (component: OpenComponent) => {
    setOpenComponent(component);
  };

  const deletePostHandler = async () => {
    try {
      const response = await deletePost(post._id);
      dispatch(removePost(post._id))
  
      toast.success(response.message || 'Post deleted successfully');

      setOpenComponent('none');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handlePostComment = () => {
    if (comment.trim()) {
      console.log('Posting comment:', comment);
      setComment('');
    }
  };

  // Default values for missing data
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
          <p className="font-semibold">{post.author?.username || defaultUsername}</p>
        </div>
        <Dialog open={openComponent === 'optionsDialog'} onOpenChange={() => setOpenComponent(prev => prev === 'optionsDialog' ? 'none' : 'optionsDialog')}>
          <DialogTrigger asChild>
            <span className="cursor-pointer">
              <HiDotsHorizontal />
            </span>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {
              (currentUser?._id !== post?.author?._id) &&
              <Button variant="ghost" className="w-full text-red-400 font-bold">
                {
                  currentUser?.following.some((id) => id === post?.author?._id) ? 'Unfollow' : 'Follow'
                }
              </Button>
            }
            <Button variant="ghost" className="w-full">
              Add to fav
            </Button>
            {
              (currentUser?._id === post?.author?._id) &&
              <Button variant="ghost" className="w-full" onClick={deletePostHandler}>
                Delete
              </Button>
            }
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full">
        <img src={post.image || defaultProfilePicture} alt="Post" className="w-full" />
      </div>
      <div className="p-4">
        <div className="flex space-x-4 mb-2">
          <button>Like</button>
          <button onClick={() => handleDialogOpen('commentsDialog')}>Comment</button>
          <button>Share</button>
        </div>
        <p>{post.likes?.length || 0} likes</p>
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