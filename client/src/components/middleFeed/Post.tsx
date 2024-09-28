import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { HiDotsHorizontal } from "react-icons/hi";
import { Button } from '../ui/button';
import ViewAllComment from './ViewAllComment';

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

type OpenComponent = 'none' | 'optionsDialog' | 'commentsDialog';

const Post: React.FC<PostProps> = ({ post }) => {
  const [comment, setComment] = useState<string>('');
  const [openComponent, setOpenComponent] = useState<OpenComponent>('none');

  const handleDialogOpen = (component: OpenComponent) => {
    setOpenComponent(component);
  };

  const deletePostHandler = () => {
    alert("Post deleted");
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

  return (
    <div className="bg-white border rounded-md mb-4">
      <div className="flex justify-between items-center">
        <div className="p-4 flex gap-3">
          <div className="w-8 h-8">
            <img
              src={post.author?.profilePicture}
              alt="userIcon"
              className="w-full rounded-full"
            />
          </div>
          <p className="font-semibold">{post.author?.username}</p>
        </div>
        <Dialog open={openComponent === 'optionsDialog'} onOpenChange={() => setOpenComponent('none')}>
          <DialogTrigger asChild>
            <span onClick={() => handleDialogOpen('optionsDialog')}>
              <HiDotsHorizontal className="cursor-pointer" />
            </span>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button variant="ghost" className="cursor-pointer w-fit text-red-400 font-bold">
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to fav
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit" onClick={deletePostHandler}>
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="justify-center items-center w-full">
        <img src={post.image} alt="Post" className="w-full" />
      </div>
      <div className="p-4">
        <div className="flex space-x-4 mb-2">
          <button>Like</button>
          <button onClick={() => handleDialogOpen('commentsDialog')}>Comment</button>
          <button>Share</button>
        </div>
        <p>{post.likes?.length} likes</p>
        <p>
          <strong>{post.author?.username}</strong> {post.caption}
        </p>
        <p className="text-gray-500 cursor-pointer" onClick={() => handleDialogOpen('commentsDialog')}>
          View all {post.comments?.length} comments
        </p>
        <ViewAllComment
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
              className="bg-blue-600 text-white p-2 rounded-r-md ml-2"
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
