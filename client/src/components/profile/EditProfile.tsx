import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { editProfileAPI } from '@/api/user.api';
import { updateProfile } from '@/redux/slices/authSlice';

interface EditProfileProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile: React.FC<EditProfileProps> = ({ open, setOpen }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [bio, setBio] = useState<string>(currentUser?.bio || '');
  const [gender, setGender] = useState<string>(currentUser?.gender || '');
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(currentUser?.profilePicture || null);
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("gender", gender);
      formData.append("userId", currentUser?._id || '');

      if (file) {
        formData.append("profilePicture", file);
      }

      const response = await editProfileAPI(formData);

      if (response.success) {
        dispatch(updateProfile(response.user));
        toast.success("Profile updated successfully!");
        setOpen(false);
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby='' className="sm:max-w-[425px] max-w-[90%] mx-auto p-4 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={imagePreview || "https://via.placeholder.com/150"} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => imageRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full text-white hover:bg-purple-600 transition-colors"
                >
                  <Camera size={16} />
                </button>
              </div>
              <input
                type="file"
                ref={imageRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                className="resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
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
              disabled={isLoading}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;