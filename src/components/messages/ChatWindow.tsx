import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Phone, MoreVertical, Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import QuoteMessageModal from './QuoteMessageModal';
import { useMessageHistory } from '@/hooks/useChat';
import type { Conversation, Message, QuoteData } from '@/types/chat';

interface ChatWindowProps {
  conversationId: string;
  conversation: Conversation;
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  onSendMessage: (content: string) => void;
  onSendQuote?: (quoteData: QuoteData, text?: string) => void;
  onTyping: (isTyping: boolean) => void;
  onBack: () => void;
  showBackButton: boolean;
  isTyping?: boolean;
}

const ChatWindow = ({
  conversationId,
  conversation,
  currentUser,
  onSendMessage,
  onSendQuote,
  onTyping,
  onBack,
  showBackButton,
  isTyping = false,
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const isArtist = currentUser.role === 'artist';

  // Fetch message history
  const { data: historyData, isLoading } = useMessageHistory(conversationId);

  const messages = historyData?.items || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTypingChange = (isCurrentlyTyping: boolean) => {
    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    onTyping(isCurrentlyTyping);

    if (isCurrentlyTyping) {
      // Set timeout to stop typing indicator after 3 seconds
      const timeout = setTimeout(() => {
        onTyping(false);
      }, 3000);
      setTypingTimeout(timeout);
    }
  };

  const handleSendQuote = (quoteData: QuoteData, text?: string) => {
    if (onSendQuote) {
      onSendQuote(quoteData, text);
      setIsQuoteModalOpen(false);
    }
  };

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
      const date = format(new Date(message.createdAt), 'yyyy-MM-dd');
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

  const messageGroups = groupMessagesByDate(messages);

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
              src={
                conversation.participantAvatar ?? '/images/artistNotFound.jpeg'
              }
              alt={conversation.participantName}
              className='w-10 h-10 object-cover border border-white/20'
              onError={e => {
                e.currentTarget.src = '/images/artistNotFound.jpeg';
              }}
            />
          </div>

          <div className='flex-1'>
            <h2 className='font-semibold text-white'>
              {conversation.participantName}
            </h2>
            {isTyping && <p className='text-xs text-green-400'>typing...</p>}
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
        {isLoading ? (
          <div className='flex items-center justify-center h-full'>
            <div className='text-center'>
              <Loader2 className='w-8 h-8 text-orange-500 animate-spin mx-auto mb-4' />
              <p className='text-white/60'>Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <div className='text-center'>
              <p className='text-white/60'>No messages yet</p>
              <p className='text-white/40 text-sm mt-2'>
                Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <>
            {Object.entries(messageGroups).map(([date, dateMessages]) => (
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
                {dateMessages.map((message, index) => {
                  const prevMessage =
                    index > 0 ? dateMessages[index - 1] : null;
                  const showAvatar =
                    !prevMessage || prevMessage.senderId !== message.senderId;
                  const showTime =
                    !prevMessage ||
                    prevMessage.senderId !== message.senderId ||
                    new Date(message.createdAt).getTime() -
                      new Date(prevMessage.createdAt).getTime() >
                      300000; // 5 minutes

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isCurrentUser={message.senderId === currentUser.id}
                      showAvatar={showAvatar}
                      showTime={showTime}
                      timestamp={formatTime(message.createdAt)}
                    />
                  );
                })}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className='flex items-center gap-3'>
                <img
                  src={conversation.participantAvatar}
                  alt={conversation.participantName}
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
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onTypingChange={handleTypingChange}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        isArtist={isArtist}
      />

      {/* Quote Modal */}
      <QuoteMessageModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        onSendQuote={handleSendQuote}
        recipientUserId={conversation.participantId}
      />
    </div>
  );
};

export default ChatWindow;
