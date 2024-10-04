import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { PostType } from '@/api/post.api';

interface ViewPostDetailsProps {
  post: PostType;
  isOpen: boolean;
  onClose: () => void;
}

const ViewPostDetails: React.FC<ViewPostDetailsProps> = ({ post, isOpen, onClose }) => {
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => setLiked(!liked);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement comment submission logic
    console.log('New comment:', newComment);
    setNewComment(''); // Reset comment input
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0">
        <div className="flex h-[600px]">
          {/* Left side - Image */}
          <div className="w-1/2 bg-black flex items-center justify-center">
            <img src={post.image} alt="Post" className="max-h-full max-w-full object-contain" />
          </div>
          
          {/* Right side - Details */}
          <div className="w-1/2 flex flex-col">
            {/* Header */}
            <div className="flex items-center p-4 border-b">
              <img src={post.author.profilePicture} alt={post.author.username} className="w-8 h-8 rounded-full mr-2" />
              <span className="font-semibold">{post.author.username}</span>
              <button className="ml-auto text-blue-500 font-semibold">Follow</button>
            </div>
            
            {/* Comments */}
            <div className="flex-grow overflow-y-auto p-4">
              <div className="mb-4">
                <span className="font-semibold mr-2">{post.author.username}</span>
                <span>{post.caption}</span>
              </div>
              {post.comments.map((comment:any) => (
                <div key={comment._id} className="mb-2">
                  <span className="font-semibold mr-2">{comment.author.username}</span>
                  <span>{comment.text}</span>
                </div>
              ))}
            </div>
            
            {/* Actions */}
            <div className="p-4 border-t">
              <div className="flex space-x-4 mb-2">
                <button onClick={handleLike}>
                  <Heart className={liked ? "text-red-500" : "text-gray-500"} />
                </button>
                <button><MessageCircle /></button>
                <button><Share2 /></button>
              </div>
              <p className="font-semibold mb-2">{post.likes.length} likes</p>
              <form onSubmit={handleCommentSubmit}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full border-none focus:ring-0"
                />
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPostDetails;
