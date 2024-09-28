import React, { useState, useRef } from 'react';
import { Dialog, DialogContent } from '../ui/dialog'; 
import axios from 'axios';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import { RootState } from '@/redux/store'; // Import RootState from your store to type-check Redux state
import { postBaseURL } from '@/data/data';

interface CreatePostProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePost: React.FC<CreatePostProps> = ({ open, setOpen }) => {
  const [caption, setCaption] = useState<string>(''); 
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null); // Keep track of the file

  // Get the current user from the Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Handle creating a post
  const createPostHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!file || !caption || !currentUser) {
        console.error('Image, caption, or user is missing.');
        return;
      }

      // Get the JWT token from localStorage or your auth provider
      const token = localStorage.getItem('token'); // or however you're storing the token

      if (!token) {
        console.error('No authentication token found.');
        return;
      }

      // Prepare the FormData object for file upload
      const formData = new FormData();
      formData.append('caption', caption); // Add caption
      formData.append('image', file); // Add image file
      formData.append('userId', currentUser._id); // Include user ID from Redux

      // Send the POST request to the backend
      const response = await axios.post(`${postBaseURL}/addpost`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Add the Authorization header
        },
      });

      console.log('Post created successfully:', response.data);

      // Clear the form after post creation
      setCaption('');
      setFile(null);
      setImagePreview(null);
      setImageUploaded(false);
      setOpen(false); // Close dialog after post creation

    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // Handle image upload and convert it to Data URL
  const handleImageUpload = async () => {
    if (imageRef.current && imageRef.current.files?.length) {
      const file = imageRef.current.files[0];
      setFile(file); // Save the file for the request

      // Generate an image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setImageUploaded(true);
    }
  };

  // Handle caption change
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
                  src={imagePreview as string}
                  alt="Uploaded"
                  className="object-cover w-full h-64 rounded-md"
                />
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
