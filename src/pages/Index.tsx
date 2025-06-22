
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Stories from '@/components/Stories';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import ProfileSection from '@/components/ProfileSection';
import BottomNavigation from '@/components/BottomNavigation';

const Index = () => {
  const posts = [
    {
      id: '1',
      username: 'alex_photos',
      userAvatar: 'photo-1488590528505-98d2b5aba04b',
      image: 'photo-1526374965328-7f61d4dc18c5',
      caption: 'Beautiful sunset from my weekend getaway! 🌅 #photography #nature #sunset',
      likes: 1247,
      comments: 89,
      timeAgo: '2 hours ago',
      isLiked: true,
    },
    {
      id: '2',
      username: 'sarah_travels',
      userAvatar: 'photo-1581091226825-a6a2a5aee158',
      image: 'photo-1500673922987-e212871fec22',
      caption: 'Exploring hidden gems in the mountains ⛰️ Nature never fails to amaze me!',
      likes: 892,
      comments: 45,
      timeAgo: '4 hours ago',
    },
    {
      id: '3',
      username: 'mike_fitness',
      userAvatar: 'photo-1649972904349-6e44c42644a7',
      image: 'photo-1582562124811-c09040d0a901',
      caption: 'Morning yoga session with my furry friend 🐱 #yoga #mindfulness #cats',
      likes: 634,
      comments: 23,
      timeAgo: '6 hours ago',
      isLiked: true,
    },
    {
      id: '4',
      username: 'emma_art',
      userAvatar: 'photo-1721322800607-8c38375eef04',
      image: 'photo-1721322800607-8c38375eef04',
      caption: 'New living room setup! Finally got everything the way I wanted it ✨ #interior #design #home',
      likes: 1156,
      comments: 67,
      timeAgo: '8 hours ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <BottomNavigation />
      
      <div className="lg:ml-64">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2">
              <Stories />
              <CreatePost />
              
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="hidden lg:block">
              <ProfileSection />
              
              {/* Suggested Users */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Suggested for you</h3>
                  <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                    See All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { username: 'tom_designer', name: 'Tom Wilson', avatar: 'photo-1488590528505-98d2b5aba04b' },
                    { username: 'lisa_chef', name: 'Lisa Chen', avatar: 'photo-1581091226825-a6a2a5aee158' },
                    { username: 'david_music', name: 'David Park', avatar: 'photo-1526374965328-7f61d4dc18c5' },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                          <img
                            src={`https://images.unsplash.com/${user.avatar}?auto=format&fit=crop&w=150&q=80`}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.name}</p>
                        </div>
                      </div>
                      <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile padding for bottom nav */}
      <div className="md:hidden h-20" />
    </div>
  );
};

export default Index;
