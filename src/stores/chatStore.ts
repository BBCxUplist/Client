import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { Conversation, Message } from '@/types/chat';

// Chat store state interface
interface ChatState {
  // Conversations list
  conversations: Conversation[];

  // Messages by conversation ID
  messagesByConversation: Record<string, Message[]>;

  // Currently selected conversation
  selectedConversationId: string | null;

  // Connection status
  isConnected: boolean;

  // Typing indicators by conversation ID -> user ID -> isTyping
  typingUsers: Record<string, Record<string, boolean>>;

  // Unread counts (cached locally for quick access)
  unreadCounts: Record<string, number>;

  // Last fetch timestamps for cache invalidation
  lastConversationsFetch: number | null;
  lastMessagesFetch: Record<string, number>;
}

// Chat store actions interface
interface ChatActions {
  // Conversation actions
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (
    conversationId: string,
    updates: Partial<Conversation>
  ) => void;

  // Message actions
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    updates: Partial<Message>
  ) => void;
  replaceOptimisticMessage: (
    conversationId: string,
    tempId: string,
    realMessage: Message
  ) => void;
  prependMessages: (conversationId: string, messages: Message[]) => void;

  // Selection actions
  setSelectedConversation: (conversationId: string | null) => void;

  // Connection actions
  setConnectionStatus: (isConnected: boolean) => void;

  // Typing actions
  setTypingUser: (
    conversationId: string,
    userId: string,
    isTyping: boolean
  ) => void;
  clearTypingUsers: (conversationId: string) => void;

  // Unread count actions
  setUnreadCount: (conversationId: string, count: number) => void;
  incrementUnreadCount: (conversationId: string) => void;
  clearUnreadCount: (conversationId: string) => void;
  getTotalUnreadCount: () => number;

  // Mark messages as read
  markConversationAsRead: (conversationId: string) => void;

  // Cache management
  setLastConversationsFetch: (timestamp: number) => void;
  setLastMessagesFetch: (conversationId: string, timestamp: number) => void;
  shouldRefetchConversations: (maxAge?: number) => boolean;
  shouldRefetchMessages: (conversationId: string, maxAge?: number) => boolean;

  // Utility actions
  getConversation: (conversationId: string) => Conversation | undefined;
  getMessages: (conversationId: string) => Message[];
  clearChatData: () => void;
  clearMessagesForConversation: (conversationId: string) => void;
}

export type ChatStore = ChatState & ChatActions;

const CACHE_MAX_AGE = 30 * 1000; // 30 seconds default cache age

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        conversations: [],
        messagesByConversation: {},
        selectedConversationId: null,
        isConnected: false,
        typingUsers: {},
        unreadCounts: {},
        lastConversationsFetch: null,
        lastMessagesFetch: {},

        // Conversation actions
        setConversations: conversations => {
          set({
            conversations,
            lastConversationsFetch: Date.now(),
          });

          // Update unread counts from conversations
          const unreadCounts: Record<string, number> = {};
          conversations.forEach(conv => {
            if (conv.unreadCount !== undefined) {
              unreadCounts[conv.id] = conv.unreadCount;
            }
          });
          set({ unreadCounts });
        },

        addConversation: conversation => {
          set(state => ({
            conversations: [
              conversation,
              ...state.conversations.filter(c => c.id !== conversation.id),
            ],
          }));
        },

        updateConversation: (conversationId, updates) => {
          const currentConv = get().conversations.find(
            c => c.id === conversationId
          );
          if (!currentConv) {
            return;
          }

          // Check if any values actually changed
          const hasChanges = Object.entries(updates).some(([key, value]) => {
            return currentConv[key as keyof typeof currentConv] !== value;
          });

          if (!hasChanges) {
            return;
          }

          set(state => ({
            conversations: state.conversations.map(conv =>
              conv.id === conversationId ? { ...conv, ...updates } : conv
            ),
          }));
        },

        // Message actions
        setMessages: (conversationId, messages) => {
          set(state => {
            const existingMessages =
              state.messagesByConversation[conversationId] || [];

            // Create a map of API messages by ID for quick lookup
            const apiMessagesMap = new Map(messages.map(m => [m.id, m]));

            // Find any real-time messages that aren't in the API response yet
            // (new messages received via WebSocket that API hasn't returned yet)
            const realtimeOnlyMessages = existingMessages.filter(m => {
              // Keep messages that don't exist in API response
              // but only if they're newer than the oldest API message
              // or are temp/optimistic messages
              if (apiMessagesMap.has(m.id)) {
                return false; // Already in API response
              }
              // Keep temp messages (optimistic updates)
              if (m.id.startsWith('temp-')) {
                return true;
              }
              // Keep real-time messages that are newer than any API message
              if (messages.length > 0) {
                const latestApiTime = Math.max(
                  ...messages.map(am => new Date(am.createdAt).getTime())
                );
                const messageTime = new Date(m.createdAt).getTime();
                return messageTime > latestApiTime;
              }
              return true;
            });

            // Merge: API messages + real-time only messages, sorted by time
            const mergedMessages = [...messages, ...realtimeOnlyMessages].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );

            return {
              messagesByConversation: {
                ...state.messagesByConversation,
                [conversationId]: mergedMessages,
              },
              lastMessagesFetch: {
                ...state.lastMessagesFetch,
                [conversationId]: Date.now(),
              },
            };
          });
        },

        addMessage: (conversationId, message) => {
          set(state => {
            const existingMessages =
              state.messagesByConversation[conversationId] || [];

            // Check if message already exists
            const exists = existingMessages.some(m => m.id === message.id);
            if (exists) {
              return state;
            }

            // Check for optimistic message to replace
            const optimisticIndex = existingMessages.findIndex(m => {
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

            let newMessages: Message[];
            if (optimisticIndex !== -1) {
              newMessages = [...existingMessages];
              newMessages[optimisticIndex] = message;
            } else {
              newMessages = [...existingMessages, message];
            }

            return {
              messagesByConversation: {
                ...state.messagesByConversation,
                [conversationId]: newMessages,
              },
            };
          });
        },

        updateMessage: (conversationId, messageId, updates) => {
          set(state => {
            const messages = state.messagesByConversation[conversationId] || [];
            return {
              messagesByConversation: {
                ...state.messagesByConversation,
                [conversationId]: messages.map(msg =>
                  msg.id === messageId ? { ...msg, ...updates } : msg
                ),
              },
            };
          });
        },

        replaceOptimisticMessage: (conversationId, tempId, realMessage) => {
          set(state => {
            const messages = state.messagesByConversation[conversationId] || [];
            const index = messages.findIndex(m => m.id === tempId);
            if (index === -1) return state;

            const newMessages = [...messages];
            newMessages[index] = realMessage;

            return {
              messagesByConversation: {
                ...state.messagesByConversation,
                [conversationId]: newMessages,
              },
            };
          });
        },

        prependMessages: (conversationId, messages) => {
          set(state => {
            const existingMessages =
              state.messagesByConversation[conversationId] || [];
            return {
              messagesByConversation: {
                ...state.messagesByConversation,
                [conversationId]: [...messages, ...existingMessages],
              },
            };
          });
        },

        // Selection actions
        setSelectedConversation: conversationId => {
          // Check if value actually changed
          if (get().selectedConversationId === conversationId) {
            return;
          }
          set({ selectedConversationId: conversationId });
        },

        // Connection actions
        setConnectionStatus: isConnected => {
          // Check if value actually changed
          if (get().isConnected === isConnected) {
            return;
          }
          set({ isConnected });
        },

        // Typing actions
        setTypingUser: (conversationId, userId, isTyping) => {
          // Check if value actually changed to prevent infinite loops
          const currentValue = get().typingUsers[conversationId]?.[userId];
          if (currentValue === isTyping) {
            return; // No change needed
          }

          set(state => ({
            typingUsers: {
              ...state.typingUsers,
              [conversationId]: {
                ...state.typingUsers[conversationId],
                [userId]: isTyping,
              },
            },
          }));
        },

        clearTypingUsers: conversationId => {
          // Check if there are any typing users to clear
          const currentTypingUsers = get().typingUsers[conversationId];
          if (
            !currentTypingUsers ||
            Object.keys(currentTypingUsers).length === 0
          ) {
            return; // Nothing to clear
          }

          set(state => ({
            typingUsers: {
              ...state.typingUsers,
              [conversationId]: {},
            },
          }));
        },

        // Unread count actions
        setUnreadCount: (conversationId, count) => {
          // Check if value actually changed
          if (get().unreadCounts[conversationId] === count) {
            return;
          }
          set(state => ({
            unreadCounts: {
              ...state.unreadCounts,
              [conversationId]: count,
            },
          }));
        },

        incrementUnreadCount: conversationId => {
          set(state => ({
            unreadCounts: {
              ...state.unreadCounts,
              [conversationId]: (state.unreadCounts[conversationId] || 0) + 1,
            },
          }));
        },

        clearUnreadCount: conversationId => {
          // Check if already zero
          if (
            get().unreadCounts[conversationId] === 0 ||
            get().unreadCounts[conversationId] === undefined
          ) {
            return;
          }
          set(state => ({
            unreadCounts: {
              ...state.unreadCounts,
              [conversationId]: 0,
            },
          }));
        },

        getTotalUnreadCount: () => {
          const state = get();
          return Object.values(state.unreadCounts).reduce(
            (sum, count) => sum + count,
            0
          );
        },

        // Mark messages as read - only updates unread count, not isRead status
        // isRead status should come from the backend (indicates if RECEIVER has read)
        markConversationAsRead: conversationId => {
          set(state => {
            // Update conversation unread count only
            const updatedConversations = state.conversations.map(conv =>
              conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
            );

            return {
              conversations: updatedConversations,
              unreadCounts: {
                ...state.unreadCounts,
                [conversationId]: 0,
              },
            };
          });
        },

        // Cache management
        setLastConversationsFetch: timestamp => {
          set({ lastConversationsFetch: timestamp });
        },

        setLastMessagesFetch: (conversationId, timestamp) => {
          set(state => ({
            lastMessagesFetch: {
              ...state.lastMessagesFetch,
              [conversationId]: timestamp,
            },
          }));
        },

        shouldRefetchConversations: (maxAge = CACHE_MAX_AGE) => {
          const state = get();
          if (!state.lastConversationsFetch) return true;
          return Date.now() - state.lastConversationsFetch > maxAge;
        },

        shouldRefetchMessages: (conversationId, maxAge = CACHE_MAX_AGE) => {
          const state = get();
          const lastFetch = state.lastMessagesFetch[conversationId];
          if (!lastFetch) return true;
          return Date.now() - lastFetch > maxAge;
        },

        // Utility actions
        getConversation: conversationId => {
          return get().conversations.find(c => c.id === conversationId);
        },

        getMessages: conversationId => {
          return get().messagesByConversation[conversationId] || [];
        },

        clearChatData: () => {
          set({
            conversations: [],
            messagesByConversation: {},
            selectedConversationId: null,
            typingUsers: {},
            unreadCounts: {},
            lastConversationsFetch: null,
            lastMessagesFetch: {},
          });
        },

        clearMessagesForConversation: conversationId => {
          set(state => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [conversationId]: _removed, ...restMessages } =
              state.messagesByConversation;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [conversationId]: _removedFetch, ...restFetch } =
              state.lastMessagesFetch;
            return {
              messagesByConversation: restMessages,
              lastMessagesFetch: restFetch,
            };
          });
        },
      }),
      {
        name: 'chat-storage',
        storage: createJSONStorage(() => localStorage),
        // Only persist certain fields to avoid storing too much data
        partialize: state => ({
          conversations: state.conversations,
          // Don't persist all messages - only recent ones (last 50 per conversation)
          messagesByConversation: Object.fromEntries(
            Object.entries(state.messagesByConversation).map(
              ([convId, messages]) => [
                convId,
                messages.slice(-50), // Keep only last 50 messages per conversation
              ]
            )
          ),
          unreadCounts: state.unreadCounts,
          lastConversationsFetch: state.lastConversationsFetch,
          lastMessagesFetch: state.lastMessagesFetch,
        }),
      }
    ),
    { name: 'ChatStore' }
  )
);

// Selector hooks for performance
export const useConversations = () =>
  useChatStore(state => state.conversations);
export const useSelectedConversationId = () =>
  useChatStore(state => state.selectedConversationId);
export const useIsConnected = () => useChatStore(state => state.isConnected);
export const useTotalUnreadCount = () =>
  useChatStore(state =>
    Object.values(state.unreadCounts).reduce((sum, count) => sum + count, 0)
  );
export const useMessagesForConversation = (conversationId: string) =>
  useChatStore(state => state.messagesByConversation[conversationId] || []);
export const useTypingUsersForConversation = (conversationId: string) =>
  useChatStore(state => state.typingUsers[conversationId] || {});
export const useUnreadCountForConversation = (conversationId: string) =>
  useChatStore(state => state.unreadCounts[conversationId] || 0);
