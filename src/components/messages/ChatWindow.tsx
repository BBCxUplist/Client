import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { format } from 'date-fns';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import type { Chat, Message } from '@/constants/messagesData';

export interface ChatWindowProps {
  chat: Chat;
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  onSendMessage: (
    content: string,
    type?: 'text' | 'file' | 'image',
    file?: File
  ) => void | Promise<void>;
  onBack: () => void;
  showBackButton: boolean;
  onLoadOlder?: () => void | Promise<void>;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
}

const ChatWindow = ({
  chat,
  currentUser,
  onSendMessage,
  onBack,
  showBackButton,
  onLoadOlder,
  onTypingStart,
  onTypingEnd,
}: ChatWindowProps) => {
  const [peerIsTypingVisual, setPeerIsTypingVisual] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTopRef = useRef<number>(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  useEffect(() => {
    if (chat.messages.length > 0) {
      const last = chat.messages[chat.messages.length - 1];
      if (last.senderId === currentUser.id) {
        setPeerIsTypingVisual(true);
        const t = setTimeout(() => setPeerIsTypingVisual(false), 2000);
        return () => clearTimeout(t);
      }
    }
  }, [chat.messages, currentUser.id]);

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours =
        (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return format(date, 'HH:mm');
      } else if (diffInHours < 168) {
        return format(date, 'EEE HH:mm');
      } else {
        return format(date, 'MMM dd, HH:mm');
      }
    } catch {
      return 'Now';
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: Record<string, Message[]> = {};
    messages.forEach((m) => {
      const date = format(new Date(m.timestamp), 'yyyy-MM-dd');
      (groups[date] ||= []).push(m);
    });
    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const fmt = (d: Date) => format(d, 'yyyy-MM-dd');
    if (fmt(date) === fmt(today)) return 'Today';
    if (fmt(date) === fmt(yesterday)) return 'Yesterday';
    return format(date, 'EEEE, MMMM dd, yyyy');
  };

  const messageGroups = groupMessagesByDate(chat.messages);

  const handleScroll = async () => {
    const el = messagesContainerRef.current;
    if (!el || !onLoadOlder) return;
    if (el.scrollTop < 40 && lastScrollTopRef.current >= 40) {
      const prevHeight = el.scrollHeight;
      await onLoadOlder();
      requestAnimationFrame(() => {
        const newHeight = el.scrollHeight;
        el.scrollTop = newHeight - prevHeight;
      });
    }
    lastScrollTopRef.current = el.scrollTop;
  };

  const handleKeyActivity = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onTypingStart || !onTypingEnd) return;
    onTypingStart();
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      onTypingEnd();
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-neutral-950 texture-bg">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-neutral-900">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={onBack}
              className="lg:hidden p-2 text-white hover:text-orange-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div>
            <img
              src={chat.participantAvatar || '/images/artistNotFound.jpeg'}
              alt={chat.participantName}
              className="w-10 h-10 object-cover border border-white/20"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/artistNotFound.jpeg';
              }}
            />
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-white">{chat.participantName}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-white/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="p-2 text-white/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
        onKeyDown={handleKeyActivity}
        tabIndex={0}
      >
        {Object.entries(messageGroups).map(([date, messages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-6">
              <div className="bg-white/5 border border-white/10 px-4 py-2">
                <span className="text-xs text-white/60 font-semibold">
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

        {/* Typing indicator (visual only) */}
        {peerIsTypingVisual && (
          <div className="flex items-center gap-3">
            <img
              src={chat.participantAvatar || '/images/artistNotFound.jpeg'}
              alt={chat.participantName}
              className="w-8 h-8 object-cover border border-white/20"
            />
            <div className="bg-white/5 border border-white/10 px-4 py-3 max-w-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
