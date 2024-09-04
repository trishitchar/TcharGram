import React from "react";
import { GoHomeFill } from "react-icons/go";
import { IoSearch, IoCreateOutline, IoLogOutOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { BsFillCameraReelsFill } from "react-icons/bs";
import { TbMessageFilled } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { Button } from "../ui/button";
import { userBaseURL } from '@/data/data';
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type SidebarItem = {
  icon: JSX.Element;
  text: string;
};

const Sidebar: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: <GoHomeFill />, text: "Home" },
    { icon: <IoSearch />, text: "Search" },
    { icon: <MdOutlineExplore />, text: "Explore" },
    { icon: <BsFillCameraReelsFill />, text: "Reels" },
    { icon: <TbMessageFilled />, text: "Messages" },
    { icon: <FaRegHeart />, text: "Notifications" },
    { icon: <IoCreateOutline />, text: "Create" },
    { 
      icon: 
      <Avatar>
        <AvatarImage src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png" alt="lol"></AvatarImage>
        <AvatarFallback>TC</AvatarFallback>
      </Avatar>, text: "Profile" },
    { icon: <IoLogOutOutline />, text: "LogOut" },
  ];

  const logOutHandler = async () => {
    try {
      const response = await axios.get(`${userBaseURL}/logout`);
      console.log(response);
      // Optionally, redirect user or update state here
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleClick = (text: string) => {
    switch (text) {
      case 'LogOut':
        logOutHandler();
        break;
      case 'Profile':
        // Add navigation to profile page or handler here
        console.log("Navigating to profile");
        break;
      default:
        console.log(`Clicked on ${text}`);
    }
  };

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col relative">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8">Instagram</h1>
        {sidebarItems.map(({ icon, text }) => (
          <Button
            onClick={() => handleClick(text)}
            key={text}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            {icon}
            <span className="text-sm">{text}</span>
          </Button>
        ))}
      </div>
      <div className="absolute bottom-4 left-4">
        <button className="text-lg hover:text-blue-500">More</button>
      </div>
    </div>
  );
};

export default Sidebar;
