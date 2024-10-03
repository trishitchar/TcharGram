// Sidebar.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoHomeFill } from "react-icons/go";
import { IoSearch, IoCreateOutline, IoLogOutOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { BsFillCameraReelsFill } from "react-icons/bs";
import { TbMessageFilled } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userBaseURL } from '@/data/data';
import { RootState } from "@/redux/store"; 
import { logout } from "@/redux/slices/authSlice";
import CreatePost from "./CreatePost";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  const sidebarItems = [
    { icon: <GoHomeFill />, text: "Home" },
    { icon: <IoSearch />, text: "Search" },
    { icon: <MdOutlineExplore />, text: "Explore" },
    { icon: <BsFillCameraReelsFill />, text: "Reels" },
    { icon: <TbMessageFilled />, text: "Messages" },
    { icon: <FaRegHeart />, text: "Notifications" },
    { icon: <IoCreateOutline />, text: "Create" },
    { 
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"}
            alt="Profile"
            className="rounded-full"
          />
          <AvatarFallback>TC</AvatarFallback>
        </Avatar>
      ), 
      text: "Profile" 
    },
    { icon: <IoLogOutOutline />, text: "LogOut" },
  ];

  const logOutHandler = async () => {
    try {
      const response = await axios.get(`${userBaseURL}/logout`, { withCredentials: true });

      if (response.status === 200 || response.data.success) {
        localStorage.removeItem('token'); 
        document.cookie = 'token=; Max-Age=0';
        dispatch(logout()); // Dispatch the logout action
        navigate('/login');
        console.log('Successfully logged out');
      } else {
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleClick = (text: string) => {
    switch (text) {
      case 'Home':
        navigate('/feed');
        break;
      case 'LogOut':
        logOutHandler();
        break;
      case 'Profile':
        navigate('/profile');
        break;
      case 'Create':
        setOpen(true);
        break;
      default:
        console.log(`Clicked on ${text}`);
    }
  };

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col justify-between shadow-md">
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Instagram</h1>
        {sidebarItems.map(({ icon, text }) => (
          <Button
            onClick={() => handleClick(text)}
            key={text}
            className="flex items-center space-x-4 py-3 px-4 mb-2 rounded-lg text-gray-300 hover:bg-gray-200 hover:text-black transition-colors duration-200"
          >
            {icon}
            <span className="text-base font-medium">{text}</span>
          </Button>
        ))}
      </div>
      <CreatePost open={open} setOpen={setOpen} />
      <div className="p-6">
        <button className="text-base text-gray-600 hover:text-blue-500 transition-colors duration-200">
          More
        </button>
      </div>
    </div>
  );
};

export default Sidebar;