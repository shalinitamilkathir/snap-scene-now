
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Stories = () => {
  const stories = [
    { id: 1, username: 'Your Story', avatar: 'photo-1649972904349-6e44c42644a7', isOwn: true },
    { id: 2, username: 'alex_photos', avatar: 'photo-1488590528505-98d2b5aba04b' },
    { id: 3, username: 'sarah_travels', avatar: 'photo-1581091226825-a6a2a5aee158' },
    { id: 4, username: 'mike_fitness', avatar: 'photo-1526374965328-7f61d4dc18c5' },
    { id: 5, username: 'emma_art', avatar: 'photo-1500673922987-e212871fec22' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-2 min-w-0">
            <div className={`p-0.5 rounded-full ${story.isOwn ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'}`}>
              <Avatar className="w-14 h-14 border-2 border-white">
                <AvatarImage 
                  src={`https://images.unsplash.com/${story.avatar}?auto=format&fit=crop&w=150&q=80`} 
                  alt={story.username}
                />
                <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                  {story.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-gray-600 text-center truncate w-16">
              {story.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
