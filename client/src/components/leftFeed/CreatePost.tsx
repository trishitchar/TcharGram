import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog'; // Ensure these are correct paths

// TypeScript interface for props
interface CreatePostProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePost: React.FC<CreatePostProps> = ({ open, setOpen }) => {

  // Handler for creating a post
  const createPostHandler = async (e: React.FormEvent) => {
    e.preventDefault();  // Corrected to preventDefault
    try {
      // Add your post creation logic here
      console.log("Post creation logic to be implemented");
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen(false)}> {/* Closing the dialog when user clicks outside */}
        <DialogContent>
          <form onSubmit={createPostHandler}>
            <label htmlFor="post-content">Post Content</label>
            <textarea id="post-content" name="content" placeholder="Write your post here..." className="w-full p-2 mt-2 border rounded-md"></textarea>

            <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-md">
              Create Post
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
