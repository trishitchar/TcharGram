import React from 'react';
import { GiMoebiusTriangle } from "react-icons/gi";
import { Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { logout as logoutApi } from '@/api/user.api';
import { logout as logoutSlice } from '@/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { removeAllPosts } from '@/redux/slices/allPostSlice';
import { removeSuggestedUsers } from '@/redux/slices/suggestedUsersSlice';
import { clearSocket } from '@/redux/slices/socketSlice';
import { clearChat } from '@/redux/slices/chatSlice';
import toast from 'react-hot-toast';

const MobileNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const logOutHandler = async () => {
    try {
      const response = await logoutApi();

      if (response.status === 200 || response.success) {
        localStorage.removeItem('token');
        document.cookie = 'token=; Max-Age=0';
        dispatch(logoutSlice());
        dispatch(removeAllPosts());
        dispatch(removeSuggestedUsers());
        dispatch(clearSocket());
        dispatch(clearChat());
        navigate('/login');
        toast.success('Successfully logged out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-4">
      <Button variant="ghost" size="icon">
        <Bell className="h-6 w-6" />
      </Button>
      
      <div className="flex items-center">
        <GiMoebiusTriangle className="text-2xl mr-2" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          TcharGram
        </h1>
      </div>
      
      <Button variant="ghost" size="icon" onClick={logOutHandler}>
        <LogOut className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default MobileNavbar;