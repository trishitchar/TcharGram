import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { CommentType, PostType } from '@/data/interface.data';


// interface CommentType {
//   _id: string;
//   text: string;
//   author: {
//     _id: string;
//     username: string;
//     profilePicture?: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

interface ViewAllCommentProps {
  post: PostType & { comments: CommentType[] }; // Extend PostType to include comments
  openComponent: 'none' | 'optionsDialog' | 'commentsDialog';
  handleDialogOpen: (component: 'none' | 'optionsDialog' | 'commentsDialog') => void;
  comment: string;
  handleCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePostComment: () => void;
}

const ViewAllComment: React.FC<ViewAllCommentProps> = ({
  post,
  openComponent,
  handleDialogOpen,
  comment,
  handleCommentChange,
  handlePostComment,
}) => {
  // Default values for missing data
  const defaultProfilePicture = "https://via.placeholder.com/100";
  const defaultUsername = "Unknown User";

  return (
    <Dialog open={openComponent === 'commentsDialog'} onOpenChange={() => handleDialogOpen('none')}>
      <DialogContent aria-describedby='' className="max-w-[80vw] max-h-[80vh] w-full h-full p-0 flex flex-row overflow-hidden">
      <DialogTitle className='hidden'></DialogTitle> 
        {/* Image Section */}
        <div className="w-2/5 bg-black flex items-center justify-center">
          <img
            src={post.image || defaultProfilePicture}
            alt="post"
            className="object-cover h-full w-full"
          />
        </div>
        {/* Details Section */}
        <div className="w-3/5 bg-white flex flex-col">
          {/* Post Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <img
                src={post.author?.profilePicture || defaultProfilePicture}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold">{post.author?.username || defaultUsername}</span>
            </div>
            <button className="text-blue-500 font-semibold">Follow</button>
          </div>
          {/* Comments Section */}
          <div className="flex-grow overflow-y-auto p-4">
            {(post.comments || []).map((comment: CommentType) => (
              <div key={comment._id} className="flex items-start mb-4">
                <img
                  src={comment.author?.profilePicture || defaultProfilePicture}
                  alt="profile"
                  className="w-8 h-8 rounded-full mr-3 object-cover"
                />
                <div>
                  <span className="font-semibold mr-2">{comment.author?.username || defaultUsername}</span>
                  <span>{comment.text}</span>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Comment Input Section */}
          <div className="border-t p-4 flex items-center gap-3">
            <input
              type="text"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Add a comment..."
              className="flex-grow border rounded-md p-2"
            />
            <button className="text-blue-500 font-semibold" onClick={handlePostComment}>
              Post
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAllComment;