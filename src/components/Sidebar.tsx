
import { Camera, Heart, Search, User, Upload, Bell, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const menuItems = [
    { icon: Camera, label: 'Home', active: true },
    { icon: Search, label: 'Search' },
    { icon: Upload, label: 'Create' },
    { icon: Heart, label: 'Activity', hasNotification: true },
    { icon: MessageSquare, label: 'Messages' },
    { icon: Bell, label: 'Notifications', hasNotification: true },
    { icon: User, label: 'Profile' },
  ];

  return (
    <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 pt-20">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start text-left relative"
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
              {item.hasNotification && (
                <span className="absolute right-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              )}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
