import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { useStore } from '@/stores/store';

export const CHAT_QUERY_KEYS = {
  conversations: (userId: string) => ['conversations', userId],
  messageHistory: (conversationId: string) => ['messages', conversationId],
};

// Hook to get all conversations
export const useConversations = () => {
  const { user } = useStore();

  return useQuery({
    queryKey: CHAT_QUERY_KEYS.conversations(user?.id || ''),
    queryFn: () => chatService.getConversations(user!.id),
    enabled: !!user?.id,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Hook to get message history
export const useMessageHistory = (conversationId: string | null) => {
  const { user } = useStore();

  return useQuery({
    queryKey: CHAT_QUERY_KEYS.messageHistory(conversationId || ''),
    queryFn: () =>
      chatService.getMessageHistory(user!.id, conversationId!, undefined, 50),
    enabled: !!user?.id && !!conversationId,
    staleTime: 5 * 1000, // 5 seconds
  });
};

// Hook to start a conversation
export const useStartConversation = () => {
  const { user } = useStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (peerId: string) =>
      chatService.startConversation(user!.id, peerId),
    onSuccess: () => {
      // Invalidate conversations to refetch the list
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.conversations(user!.id),
      });
    },
  });
};

// Hook to load more messages (pagination)
export const useLoadMoreMessages = (conversationId: string) => {
  const { user } = useStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ before, limit }: { before: string; limit?: number }) =>
      chatService.getMessageHistory(user!.id, conversationId, before, limit),
    onSuccess: newData => {
      // Merge new messages with existing ones
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
  });
};
