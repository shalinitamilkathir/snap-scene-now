
import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { threads, messages, createThread, sendMessage, fetchMessages } = useChat();
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartChat = async () => {
    const { data, error } = await createThread('Customer Support');
    if (error) {
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive"
      });
    } else if (data) {
      setCurrentThreadId(data.id);
      await fetchMessages(data.id);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentThreadId) return;

    const { error } = await sendMessage(currentThreadId, newMessage);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } else {
      setNewMessage('');
      await fetchMessages(currentThreadId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 h-96 shadow-lg border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-pink-500" />
              Chat with Florist
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {!currentThreadId && threads.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Start a conversation with our florists</p>
              <Button onClick={handleStartChat} className="bg-pink-500 hover:bg-pink-600">
                Start Chat
              </Button>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender_id === user?.id
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </CardContent>

        {currentThreadId && (
          <CardFooter className="p-4 pt-0">
            <div className="flex gap-2 w-full">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
                className="bg-pink-500 hover:bg-pink-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ChatWindow;
