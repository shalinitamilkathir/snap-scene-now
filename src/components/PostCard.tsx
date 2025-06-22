
import { Heart, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PostCardProps {
  id: string;
  username: string;
  userAvatar?: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isLiked?: boolean;
}

const PostCard = ({ username, userAvatar, image, caption, likes, comments, timeAgo, isLiked = false }: PostCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition-all duration-300 hover:shadow-md">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={userAvatar} alt={username} />
            <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm">
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-gray-900">{username}</p>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <span className="text-gray-400">•••</span>
        </Button>
      </div>

      {/* Post Image */}
      <div className="relative aspect-square">
        <img
          src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=800&q=80`}
          alt="Post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <Heart 
                className={`w-6 h-6 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 hover:text-red-500'}`} 
              />
            </Button>
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <MessageSquare className="w-6 h-6 text-gray-700 hover:text-blue-500 transition-colors" />
            </Button>
          </div>
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-sm text-gray-900 mb-2">
          {likes.toLocaleString()} likes
        </p>

        {/* Caption */}
        <div className="text-sm text-gray-900">
          <span className="font-semibold mr-2">{username}</span>
          <span>{caption}</span>
        </div>

        {/* Comments */}
        {comments > 0 && (
          <Button variant="ghost" size="sm" className="p-0 h-auto mt-2 text-gray-500 text-sm hover:text-gray-700">
            View all {comments} comments
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
