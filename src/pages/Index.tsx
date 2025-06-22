
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import CreatePost from '@/components/CreatePost';
import CreatePostModal from '@/components/CreatePostModal';
import FeedPost from '@/components/FeedPost';
import Stories from '@/components/Stories';
import { usePosts } from '@/hooks/usePosts';
import { useState } from 'react';

const Index = () => {
  const { user, loading } = useAuth();
  const { posts, loading: postsLoading, toggleLike, addComment, refetch } = usePosts();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 pt-20 pb-20 md:pb-4">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Stories />
          <CreatePost onCreateClick={() => setShowCreateModal(true)} />
          
          {postsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <FeedPost
                  key={post.id}
                  id={post.id}
                  username={post.profiles.username}
                  userAvatar={post.profiles.avatar_url}
                  image={post.image_url}
                  caption={post.caption}
                  likes={post.likes}
                  comments={post.comments}
                  timeAgo={post.created_at}
                  onLike={toggleLike}
                  onComment={addComment}
                />
              ))}
              
              {posts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No posts yet</p>
                  <p className="text-gray-400 text-sm mt-2">Start following users or create your first post!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
      
      <CreatePostModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onPostCreated={refetch}
      />
    </div>
  );
};

export default Index;
