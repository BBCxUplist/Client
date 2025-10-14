// Chat Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  senderName: string;
  senderAvatar: string;
}

export interface Conversation {
  id: string;
  createdAt: string;
  participantName: string;
  participantAvatar: string;
  participantId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
}

export interface WebSocketMessage {
  type:
    | 'connected'
    | 'joined'
    | 'left'
    | 'message'
    | 'message_ack'
    | 'typing'
    | 'error';
  userId?: string;
  conversationId?: string;
  messageId?: string;
  message?: Message;
  isTyping?: boolean;
  error?: string;
  code?: string;
}

export interface SendMessagePayload {
  type: 'join' | 'leave' | 'message' | 'typing';
  conversationId: string;
  text?: string;
  metadata?: Record<string, any>;
  isTyping?: boolean;
}
