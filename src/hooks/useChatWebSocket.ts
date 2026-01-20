import { useEffect, useCallback, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useStore } from '@/stores/store';
import { api } from '@/config';
import type {
  WebSocketMessage,
  SendMessagePayload,
  Message,
  QuoteData,
} from '@/types/chat';

const WS_URL = api.wsUrl;

interface UseChatWebSocketProps {
  onMessage?: (message: Message) => void;
  onTyping?: (
    conversationId: string,
    userId: string,
    isTyping: boolean
  ) => void;
  onMessagesRead?: (
    conversationId: string,
    messageIds: string[],
    userId: string
  ) => void;
  onJoined?: (conversationId: string) => void;
  onLeft?: (conversationId: string) => void;
  onError?: (error: string, code?: string) => void;
}

export const useChatWebSocket = ({
  onMessage,
  onTyping,
  onMessagesRead,
  onJoined,
  onLeft,
  onError,
}: UseChatWebSocketProps = {}) => {
  const { user } = useStore();
  const currentConversationId = useRef<string | null>(null);
  const processedMessageIds = useRef<Set<string>>(new Set());

  // Use refs to store callbacks to prevent useEffect re-runs
  const onMessageRef = useRef(onMessage);
  const onTypingRef = useRef(onTyping);
  const onMessagesReadRef = useRef(onMessagesRead);
  const onJoinedRef = useRef(onJoined);
  const onLeftRef = useRef(onLeft);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage;
    onTypingRef.current = onTyping;
    onMessagesReadRef.current = onMessagesRead;
    onJoinedRef.current = onJoined;
    onLeftRef.current = onLeft;
    onErrorRef.current = onError;
  }, [onMessage, onTyping, onMessagesRead, onJoined, onLeft, onError]);

  // Construct WebSocket URL with user ID
  const socketUrl = user?.id ? `${WS_URL}?token=${user.id}` : null;

  // Message handler - using callback instead of lastJsonMessage for reliability
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;

      switch (message.type) {
        case 'connected':
          console.log('[WebSocket] Connected');
          break;

        case 'message':
          // Prevent processing the same message twice
          if (
            message.message?.id &&
            processedMessageIds.current.has(message.message.id)
          ) {
            break;
          }

          if (message.message && onMessageRef.current) {
            // Mark as processed before calling callback
            processedMessageIds.current.add(message.message.id);
            // Keep only last 100 message IDs to prevent memory leak
            if (processedMessageIds.current.size > 100) {
              const firstId = processedMessageIds.current.values().next().value;
              if (firstId) {
                processedMessageIds.current.delete(firstId);
              }
            }
            onMessageRef.current(message.message);
          }
          break;

        case 'typing':
          if (
            message.conversationId &&
            message.userId !== undefined &&
            onTypingRef.current
          ) {
            onTypingRef.current(
              message.conversationId,
              message.userId,
              message.isTyping || false
            );
          }
          break;

        case 'messages_read':
          if (
            message.conversationId &&
            message.messageIds &&
            message.userId &&
            onMessagesReadRef.current
          ) {
            onMessagesReadRef.current(
              message.conversationId,
              message.messageIds,
              message.userId
            );
          }
          break;

        case 'error':
          console.error('[WebSocket] Error:', message.error, message.code);
          if (onErrorRef.current) {
            onErrorRef.current(message.error || 'Unknown error', message.code);
          }
          break;

        case 'joined':
          if (message.conversationId && onJoinedRef.current) {
            onJoinedRef.current(message.conversationId);
          }
          break;

        case 'left':
          if (message.conversationId && onLeftRef.current) {
            onLeftRef.current(message.conversationId);
          }
          break;

        case 'message_ack':
        default:
          break;
      }
    } catch (e) {
      console.error('[WebSocket] Failed to parse message:', e);
    }
  }, []); // Empty deps - uses refs for callbacks

  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: handleWebSocketMessage, // Use callback for immediate processing
    shouldReconnect: closeEvent => {
      // Always try to reconnect unless it was a clean close with code 1000
      return closeEvent.code !== 1000;
    },
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    share: true, // Share WebSocket connection across all hook instances
    retryOnError: true,
  });

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

  // Mark messages as read
  const sendMarkAsRead = useCallback(
    (conversationId: string, messageIds: string[]) => {
      if (readyState === ReadyState.OPEN && messageIds.length > 0) {
        sendJsonMessage({
          type: 'mark_read',
          conversationId,
          messageIds,
        });
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
    sendMarkAsRead,
  };
};
