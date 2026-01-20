import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '@/stores/store';
import { useChatStore } from '@/stores/chatStore';
import { useChatWebSocket } from '@/hooks/useChatWebSocket';
import { useConversations, CHAT_QUERY_KEYS } from '@/hooks/useChat';
import type { Message, Conversation } from '@/types/chat';

interface GlobalChatProviderProps {
  children: React.ReactNode;
}

/**
 * GlobalChatProvider - Maintains WebSocket connection at the app level
 * and handles global message notifications and unread counts
 */
const GlobalChatProvider = ({ children }: GlobalChatProviderProps) => {
  const { user, isAuthenticated } = useStore();
  const queryClient = useQueryClient();
  const currentConversationRef = useRef<string | null>(null);
  const originalTitleRef = useRef<string>(document.title);
  const joinedConversationsRef = useRef<Set<string>>(new Set());

  const {
    addMessage,
    setTypingUser,
    setConnectionStatus,
    updateConversation,
    incrementUnreadCount,
    markMessagesAsRead,
    selectedConversationId,
    getTotalUnreadCount,
    addJoinedConversation,
    removeJoinedConversation,
    isConversationJoined,
  } = useChatStore();

  // Keep track of current conversation for message handling
  useEffect(() => {
    currentConversationRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // Update document title with unread count
  useEffect(() => {
    const totalUnread = getTotalUnreadCount();
    if (totalUnread > 0) {
      document.title = `(${totalUnread}) ${originalTitleRef.current}`;
    } else {
      document.title = originalTitleRef.current;
    }
  }, [getTotalUnreadCount]);

  // Fetch conversations to get initial unread counts
  const { data: conversationsData } = useConversations();

  // Handle incoming messages
  const handleMessage = useCallback(
    (message: Message) => {
      // Add message to chat store
      addMessage(message.conversationId, message);

      // Increment unread count if not the current conversation and not from current user
      if (
        message.conversationId !== currentConversationRef.current &&
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
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: CHAT_QUERY_KEYS.conversations(user.id),
        });
      }
    },
    [
      user?.id,
      addMessage,
      incrementUnreadCount,
      updateConversation,
      queryClient,
    ]
  );

  // Handle typing indicators
  const handleTyping = useCallback(
    (conversationId: string, visitorId: string, isTyping: boolean) => {
      setTypingUser(conversationId, visitorId, isTyping);
    },
    [setTypingUser]
  );

  // Handle read receipts
  const handleMessagesRead = useCallback(
    (conversationId: string, messageIds: string[]) => {
      // Update message read status in store
      markMessagesAsRead(conversationId, messageIds);

      // Also update React Query cache
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.messageHistory(conversationId),
        (oldData: any) => {
          if (!oldData?.items) return oldData;
          const messageIdSet = new Set(messageIds);
          return {
            ...oldData,
            items: oldData.items.map((m: Message) =>
              messageIdSet.has(m.id) ? { ...m, isRead: true } : m
            ),
          };
        }
      );
    },
    [markMessagesAsRead, queryClient]
  );

  // Handle errors
  const handleError = useCallback((error: string, code?: string) => {
    console.error('[GlobalChat] Error:', { error, code });
  }, []);

  // Handle joined confirmation from server
  const handleJoined = useCallback(
    (conversationId: string) => {
      addJoinedConversation(conversationId);
    },
    [addJoinedConversation]
  );

  // Handle left confirmation from server
  const handleLeft = useCallback(
    (conversationId: string) => {
      removeJoinedConversation(conversationId);
    },
    [removeJoinedConversation]
  );

  // WebSocket connection - only connect if authenticated
  const { isConnected, joinConversation } = useChatWebSocket(
    isAuthenticated && user?.id
      ? {
          onMessage: handleMessage,
          onTyping: handleTyping,
          onMessagesRead: handleMessagesRead,
          onJoined: handleJoined,
          onLeft: handleLeft,
          onError: handleError,
        }
      : {}
  );

  // Join all conversations when connected
  useEffect(() => {
    if (!isConnected || !conversationsData?.conversations) return;

    // Join any new conversations that we haven't joined yet
    conversationsData.conversations.forEach((conv: Conversation) => {
      if (
        !isConversationJoined(conv.id) &&
        !joinedConversationsRef.current.has(conv.id)
      ) {
        joinConversation(conv.id);
        // Optimistically mark as joined immediately (server may not send confirmation)
        addJoinedConversation(conv.id);
        joinedConversationsRef.current.add(conv.id);
      }
    });
  }, [
    isConnected,
    conversationsData?.conversations,
    joinConversation,
    isConversationJoined,
    addJoinedConversation,
  ]);

  // Clear joined conversations when disconnected or logged out
  useEffect(() => {
    if (!isConnected || !isAuthenticated) {
      joinedConversationsRef.current.clear();
      // Also clear the store's joined conversations
      useChatStore.getState().clearJoinedConversations();
    }
  }, [isConnected, isAuthenticated]);

  // Update connection status in store
  useEffect(() => {
    setConnectionStatus(isConnected);
  }, [isConnected, setConnectionStatus]);

  return <>{children}</>;
};

export default GlobalChatProvider;
