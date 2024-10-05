import React, { useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userBaseURL } from "@/data/data";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { decodeToken } from "@/middleware/DecodedToken";
import { Menu, X } from 'lucide-react';
import toast from "react-hot-toast";

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
      const response = await axios.get(`${userBaseURL}/logout`, { withCredentials: true });

      if (response.status === 200 || response.data.success) {
        localStorage.removeItem("token");
        document.cookie = "token=; Max-Age=0";
        dispatch(logout());
        navigate("/login");
        toast.success('logout done');
        console.log("Successfully logged out");
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-purple-900 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button onClick={goToHome}>
              <div className="mr-3">
                <img src="./logo.svg" alt="Logo" className="h-10 w-45" />
              </div>
            </button>
            {/* <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">TcharGram</div> */}
          </div>
          <nav className="hidden md:flex space-x-4">
            {!userId ? (
              <>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
                  onClick={handleLoginClick}
                >
                  Login
                </Button>
                <Button
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
                  onClick={handleFeedClick}
                >
                  Feed
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
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
        <div className="md:hidden">
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