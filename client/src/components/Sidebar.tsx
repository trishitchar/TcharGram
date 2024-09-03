import React from "react";
import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { BsFillCameraReelsFill } from "react-icons/bs";
import { TbMessageFilled } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const Sidebar: React.FC = () =>{
    return <div className="flex flex-col border-2 h-screen w-1/5 border-red-600">
     <div className="flex flex-row"><GoHomeFill /> Home</div>
     <div className="flex flex-row"><IoSearch/>Search</div>
     <div className="flex flex-row"><MdOutlineExplore/>explore</div>
     <div className="flex flex-row"><BsFillCameraReelsFill/>Reels</div>
     <div className="flex flex-row"><TbMessageFilled/>Messages</div>
     <div className="flex flex-row"><FaRegHeart/>Notification</div>
     <div className="flex flex-row"><IoCreateOutline/>create</div>
     <div className="flex flex-row"><CgProfile/>Profile</div>
    </div>
}

export default Sidebar;