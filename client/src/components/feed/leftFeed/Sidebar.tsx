import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { logout as logoutSlice } from "@/redux/slices/authSlice";
import CreatePost from "./CreatePost";
import { removeAllPosts } from "@/redux/slices/allPostSlice";
import { removeSuggestedUsers } from "@/redux/slices/suggestedUsersSlice";
import { clearSocket } from "@/redux/slices/socketSlice";
import { clearChat } from "@/redux/slices/chatSlice";
import { logout as logoutApi } from '@/api/user.api';
import toast from "react-hot-toast";
import { GiMoebiusTriangle } from "react-icons/gi";
import { 
  Home,
  Search,
  Compass,
  Film,
  MessageSquare,
  Heart,
  PlusSquare,
  LogOut,
  MoreHorizontal,
  BadgeCheck
} from "lucide-react";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const { users } = useSelector((state: RootState) => state.suggestedUsers);

  const sidebarItems = [
    { icon: Home, text: "Home", path: '/feed' },
    { icon: Search, text: "Search", path: '/feed' },
    { icon: Compass, text: "Explore", path: '/feed', action: () => navigate('/explore/people', { state: { users } }) },
    { icon: Film, text: "Reels", path: '/feed' },
    { icon: MessageSquare, text: "Messages", path: '/chat' },
    { icon: Heart, text: "Notifications", path: '/feed' },
    { icon: PlusSquare, text: "Create", action: () => setOpen(true) },
    {
      icon: BadgeCheck,
      text: "Get Premium",
      path: '/premium',
      isPremium: true,
    },
  ];

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
    <div className="w-64 h-screen bg-white border-r flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="px-2 flex items-center">
        <GiMoebiusTriangle className="text-2xl mr-2" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            TcharGram
          </h1>
        </div>

        <nav className="space-y-1">
        {sidebarItems.map(({ icon: Icon, text, path, action, isPremium }) => (
          <Button
            key={text}
            variant="ghost"
            className={`w-full justify-start gap-4 px-2 h-12 ${
              isPremium 
                ? "bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-purple-700"
                : ""
            }`}
            onClick={() => action ? action() : navigate(path!)}
          >
            <Icon className={`h-5 w-5 ${isPremium ? "text-purple-500" : ""}`} />
            <span>{text}</span>
            {isPremium && <span className="ml-auto text-xs font-semibold text-purple-500">New</span>}
          </Button>
        ))}

          <Button
            variant="ghost"
            className="w-full justify-start gap-4 px-2 h-12"
            onClick={() => navigate(`/profile/${user?._id}`)}
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>Profile</span>
          </Button>
        </nav>
      </div>

      <div className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 px-2 h-12 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={logOutHandler}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 px-2 h-12"
        >
          <MoreHorizontal className="h-5 w-5" />
          <span>More</span>
        </Button>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default Sidebar;