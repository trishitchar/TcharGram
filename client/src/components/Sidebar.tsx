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
    return (
        <div className="w-64 h-screen bg-white border-r">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-8">Instagram</h1>
          <nav>
            <ul className="space-y-4">
                <li className="flex flex-row"><GoHomeFill /> Home</li>
                <li className="flex flex-row"><IoSearch/>Search</li>
                <li className="flex flex-row"><MdOutlineExplore/>explore</li>
                <li className="flex flex-row"><BsFillCameraReelsFill/>Reels</li>
                <li className="flex flex-row"><TbMessageFilled/>Messages</li>
                <li className="flex flex-row"><FaRegHeart/>Notification</li>
                <li className="flex flex-row"><IoCreateOutline/>create</li>
                <li className="flex flex-row"><CgProfile/>Profile</li>
     </ul>
        </nav>
      </div>
      <div className="absolute bottom-4 left-4">
        <button className="text-lg">More</button>
      </div>
    </div>
  );
};


export default Sidebar;