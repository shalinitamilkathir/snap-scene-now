
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Post {
  id: string;
  user_id: string;
  caption: string | null;
  image_url: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  likes: { user_id: string }[];
  comments: {
    id: string;
    content: string;
    created_at: string;
    profiles: {
      username: string;
    };
  }[];
  _count: {
    likes: number;
    comments: number;
  };
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      // First get posts with basic info
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      if (!postsData) {
        setPosts([]);
        return;
      }

      // Get all unique user IDs from posts
      const userIds = [...new Set(postsData.map(post => post.user_id))];

      // Fetch profiles for all users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Fetch likes for all posts
      const { data: likesData, error: likesError } = await supabase
        .from('likes')
        .select('post_id, user_id')
        .in('post_id', postsData.map(post => post.id));

      if (likesError) throw likesError;

      // Fetch comments with profiles for all posts
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          post_id,
          user_id
        `)
        .in('post_id', postsData.map(post => post.id))
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Get profiles for comment authors
      const commentUserIds = [...new Set(commentsData?.map(comment => comment.user_id) || [])];
      const { data: commentProfilesData } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', commentUserIds);

      // Create lookup maps
      const profilesMap = new Map(profilesData?.map(profile => [profile.id, profile]) || []);
      const likesMap = new Map<string, any[]>();
      const commentsMap = new Map<string, any[]>();
      const commentProfilesMap = new Map(commentProfilesData?.map(profile => [profile.id, profile]) || []);

      // Group likes by post_id
      likesData?.forEach(like => {
        if (!likesMap.has(like.post_id)) {
          likesMap.set(like.post_id, []);
        }
        likesMap.get(like.post_id)?.push(like);
      });

      // Group comments by post_id and add profile info
      commentsData?.forEach(comment => {
        if (!commentsMap.has(comment.post_id)) {
          commentsMap.set(comment.post_id, []);
        }
        const commentWithProfile = {
          ...comment,
          profiles: commentProfilesMap.get(comment.user_id) || { username: 'Unknown' }
        };
        commentsMap.get(comment.post_id)?.push(commentWithProfile);
      });

      // Combine all data
      const postsWithData = postsData.map(post => {
        const profile = profilesMap.get(post.user_id);
        const likes = likesMap.get(post.id) || [];
        const comments = commentsMap.get(post.id) || [];

        return {
          ...post,
          profiles: {
            username: profile?.username || 'Unknown',
            avatar_url: profile?.avatar_url || null
          },
          likes,
          comments,
          _count: {
            likes: likes.length,
            comments: comments.length
          }
        };
      });

      setPosts(postsWithData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (imageUrl: string, caption?: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          caption: caption || null
        });

      if (error) throw error;
      
      await fetchPosts(); // Refresh posts
      return { error: null };
    } catch (error) {
      console.error('Error creating post:', error);
      return { error };
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
      }

      await fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content
        });

      if (error) throw error;
      
      await fetchPosts(); // Refresh posts
      return { error: null };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    addComment,
    refetch: fetchPosts
  };
};
