import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import ChatList from '@/components/messages/ChatList';
import ChatWindow from '@/components/messages/ChatWindow';
import { useStore } from '@/stores/store';
import { useConversations, CHAT_QUERY_KEYS } from '@/hooks/useChat';
import { useChatWebSocket } from '@/hooks/useChatWebSocket';
import type { Message, QuoteData } from '@/types/chat';

const Messages = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  // Fetch conversations
  const { data: conversationsData, isLoading } = useConversations();

  // WebSocket connection
  const {
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTypingIndicator,
    sendQuote,
  } = useChatWebSocket({
    onMessage: (message: Message) => {
      // Update message history cache
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.messageHistory(message.conversationId),
        (oldData: any) => {
          if (!oldData) return { items: [message], hasMore: false };

          // Check if message already exists
          const exists = oldData.items.some(
            (m: Message) => m.id === message.id
          );
          if (exists) return oldData;

          return {
            ...oldData,
            items: [...oldData.items, message],
          };
        }
      );

      // Update conversations list
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.conversations(user!.id),
      });
    },
    onTyping: (conversationId, userId, isTyping) => {
      setTypingUsers(prev => ({
        ...prev,
        [`${conversationId}-${userId}`]: isTyping,
      }));

      // Clear typing indicator after 3 seconds
      if (isTyping) {
        setTimeout(() => {
          setTypingUsers(prev => ({
            ...prev,
            [`${conversationId}-${userId}`]: false,
          }));
        }, 3000);
      }
    },
    onError: (error, code) => {
      console.error('Chat error:', error, code);
      // You can show a toast notification here
    },
  });

  const selectedConversation = conversationsData?.conversations.find(
    conv => conv.id === selectedConversationId
  );

  // Join conversation when selected
  useEffect(() => {
    if (selectedConversationId && isConnected) {
      joinConversation(selectedConversationId);

      return () => {
        leaveConversation(selectedConversationId);
      };
    }
  }, [
    selectedConversationId,
    isConnected,
    joinConversation,
    leaveConversation,
  ]);

  const handleChatSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsMobileView(true);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId || !content.trim()) return;

    sendMessage(selectedConversationId, content.trim());
  };

  const handleSendQuote = (quoteData: QuoteData, text?: string) => {
    if (!selectedConversationId) return;

    sendQuote(selectedConversationId, quoteData, text);
  };

  const handleTyping = (isTyping: boolean) => {
    if (!selectedConversationId) return;
    sendTypingIndicator(selectedConversationId, isTyping);
  };

  const handleBackToList = () => {
    setIsMobileView(false);
    setSelectedConversationId(null);
  };

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Component will redirect, so return null
  }

  return (
    <div className='min-h-screen bg-neutral-950 '>
      <Navbar />

      <div className='h-[calc(100vh-80px)] flex'>
        {/* Chat List */}
        <div
          className={`${isMobileView ? 'hidden' : 'block'} lg:block w-full lg:w-1/3 xl:w-1/4 border-r border-white/10`}
        >
          <ChatList
            conversations={conversationsData?.conversations || []}
            selectedConversationId={selectedConversationId}
            onChatSelect={handleChatSelect}
            isLoading={isLoading}
            isConnected={isConnected}
          />
        </div>

        {/* Chat Window */}
        <div
          className={`${!selectedConversationId ? 'hidden' : 'block'} lg:block flex-1`}
        >
          {selectedConversation ? (
            <ChatWindow
              conversationId={selectedConversation.id}
              conversation={selectedConversation}
              currentUser={
                user as {
                  id: string;
                  name: string;
                  avatar?: string;
                  role?: string;
                }
              }
              onSendMessage={handleSendMessage}
              onSendQuote={handleSendQuote}
              onTyping={handleTyping}
              onBack={handleBackToList}
              showBackButton={isMobileView}
              isTyping={
                typingUsers[
                  `${selectedConversation.id}-${selectedConversation.participantId}`
                ] || false
              }
            />
          ) : (
            <div className='hidden lg:flex h-full items-center justify-center texture-bg'>
              <div className='text-center'>
                <div className='w-24 h-24 mx-auto mb-6 bg-white/5 border border-white/10 flex items-center justify-center'>
                  <MessageCircle className='w-12 h-12 text-white/30' />
                </div>
                <h3 className='text-xl font-semibold text-white mb-2 font-mondwest'>
                  Select a conversation
                </h3>
                <p className='text-white/60 text-sm'>
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
