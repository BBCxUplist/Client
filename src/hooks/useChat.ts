import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { useStore } from '@/stores/store';
import { useChatStore } from '@/stores/chatStore';

export const CHAT_QUERY_KEYS = {
  conversations: (userId: string) => ['conversations', userId],
  messageHistory: (conversationId: string) => ['messages', conversationId],
};

// Hook to get all conversations
export const useConversations = () => {
  const { user } = useStore();
  const { setConversations, conversations: cachedConversations } =
    useChatStore();

  return useQuery({
    queryKey: CHAT_QUERY_KEYS.conversations(user?.id || ''),
    queryFn: async () => {
      const result = await chatService.getConversations(user!.id);

      // Update the chat store
      if (result?.conversations) {
        setConversations(result.conversations);
      }

      return result;
    },
    enabled: !!user?.id,
    staleTime: 10 * 1000, // 10 seconds - more responsive
    refetchInterval: 15 * 1000, // Refetch every 15 seconds for faster updates
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
    placeholderData:
      cachedConversations.length > 0
        ? {
            conversations: cachedConversations,
          }
        : undefined,
  });
};

// Hook to get message history
export const useMessageHistory = (conversationId: string | null) => {
  const { user } = useStore();
  const { setMessages, getMessages } = useChatStore();

  const cachedMessages = conversationId ? getMessages(conversationId) : [];

  return useQuery({
    queryKey: CHAT_QUERY_KEYS.messageHistory(conversationId || ''),
    queryFn: async () => {
      const result = await chatService.getMessageHistory(
        user!.id,
        conversationId!,
        undefined,
        50
      );

      // Preserve isRead status from cache - if we marked something as read locally, keep it
      // Update the chat store with API data (trust API for isRead status)
      if (result?.items && conversationId) {
        setMessages(conversationId, result.items);
      }

      return result;
    },
    enabled: !!user?.id && !!conversationId,
    staleTime: 5 * 1000, // 5 seconds
    placeholderData:
      cachedMessages.length > 0 && conversationId
        ? {
            items: cachedMessages,
            hasMore: true,
            conversationId,
            nextBefore: '',
          }
        : undefined,
  });
};

// Hook to start a conversation
export const useStartConversation = () => {
  const { user } = useStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (peerId: string) => {
      return chatService.startConversation(user!.id, peerId);
    },
    onSuccess: () => {
      // Invalidate conversations to refetch the list
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.conversations(user!.id),
      });
    },
    onError: error => {
      console.error(
        '[useStartConversation] Failed to start conversation:',
        error
      );
    },
  });
};

// Hook to load more messages (pagination)
export const useLoadMoreMessages = (conversationId: string) => {
  const { user } = useStore();
  const queryClient = useQueryClient();
  const { prependMessages } = useChatStore();

  return useMutation({
    mutationFn: ({ before, limit }: { before: string; limit?: number }) => {
      return chatService.getMessageHistory(
        user!.id,
        conversationId,
        before,
        limit
      );
    },
    onSuccess: newData => {
      // Update chat store
      if (newData?.items) {
        prependMessages(conversationId, newData.items);
      }

      // Merge new messages with existing ones in query cache
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.messageHistory(conversationId),
        (oldData: any) => {
          if (!oldData) return newData;
          return {
            ...newData,
            items: [...newData.items, ...oldData.items],
          };
        }
      );
    },
    onError: error => {
      console.error(
        '[useLoadMoreMessages] Failed to load more messages:',
        error
      );
    },
  });
};

// Hook to mark messages as read
export const useMarkAsRead = () => {
  const { user } = useStore();
  const queryClient = useQueryClient();
  const { markConversationAsRead } = useChatStore();

  return useMutation({
    mutationFn: (conversationId: string) => {
      return chatService.markAsRead(user!.id, conversationId);
    },
    onSuccess: (_, conversationId) => {
      // Update chat store (only unread count, not isRead status)
      markConversationAsRead(conversationId);

      // Update the conversations list to reset unread count
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.conversations(user!.id),
        (oldData: any) => {
          if (!oldData?.conversations) return oldData;
          return {
            ...oldData,
            conversations: oldData.conversations.map((conv: any) =>
              conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
            ),
          };
        }
      );
      // Note: We don't update isRead on messages locally
      // isRead indicates if the RECEIVER has read, which is tracked by the backend
    },
    onError: error => {
      console.error('[useMarkAsRead] Failed to mark as read:', error);
    },
  });
};
