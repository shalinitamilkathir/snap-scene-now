
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfileSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&q=80" alt="Your profile" />
          <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl">
            JD
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">jane_doe</h3>
          <p className="text-gray-600 text-sm">Jane Doe</p>
          <p className="text-gray-500 text-xs mt-1">Photography enthusiast 📸 • Coffee lover ☕</p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0">
          Edit Profile
        </Button>
      </div>
      
      <div className="flex justify-between text-center">
        <div>
          <p className="font-semibold text-lg text-gray-900">127</p>
          <p className="text-gray-500 text-sm">Posts</p>
        </div>
        <div>
          <p className="font-semibold text-lg text-gray-900">2.3K</p>
          <p className="text-gray-500 text-sm">Followers</p>
        </div>
        <div>
          <p className="font-semibold text-lg text-gray-900">892</p>
          <p className="text-gray-500 text-sm">Following</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
