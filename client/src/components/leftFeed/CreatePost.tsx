import React, { useState, useRef } from 'react';
import { Dialog, DialogContent } from '../ui/dialog'; 
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { createPost } from '@/api/post.api.ts';
import { addPosts } from '@/redux/slices/allPostSlice';

interface CreatePostProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePost: React.FC<CreatePostProps> = ({ open, setOpen }) => {
  const [caption, setCaption] = useState<string>('');
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);


  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const createPostHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    try {
      if (!file || !caption || !currentUser) {
        setError('Image, caption, or user is missing.');
        return;
      }
  
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('image', file);
      formData.append('userId', currentUser._id);
  
      const response = await createPost(formData);
  
      if (response.success && response.post) {
        // Dispatch the newly created post to Redux store
        dispatch(addPosts([response.post]));  // Add the new post as an array
        console.log("Post added and dispatched to the store");
        
        // Clear the form after successful post creation
        setCaption('');
        setFile(null);
        setImagePreview(null);
        setImageUploaded(false);
        setOpen(false); // Close the modal
      } else {
        setError('Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    }
  };
  

  const handleImageUpload = async () => {
    if (imageRef.current && imageRef.current.files?.length) {
      const file = imageRef.current.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setImageUploaded(true);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent>
          <form onSubmit={createPostHandler}>
            <label htmlFor="post-content">Post Caption</label>
            <textarea
              id="post-content"
              name="content"
              placeholder="Write your post caption here..."
              className="w-full p-2 mt-2 border rounded-md"
              value={caption}
              onChange={handleCaptionChange}
            ></textarea>

            <input
              type="file"
              ref={imageRef}
              className="hidden"
              onChange={handleImageUpload}
            />

            {!imageUploaded && (
              <button
                type="button"
                className="mt-4 bg-blue-500 text-white p-2 rounded-md"
                onClick={() => imageRef.current?.click()}
              >
                Upload Image
              </button>
            )}

            {imagePreview && (
              <div className='mt-4'>
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  className="object-cover w-full h-64 rounded-md"
                />
              </div>
            )}

            {error && (
              <div className="mt-4 text-red-500">
                {error}
              </div>
            )}

            {caption && imageUploaded && (
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white p-2 rounded-md"
              >
                Create Post
              </button>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;