import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';

interface ViewAllCommentProps {
  openComponent: 'none' | 'optionsDialog' | 'commentsDialog';
  handleDialogOpen: (component: 'none' | 'optionsDialog' | 'commentsDialog') => void;
  comment: string;
  handleCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePostComment: () => void;
}

const ViewAllComment: React.FC<ViewAllCommentProps> = ({
  openComponent,
  handleDialogOpen,
  comment,
  handleCommentChange,
  handlePostComment,
}) => {
  return (
    <Dialog open={openComponent === 'commentsDialog'} onOpenChange={() => handleDialogOpen('none')}>
      <DialogContent className="max-w-[80vw] max-h-[80vh] w-full h-full p-0 flex flex-row overflow-hidden">
        {/* Image Section */}
        <div className="w-2/5 bg-black flex items-center justify-center">
          <img
            src="https://via.placeholder.com/600x600"
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
                src="https://via.placeholder.com/50"
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">username</span>
            </div>
            <button className="text-blue-500 font-semibold">Follow</button>
          </div>

          {/* Comments Section */}
          <div className="flex-grow overflow-y-auto p-4">
            {/* Dummy Comments */}
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex items-start mb-4">
                <img
                  src="https://via.placeholder.com/40"
                  alt="profile"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <span className="font-semibold mr-2">user{index + 1}</span>
                  <span>This is a dummy comment to show the layout like Instagram.</span>
                  <p className="text-gray-500 text-xs mt-1">2h ago</p>
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
