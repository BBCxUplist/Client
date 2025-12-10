import { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Search } from 'lucide-react';
import type { Conversation } from '@/types/chat';
import { useChatStore } from '@/stores/chatStore';

interface ChatListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onChatSelect: (conversationId: string) => void;
  isLoading?: boolean;
  isConnected?: boolean;
}

const ChatList = ({
  conversations,
  selectedConversationId,
  onChatSelect,
  isLoading,
}: ChatListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Get messages from store to show the latest message for each conversation
  const messagesByConversation = useChatStore(
    state => state.messagesByConversation
  );

  // Enhance conversations with real-time data from store
  const enhancedConversations = useMemo(() => {
    return (conversations || []).map(conv => {
      // Get the latest message text for a conversation
      const storeMessages = messagesByConversation[conv.id];
      let lastMessage = conv.lastMessage || '';
      let lastMessageTime = conv.lastMessageTime || null;

      if (storeMessages && storeMessages.length > 0) {
        const lastMsg = storeMessages[storeMessages.length - 1];
        if (lastMsg.messageType === 'quote') {
          lastMessage = `📋 Quote - $${lastMsg.quoteData?.proposedPrice || 0}`;
        } else {
          lastMessage = lastMsg.text || '';
        }
        lastMessageTime = lastMsg.createdAt;
      }

      return {
        ...conv,
        _lastMessage: lastMessage,
        _lastMessageTime: lastMessageTime,
      };
    });
  }, [conversations, messagesByConversation]);

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    return enhancedConversations
      .filter(conv => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
          conv.participantName?.toLowerCase().includes(search) ||
          conv._lastMessage?.toLowerCase().includes(search)
        );
      })
      .sort((a, b) => {
        const timeA = a._lastMessageTime
          ? new Date(a._lastMessageTime).getTime()
          : 0;
        const timeB = b._lastMessageTime
          ? new Date(b._lastMessageTime).getTime()
          : 0;
        return timeB - timeA;
      });
  }, [enhancedConversations, searchTerm]);

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const getMessagePreview = (
    conv: (typeof enhancedConversations)[0]
  ): string => {
    const text = conv._lastMessage;
    if (!text || text.trim() === '') {
      return 'Start a conversation';
    }
    // Truncate long messages
    const maxLength = 50;
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const totalUnread = conversations.reduce(
    (acc, conv) => acc + (conv.unreadCount || 0),
    0
  );

  return (
    <div className='h-full flex flex-col bg-neutral-900'>
      {/* Header */}
      <div className='p-4 lg:p-6 border-b border-white/10'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='font-mondwest text-2xl lg:text-3xl font-bold text-white'>
            Messages
          </h1>
          <div className='flex items-center gap-3'>
            {/* Unread Count */}
            {totalUnread > 0 && (
              <span className='text-white/60 text-sm'>
                {totalUnread} unread
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className='relative'>
          <input
            type='text'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Search conversations...'
            className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 pl-10 focus:border-orange-500 focus:outline-none transition-colors'
          />
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50' />
        </div>
      </div>

      {/* Chat List */}
      <div className='flex-1 overflow-y-auto'>
        {isLoading ? (
          <div className='p-6 text-center'>
            <div className='animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto'></div>
            <p className='text-white/60 mt-4'>Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className='p-6 text-center'>
            <p className='text-white/60'>
              {searchTerm ? 'No conversations found' : 'No messages yet'}
            </p>
          </div>
        ) : (
          filteredConversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => onChatSelect(conv.id)}
              className={`p-4 border-b border-white/5 cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                selectedConversationId === conv.id
                  ? 'bg-orange-500/10 border-l-4 border-l-orange-500'
                  : ''
              }`}
            >
              <div className='flex items-start gap-3'>
                {/* Avatar */}
                <div className='flex-shrink-0'>
                  <img
                    src={
                      conv.participantAvatar || '/images/artistNotFound.jpeg'
                    }
                    alt={conv.participantName}
                    className='w-12 h-12 object-cover border border-white/20'
                    onError={e => {
                      e.currentTarget.src = '/images/artistNotFound.jpeg';
                    }}
                  />
                </div>

                {/* Chat info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between mb-1'>
                    <h3 className='font-semibold text-white truncate'>
                      {conv.participantName}
                    </h3>
                    <div className='flex items-center gap-2 flex-shrink-0'>
                      <span className='text-xs text-white/50'>
                        {formatTime(conv._lastMessageTime)}
                      </span>
                      {conv.unreadCount && conv.unreadCount > 0 && (
                        <div className='bg-orange-500 text-black text-xs font-bold px-2 py-1 min-w-[20px] h-5 flex items-center justify-center'>
                          {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      conv.unreadCount && conv.unreadCount > 0
                        ? 'text-white'
                        : 'text-white/60'
                    }`}
                  >
                    {getMessagePreview(conv)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
