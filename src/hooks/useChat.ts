
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatThread {
  id: string;
  customer_id: string;
  florist_id: string | null;
  subject: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  is_read: boolean | null;
  created_at: string;
  profiles: {
    username: string;
  };
}

export const useChat = () => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchThreads = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_threads')
        .select('*')
        .or(`customer_id.eq.${user.id},florist_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setThreads(data || []);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  const fetchMessages = async (threadId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (username)
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createThread = async (subject?: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('chat_threads')
        .insert({
          customer_id: user.id,
          subject: subject || 'New Chat'
        })
        .select()
        .single();

      if (error) throw error;
      await fetchThreads();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating thread:', error);
      return { error };
    }
  };

  const sendMessage = async (threadId: string, content: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          thread_id: threadId,
          sender_id: user.id,
          content
        });

      if (error) throw error;
      
      // Update thread's updated_at timestamp
      await supabase
        .from('chat_threads')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', threadId);

      return { error: null };
    } catch (error) {
      console.error('Error sending message:', error);
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchThreads();
    }
  }, [user]);

  // Set up real-time subscriptions for messages
  useEffect(() => {
    if (!user) return;

    const messagesSubscription = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Message change:', payload);
          // Refetch messages for current thread if needed
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [user]);

  return {
    threads,
    messages,
    loading,
    fetchThreads,
    fetchMessages,
    createThread,
    sendMessage
  };
};
