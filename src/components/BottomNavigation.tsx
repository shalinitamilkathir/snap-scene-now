
import { Camera, Heart, Search, User, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BottomNavigation = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 p-3">
          <Camera className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 p-3">
          <Search className="w-6 h-6" />
          <span className="text-xs">Search</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 p-3">
          <Upload className="w-6 h-6" />
          <span className="text-xs">Create</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 p-3 relative">
          <Heart className="w-6 h-6" />
          <span className="text-xs">Activity</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 p-3">
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </div>
  );
};

export default BottomNavigation;
