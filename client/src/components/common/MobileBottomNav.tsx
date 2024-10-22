import React from 'react';
import { Home, MessageSquare, PlusSquare, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import CreatePost from '../feed/leftFeed/CreatePost';

const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [createOpen, setCreateOpen] = React.useState(false);

  return (
    <div className="h-16 flex items-center justify-around px-4 bg-white border-t">
      <Button variant="ghost" size="icon" onClick={() => navigate('/feed')}>
        <Home className="h-6 w-6" />
      </Button>
      
      <Button variant="ghost" size="icon" onClick={() => navigate('/chat')}>
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      <Button variant="ghost" size="icon" onClick={() => setCreateOpen(true)}>
        <PlusSquare className="h-6 w-6" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200"
        onClick={() => navigate('/premium')}
      >
        <BadgeCheck className="h-6 w-6 text-purple-500" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate(`/profile/${user?._id}`)}
      >
        <Avatar className="h-6 w-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Button>
      
      <CreatePost open={createOpen} setOpen={setCreateOpen} />
    </div>
  );
};

export default MobileBottomNav;