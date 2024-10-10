import React, { useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as logoutSlice} from "@/redux/slices/authSlice";
import { logout as logoutApi} from '@/api/user.api';
import { decodeToken } from "@/middleware/DecodedToken";
import { Menu, X } from 'lucide-react';
import toast from "react-hot-toast";
import { removeAllPosts } from "@/redux/slices/allPostSlice";
import { removeSuggestedUsers } from "@/redux/slices/suggestedUsersSlice";
import { clearSocket } from "@/redux/slices/socketSlice";
import { clearChat } from "@/redux/slices/chatSlice";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId: any = decodeToken();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goToHome = () => {
    navigate('/');
    setIsMenuOpen(false);
  }

  const handleLoginClick = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleSignUpClick = () => {
    navigate("/register");
    setIsMenuOpen(false);
  };

  const handleFeedClick = () => {
    navigate("/feed");
    setIsMenuOpen(false);
  };

  const logOutHandler = async () => {
    try {
      const response = await logoutApi();
      if (response.status === 200 || response.success) {
        localStorage.removeItem("token");
        document.cookie = "token=; Max-Age=0";
        dispatch(logoutSlice());
        dispatch(removeAllPosts());
        dispatch(removeSuggestedUsers());
        dispatch(clearSocket())
        dispatch(clearChat())
        navigate("/login");
        toast.success('logout done');
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-purple-900 text-white shadow-md relative overflow-hidden">
      {/* Add a subtle animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(120,0,255,0.1)_0%,transparent_70%)] animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button onClick={goToHome} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <img 
                  src="./logo.svg" 
                  alt="Logo" 
                  className="h-10 w-45 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
                />
              </div>
            </button>
          </div>
          
          <nav className="hidden md:flex space-x-4">
            {!userId ? (
              <>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  onClick={handleLoginClick}
                >
                  Login
                </Button>
                <Button
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  onClick={handleFeedClick}
                >
                  Feed
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  onClick={logOutHandler}
                >
                  Logout
                </Button>
              </>
            )}
          </nav>
          
          <div className="md:hidden">
            <Button
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden relative z-10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!userId ? (
              <>
                <Button
                  className="block w-full px-3 text-center py-2 rounded-md text-base font-medium text-white bg-gray-900 hover:bg-gray-700 hover:text-white"
                  onClick={handleLoginClick}
                >
                  Login
                </Button>
                <Button
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 hover:bg-gray-700 hover:text-white"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 hover:bg-gray-700 hover:text-white"
                  onClick={handleFeedClick}
                >
                  Feed
                </Button>
                <Button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 hover:bg-gray-700 hover:text-white"
                  onClick={logOutHandler}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;