import { apiClient } from '@/lib/apiClient';
import type { Conversation, Message } from '@/types/chat';

interface StartConversationResponse {
  conversation: {
    id: string;
    createdAt: string;
  };
}

interface MessageHistoryResponse {
  conversationId: string;
  items: Message[];
  nextBefore: string;
  hasMore: boolean;
}

interface ConversationsResponse {
  conversations: Conversation[];
}

interface MarkAsReadResponse {
  markedCount: number;
}

interface UnreadCountsResponse {
  counts: Record<string, number>;
  total: number;
}

export const chatService = {
  // Start a new conversation
  startConversation: async (meId: string, peerId: string) => {
    try {
      const response = await apiClient.post<StartConversationResponse>(
        `/messages/start?meId=${meId}`,
        { peerId }
      );
      return response.data;
    } catch (error) {
      console.error('[ChatService] Failed to start conversation:', error);
      throw error;
    }
  },

  // Get message history
  getMessageHistory: async (
    meId: string,
    conversationId: string,
    before?: string,
    limit: number = 30
  ) => {
    const params = new URLSearchParams({
      meId,
      conversationId,
      limit: limit.toString(),
    });

    if (before) {
      params.append('before', before);
    }

    try {
      const response = await apiClient.get<MessageHistoryResponse>(
        `/messages/history?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('[ChatService] Failed to fetch message history:', error);
      throw error;
    }
  },

  // Get user conversations
  getConversations: async (meId: string) => {
    try {
      const response = await apiClient.get<ConversationsResponse>(
        `/messages/conversations?meId=${meId}`
      );
      return response.data;
    } catch (error) {
      console.error('[ChatService] Failed to fetch conversations:', error);
      throw error;
    }
  },

  // Mark messages as read in a conversation
  markAsRead: async (meId: string, conversationId: string) => {
    try {
      const response = await apiClient.post(
        `/messages/read?meId=${meId}&conversationId=${conversationId}`
      );
      return response.data;
    } catch {
      // Don't throw error if endpoint doesn't exist - it's optional
      return null;
    }
  },

  // Mark specific messages as read (batch)
  markMessagesAsRead: async (
    meId: string,
    conversationId: string,
    messageIds: string[]
  ): Promise<MarkAsReadResponse | null> => {
    try {
      const response = await apiClient.patch<MarkAsReadResponse>(
        `/messages/mark-read?meId=${meId}`,
        { conversationId, messageIds }
      );
      return response.data;
    } catch {
      // Don't throw error if endpoint doesn't exist
      return null;
    }
  },

  // Get unread counts for all conversations
  getUnreadCounts: async (
    meId: string
  ): Promise<UnreadCountsResponse | null> => {
    try {
      const response = await apiClient.get<UnreadCountsResponse>(
        `/messages/unread-counts?meId=${meId}`
      );
      return response.data;
    } catch {
      // Don't throw error if endpoint doesn't exist
      return null;
    }
  },
};
