
import { Camera, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

interface CreatePostProps {
  onCreateClick: () => void;
}

const CreatePost = ({ onCreateClick }: CreatePostProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex items-center space-x-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={profile?.avatar_url || undefined} alt="Your profile" />
          <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
            {profile?.username?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <button
            onClick={onCreateClick}
            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-left text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:bg-gray-100 transition-colors"
          >
            What's on your mind, {profile?.username}?
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onCreateClick}>
            <Image className="w-5 h-5 text-green-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onCreateClick}>
            <Camera className="w-5 h-5 text-blue-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
