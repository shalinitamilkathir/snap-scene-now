
import React, { useState } from 'react';
import { Heart, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface FeedPostProps {
  id: string;
  username: string;
  userAvatar?: string | null;
  image: string;
  caption?: string | null;
  likes: { user_id: string }[];
  comments: {
    id: string;
    content: string;
    created_at: string;
    profiles: {
      username: string;
    };
  }[];
  timeAgo: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

const FeedPost = ({ 
  id, 
  username, 
  userAvatar, 
  image, 
  caption, 
  likes, 
  comments, 
  timeAgo, 
  onLike, 
  onComment 
}: FeedPostProps) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();

  const isLiked = user ? likes.some(like => like.user_id === user.id) : false;
  const likesCount = likes.length;
  const commentsCount = comments.length;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(id, commentText.trim());
      setCommentText('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition-all duration-300 hover:shadow-md">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={userAvatar || undefined} alt={username} />
            <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm">
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-gray-900">{username}</p>
            <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(timeAgo), { addSuffix: true })}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <span className="text-gray-400">•••</span>
        </Button>
      </div>

      {/* Post Image */}
      <div className="relative aspect-square">
        <img
          src={image}
          alt="Post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto"
              onClick={() => onLike(id)}
            >
              <Heart 
                className={`w-6 h-6 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 hover:text-red-500'}`} 
              />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="w-6 h-6 text-gray-700 hover:text-blue-500 transition-colors" />
            </Button>
          </div>
        </div>

        {/* Likes Count */}
        {likesCount > 0 && (
          <p className="font-semibold text-sm text-gray-900 mb-2">
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </p>
        )}

        {/* Caption */}
        {caption && (
          <div className="text-sm text-gray-900 mb-2">
            <span className="font-semibold mr-2">{username}</span>
            <span>{caption}</span>
          </div>
        )}

        {/* Comments Preview */}
        {commentsCount > 0 && !showComments && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-auto text-gray-500 text-sm hover:text-gray-700 mb-2"
            onClick={() => setShowComments(true)}
          >
            View all {commentsCount} comments
          </Button>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-2 mb-3">
            {comments.map((comment) => (
              <div key={comment.id} className="text-sm">
                <span className="font-semibold mr-2">{comment.profiles.username}</span>
                <span className="text-gray-900">{comment.content}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        {user && (
          <form onSubmit={handleAddComment} className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 border-none bg-transparent text-sm focus:ring-0 p-0"
            />
            {commentText.trim() && (
              <Button type="submit" variant="ghost" size="sm" className="text-blue-500 font-semibold">
                Post
              </Button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedPost;
