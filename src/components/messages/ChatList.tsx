import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Search, Wifi, WifiOff } from 'lucide-react';
import type { Conversation } from '@/types/chat';

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
  isConnected,
}: ChatListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(
    conv =>
      conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  const getMessagePreview = (
    conv: Conversation
  ): { text: string; isQuote: boolean } => {
    if (!conv.lastMessage) {
      return { text: 'No messages yet', isQuote: false };
    }

    // Check if it's a quote message by looking for the quote format indicator
    if (conv.lastMessage.includes('📋')) {
      return { text: conv.lastMessage, isQuote: true };
    }

    // Truncate long regular messages
    const maxLength = 50;
    const truncated =
      conv.lastMessage.length > maxLength
        ? `${conv.lastMessage.substring(0, maxLength)}...`
        : conv.lastMessage;
    return { text: truncated, isQuote: false };
  };

  const getMessageTimestamp = (conv: Conversation): string => {
    return conv.lastMessageTime ? formatTime(conv.lastMessageTime) : 'Just now';
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
            {/* Connection Status */}
            <div
              className={`flex items-center gap-1 ${
                isConnected ? 'text-green-400' : 'text-red-400'
              }`}
              title={isConnected ? 'Connected' : 'Disconnected'}
            >
              {isConnected ? (
                <Wifi className='w-4 h-4' />
              ) : (
                <WifiOff className='w-4 h-4' />
              )}
            </div>

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
                      conv.participantAvatar ?? '/images/artistNotFound.jpeg'
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
                        {getMessageTimestamp(conv)}
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
                    {getMessagePreview(conv).text}
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
