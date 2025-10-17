// Chat Types
export type MessageType = 'regular' | 'quote';

export interface QuoteData {
  eventType?: string;
  eventDate?: string; // ISO date string
  eventLocation?: string;
  duration?: number; // hours
  expectedGuests?: number;
  proposedPrice: number; // REQUIRED
  priceBreakdown?: {
    basePrice: number;
    additionalHours?: number;
    equipment?: number;
    travel?: number;
    other?: number;
  };
  notes?: string;
  validUntil?: string; // ISO date string
  bookingId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  messageType: MessageType;
  text: string | null;
  metadata?: Record<string, any>;
  quoteData?: QuoteData | null;
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
  type: 'join' | 'leave' | 'message' | 'typing' | 'quote';
  conversationId: string;
  text?: string;
  metadata?: Record<string, any>;
  isTyping?: boolean;
  quoteData?: QuoteData;
}
