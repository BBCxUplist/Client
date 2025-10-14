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

export const chatService = {
  // Start a new conversation
  startConversation: async (meId: string, peerId: string) => {
    const response = await apiClient.post<StartConversationResponse>(
      `/messages/start?meId=${meId}`,
      { peerId }
    );
    return response.data;
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

    const response = await apiClient.get<MessageHistoryResponse>(
      `/messages/history?${params.toString()}`
    );
    return response.data;
  },

  // Get user conversations
  getConversations: async (meId: string) => {
    const response = await apiClient.get<ConversationsResponse>(
      `/messages/conversations?meId=${meId}`
    );
    return response.data;
  },

  // Get messages by conversation (alternative endpoint)
  getMessagesByConversation: async (
    conversationId: string,
    limit: number = 50
  ) => {
    const response = await apiClient.get(
      `/chats/${conversationId}/messages?limit=${limit}`
    );
    return response.data;
  },
};
