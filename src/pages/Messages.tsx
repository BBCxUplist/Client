import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import ChatList from '@/components/messages/ChatList';
import ChatWindow from '@/components/messages/ChatWindow';
import { useStore } from '@/stores/store';
import { useChatStore } from '@/stores/chatStore';
import {
  useConversations,
  useMarkAsRead,
  CHAT_QUERY_KEYS,
} from '@/hooks/useChat';
import { useChatWebSocket } from '@/hooks/useChatWebSocket';
import { useUpdateBooking } from '@/hooks/booking/useUpdateBooking';
import type { Message, QuoteData } from '@/types/chat';

const Messages = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { mutate: updateBooking } = useUpdateBooking();
  const { mutate: markAsRead } = useMarkAsRead();

  // Chat store
  const {
    addMessage,
    setTypingUser,
    setConnectionStatus,
    updateConversation,
    incrementUnreadCount,
    selectedConversationId,
    setSelectedConversation,
    typingUsers,
  } = useChatStore();

  const [isMobileView, setIsMobileView] = useState(false);

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
      // Add message to chat store
      addMessage(message.conversationId, message);

      // Increment unread count if not the current conversation or not from current user
      if (
        message.conversationId !== selectedConversationId &&
        message.senderId !== user?.id
      ) {
        incrementUnreadCount(message.conversationId);
      }

      // Update conversation's last message
      updateConversation(message.conversationId, {
        lastMessage:
          message.messageType === 'quote'
            ? `📋 Quote - $${message.quoteData?.proposedPrice || 0}`
            : message.text || '',
        lastMessageTime: message.createdAt,
      });

      // Update message history cache for React Query
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.messageHistory(message.conversationId),
        (oldData: any) => {
          if (!oldData) {
            return { items: [message], hasMore: false };
          }

          // Check if message already exists by ID
          const existsById = oldData.items.some(
            (m: Message) => m.id === message.id
          );
          if (existsById) {
            return oldData;
          }

          // Check if this is a server response for our optimistic message
          const optimisticIndex = oldData.items.findIndex((m: Message) => {
            const isTemp = m.id.startsWith('temp-');
            const sameSender = m.senderId === message.senderId;
            const sameText = m.text === message.text;
            const recentTime =
              Math.abs(
                new Date(m.createdAt).getTime() -
                  new Date(message.createdAt).getTime()
              ) < 10000;
            return isTemp && sameSender && sameText && recentTime;
          });

          if (optimisticIndex !== -1) {
            const newItems = [...oldData.items];
            newItems[optimisticIndex] = message;
            return {
              ...oldData,
              items: newItems,
            };
          }

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
    onTyping: (conversationId, visitorId, isTyping) => {
      setTypingUser(conversationId, visitorId, isTyping);
    },
    onError: (error, code) => {
      console.error('[Chat] Error:', { error, code });
    },
  });

  const selectedConversation = conversationsData?.conversations.find(
    conv => conv.id === selectedConversationId
  );

  // Update connection status in store
  useEffect(() => {
    setConnectionStatus(isConnected);
  }, [isConnected, setConnectionStatus]);

  // Join conversation when selected
  useEffect(() => {
    if (selectedConversationId && isConnected) {
      joinConversation(selectedConversationId);
      markAsRead(selectedConversationId);

      return () => {
        leaveConversation(selectedConversationId);
      };
    }
  }, [
    selectedConversationId,
    isConnected,
    joinConversation,
    leaveConversation,
    markAsRead,
  ]);

  const handleChatSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setIsMobileView(true);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId || !content.trim() || !user) {
      return;
    }

    // Create optimistic message
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConversationId,
      senderId: user.id,
      receiverId: selectedConversation?.participantId || '',
      messageType: 'regular',
      text: content.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
      senderName: user.name || user.displayName || '',
      senderAvatar: user.avatar || '',
    };

    // Add to chat store
    addMessage(selectedConversationId, optimisticMessage);

    // Immediately add to React Query cache (optimistic update)
    queryClient.setQueryData(
      CHAT_QUERY_KEYS.messageHistory(selectedConversationId),
      (oldData: any) => {
        if (!oldData) return { items: [optimisticMessage], hasMore: false };
        return {
          ...oldData,
          items: [...oldData.items, optimisticMessage],
        };
      }
    );

    // Send to server
    sendMessage(selectedConversationId, content.trim());

    // Update conversation's last message immediately (optimistic)
    updateConversation(selectedConversationId, {
      lastMessage: content.trim(),
      lastMessageTime: new Date().toISOString(),
    });

    // Refetch conversations to update lastMessage after a short delay
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.conversations(user.id),
      });
    }, 500);
  };

  const handleSendQuote = (quoteData: QuoteData, text?: string) => {
    if (!selectedConversationId) {
      return;
    }

    // First, update the booking if bookingId is present
    if (quoteData.bookingId) {
      // Prepare booking update data from quote
      const bookingUpdateData = {
        eventDate: quoteData.eventDate,
        eventType: quoteData.eventType,
        duration: quoteData.duration,
        expectedGuests: quoteData.expectedGuests,
        eventLocation: quoteData.eventLocation,
        specialRequirements: quoteData.notes,
      };

      // Call the hook to update the booking
      updateBooking(
        {
          bookingId: quoteData.bookingId,
          payload: bookingUpdateData,
        },
        {
          onError: error => {
            console.error('[Chat] Failed to update booking:', error);
          },
        }
      );
    }

    // Send the quote message
    sendQuote(selectedConversationId, quoteData, text);
  };

  const handleTyping = (isTyping: boolean) => {
    if (!selectedConversationId) return;
    sendTypingIndicator(selectedConversationId, isTyping);
  };

  const handleBackToList = () => {
    setIsMobileView(false);
    setSelectedConversation(null);
  };

  // Handle navigation from booking modal or other sources
  useEffect(() => {
    const state = location.state as {
      conversationId?: string;
      openChat?: boolean;
    } | null;

    if (state?.conversationId && state?.openChat) {
      setSelectedConversation(state.conversationId);
      setIsMobileView(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate, setSelectedConversation]);

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
                !!typingUsers[selectedConversation.id]?.[
                  selectedConversation.participantId
                ]
              }
              isConnected={isConnected}
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
