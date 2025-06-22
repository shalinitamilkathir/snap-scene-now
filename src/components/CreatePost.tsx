
import { Camera, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CreatePost = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex items-center space-x-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&q=80" alt="Your profile" />
          <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
            JD
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <input
            type="text"
            placeholder="What's on your mind, Jane?"
            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Image className="w-5 h-5 text-green-500" />
          </Button>
          <Button variant="ghost" size="sm">
            <Camera className="w-5 h-5 text-blue-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
