import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Search } from 'lucide-react';
import type { Chat } from '@/constants/messagesData';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
}

const ChatList = ({ chats, selectedChatId, onChatSelect }: ChatListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(
    chat =>
      chat.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className='h-full flex flex-col bg-neutral-900'>
      {/* Header */}
      <div className='p-4 lg:p-6 border-b border-white/10'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='font-mondwest text-2xl lg:text-3xl font-bold text-white'>
            Messages
          </h1>
          <div className='flex items-center gap-2'>
            <span className='text-white/60 text-sm'>
              {chats.reduce((acc, chat) => acc + chat.unreadCount, 0)} unread
            </span>
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
        {filteredChats.length === 0 ? (
          <div className='p-6 text-center'>
            <p className='text-white/60'>
              {searchTerm ? 'No conversations found' : 'No messages yet'}
            </p>
          </div>
        ) : (
          filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`p-4 border-b border-white/5 cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                selectedChatId === chat.id
                  ? 'bg-orange-500/10 border-l-4 border-l-orange-500'
                  : ''
              }`}
            >
              <div className='flex items-start gap-3'>
                {/* Avatar */}
                <div className='flex-shrink-0'>
                  <img
                    src={chat.participantAvatar}
                    alt={chat.participantName}
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
                      {chat.participantName}
                    </h3>
                    <div className='flex items-center gap-2 flex-shrink-0'>
                      <span className='text-xs text-white/50'>
                        {formatTime(chat.lastMessageTime)}
                      </span>
                      {chat.unreadCount > 0 && (
                        <div className='bg-orange-500 text-black text-xs font-bold px-2 py-1 min-w-[20px] h-5 flex items-center justify-center'>
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      chat.unreadCount > 0 ? 'text-white' : 'text-white/60'
                    }`}
                  >
                    {chat.lastMessage}
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
