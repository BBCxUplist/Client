import { useEffect, useCallback, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useStore } from '@/stores/store';
import type {
  WebSocketMessage,
  SendMessagePayload,
  Message,
  QuoteData,
} from '@/types/chat';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';

interface UseChatWebSocketProps {
  onMessage?: (message: Message) => void;
  onTyping?: (
    conversationId: string,
    userId: string,
    isTyping: boolean
  ) => void;
  onError?: (error: string, code?: string) => void;
}

export const useChatWebSocket = ({
  onMessage,
  onTyping,
  onError,
}: UseChatWebSocketProps = {}) => {
  const { user } = useStore();
  const currentConversationId = useRef<string | null>(null);

  // Construct WebSocket URL with user ID
  const socketUrl = user?.id ? `${WS_URL}?token=${user.id}` : null;

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      share: false,
    }
  );

  // Handle incoming messages
  useEffect(() => {
    if (lastJsonMessage) {
      const message = lastJsonMessage as WebSocketMessage;

      switch (message.type) {
        case 'connected':
          console.log('WebSocket connected:', message.userId);
          break;

        case 'message':
          if (message.message && onMessage) {
            onMessage(message.message);
          }
          break;

        case 'typing':
          if (
            message.conversationId &&
            message.userId !== undefined &&
            onTyping
          ) {
            onTyping(
              message.conversationId,
              message.userId,
              message.isTyping || false
            );
          }
          break;

        case 'error':
          if (onError) {
            onError(message.error || 'Unknown error', message.code);
          }
          console.error('WebSocket error:', message.error, message.code);
          break;

        case 'joined':
          console.log('Joined conversation:', message.conversationId);
          break;

        case 'left':
          console.log('Left conversation:', message.conversationId);
          break;

        case 'message_ack':
          console.log('Message sent:', message.messageId);
          break;
      }
    }
  }, [lastJsonMessage, onMessage, onTyping, onError]);

  // Join a conversation
  const joinConversation = useCallback(
    (conversationId: string) => {
      if (readyState === ReadyState.OPEN) {
        currentConversationId.current = conversationId;
        sendJsonMessage({
          type: 'join',
          conversationId,
        });
      }
    },
    [readyState, sendJsonMessage]
  );

  // Leave a conversation
  const leaveConversation = useCallback(
    (conversationId: string) => {
      if (readyState === ReadyState.OPEN) {
        currentConversationId.current = null;
        sendJsonMessage({
          type: 'leave',
          conversationId,
        });
      }
    },
    [readyState, sendJsonMessage]
  );

  // Send a message
  const sendMessage = useCallback(
    (conversationId: string, text: string, metadata?: Record<string, any>) => {
      if (readyState === ReadyState.OPEN) {
        const payload: SendMessagePayload = {
          type: 'message',
          conversationId,
          text,
        };

        if (metadata) {
          payload.metadata = metadata;
        }

        sendJsonMessage(payload);
      }
    },
    [readyState, sendJsonMessage]
  );

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    (conversationId: string, isTyping: boolean) => {
      if (readyState === ReadyState.OPEN) {
        sendJsonMessage({
          type: 'typing',
          conversationId,
          isTyping,
        });
      }
    },
    [readyState, sendJsonMessage]
  );

  // Send a quote message
  const sendQuote = useCallback(
    (conversationId: string, quoteData: QuoteData, text?: string) => {
      if (readyState === ReadyState.OPEN) {
        const payload: SendMessagePayload = {
          type: 'quote',
          conversationId,
          quoteData,
        };

        if (text) {
          payload.text = text;
        }

        sendJsonMessage(payload);
      }
    },
    [readyState, sendJsonMessage]
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Disconnected',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return {
    isConnected: readyState === ReadyState.OPEN,
    connectionStatus,
    readyState,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTypingIndicator,
    sendQuote,
  };
};
