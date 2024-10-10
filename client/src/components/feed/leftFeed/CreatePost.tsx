import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addpost } from '@/api/post.api';
import { addPosts } from '@/redux/slices/allPostSlice';
import toast from 'react-hot-toast';

interface CreatePostProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePost: React.FC<CreatePostProps> = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [caption, setCaption] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
    if (imageRef.current) {
      imageRef.current.value = '';
    }
  };

  const createPostHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!file || !caption || !currentUser) {
        toast.error('Please add both an image and caption');
        return;
      }

      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('image', file);
      formData.append('userId', currentUser._id);

      const response = await addpost(formData);

      if (response.success && response.post) {
        dispatch(addPosts([response.post]));
        toast.success('Post created successfully!');
        setCaption('');
        setFile(null);
        setImagePreview(null);
        setOpen(false);
        window.location.reload();
      } else {
        toast.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby='' className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={createPostHandler} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Write your caption here..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="resize-none h-24"
              />
            </div>

            <div className="space-y-2">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-48 flex flex-col items-center justify-center space-y-2"
                  onClick={() => imageRef.current?.click()}
                >
                  <ImagePlus className="h-8 w-8" />
                  <span>Add Photo</span>
                </Button>
              )}
              <input
                type="file"
                ref={imageRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !caption || !file}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;