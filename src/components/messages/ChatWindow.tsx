import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Phone, MoreVertical } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import type { Chat, Message } from '@/constants/messagesData';

interface ChatWindowProps {
  chat: Chat;
  currentUser: {
    id: string;
    name: string;
    avatar: string;
    type: string;
  };
  onSendMessage: (
    content: string,
    type?: 'text' | 'file' | 'image',
    file?: File
  ) => void;
  onBack: () => void;
  showBackButton: boolean;
}

const ChatWindow = ({
  chat,
  currentUser,
  onSendMessage,
  onBack,
  showBackButton,
}: ChatWindowProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  // Simulate typing indicator (for demo purposes)
  useEffect(() => {
    if (chat.messages.length > 0) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      if (lastMessage.senderId === currentUser.id) {
        setIsTyping(true);
        const timer = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [chat.messages, currentUser.id]);

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return format(date, 'HH:mm');
      } else if (diffInHours < 168) {
        // 7 days
        return format(date, 'EEE HH:mm');
      } else {
        return format(date, 'MMM dd, HH:mm');
      }
    } catch {
      return 'Now';
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach(message => {
      const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMMM dd, yyyy');
    }
  };

  const messageGroups = groupMessagesByDate(chat.messages);

  return (
    <div className='h-full flex flex-col bg-neutral-950 texture-bg'>
      {/* Header */}
      <div className='p-4 border-b border-white/10 bg-neutral-900'>
        <div className='flex items-center gap-3'>
          {/* Back button for mobile */}
          {showBackButton && (
            <button
              onClick={onBack}
              className='lg:hidden p-2 text-white hover:text-orange-500 transition-colors'
            >
              <ArrowLeft className='w-5 h-5' />
            </button>
          )}

          {/* Participant info */}
          <div>
            <img
              src={chat.participantAvatar}
              alt={chat.participantName}
              className='w-10 h-10 object-cover border border-white/20'
              onError={e => {
                e.currentTarget.src = '/images/artistNotFound.jpeg';
              }}
            />
          </div>

          <div className='flex-1'>
            <h2 className='font-semibold text-white'>{chat.participantName}</h2>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            <button className='p-2 text-white/60 hover:text-white transition-colors'>
              <Phone className='w-5 h-5' />
            </button>
            <button className='p-2 text-white/60 hover:text-white transition-colors'>
              <MoreVertical className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className='flex-1 overflow-y-auto p-4 space-y-4'
      >
        {Object.entries(messageGroups).map(([date, messages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className='flex items-center justify-center my-6'>
              <div className='bg-white/5 border border-white/10 px-4 py-2'>
                <span className='text-xs text-white/60 font-semibold'>
                  {formatDateHeader(date)}
                </span>
              </div>
            </div>

            {/* Messages for this date */}
            {messages.map((message, index) => {
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showAvatar =
                !prevMessage || prevMessage.senderId !== message.senderId;
              const showTime =
                !prevMessage ||
                prevMessage.senderId !== message.senderId ||
                new Date(message.timestamp).getTime() -
                  new Date(prevMessage.timestamp).getTime() >
                  300000; // 5 minutes

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isCurrentUser={message.senderId === currentUser.id}
                  showAvatar={showAvatar}
                  showTime={showTime}
                  timestamp={formatTime(message.timestamp)}
                />
              );
            })}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className='flex items-center gap-3'>
            <img
              src={chat.participantAvatar}
              alt={chat.participantName}
              className='w-8 h-8 object-cover border border-white/20'
            />
            <div className='bg-white/5 border border-white/10 px-4 py-3 max-w-xs'>
              <div className='flex items-center gap-1'>
                <div className='w-2 h-2 bg-white/50 rounded-full animate-bounce'></div>
                <div
                  className='w-2 h-2 bg-white/50 rounded-full animate-bounce'
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className='w-2 h-2 bg-white/50 rounded-full animate-bounce'
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
