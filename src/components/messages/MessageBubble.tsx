import type { Message } from '@/types/chat';
import QuoteCard from './QuoteCard';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  showTime: boolean;
  timestamp: string;
}

const MessageBubble = ({
  message,
  isCurrentUser,
  showAvatar,
  showTime,
  timestamp,
}: MessageBubbleProps) => {
  // Handle quote messages
  if (message.messageType === 'quote' && message.quoteData) {
    return (
      <div
        className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        {/* Avatar (only for other users and when needed) */}
        {!isCurrentUser && (
          <div
            className={`w-8 h-8 flex-shrink-0 ${showAvatar ? '' : 'invisible'}`}
          >
            {showAvatar && (
              <img
                src={message.senderAvatar || '/images/artistNotFound.jpeg'}
                alt={message.senderName}
                className='w-8 h-8 object-cover border border-white/20'
                onError={e => {
                  e.currentTarget.src = '/images/artistNotFound.jpeg';
                }}
              />
            )}
          </div>
        )}

        {/* Quote content */}
        <div className={`${isCurrentUser ? 'order-1' : ''}`}>
          {/* Sender name and time (when needed) */}
          {showTime && (
            <div
              className={`mb-2 ${isCurrentUser ? 'text-right' : 'text-left'}`}
            >
              {!isCurrentUser && (
                <span className='text-xs font-semibold text-white/80 mr-2'>
                  {message.senderName}
                </span>
              )}
              <span className='text-xs text-white/50'>{timestamp}</span>
            </div>
          )}

          {/* Quote Card */}
          <QuoteCard
            quoteData={message.quoteData}
            isCurrentUser={isCurrentUser}
            text={message.text}
          />

          {/* Read status (for current user's messages) */}
          {isCurrentUser && (
            <div className='text-right mt-1'>
              <span
                className={`text-xs ${
                  message.isRead ? 'text-blue-400' : 'text-white/50'
                }`}
              >
                {message.isRead ? '✓✓' : '✓'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle regular text messages
  return (
    <div
      className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar (only for other users and when needed) */}
      {!isCurrentUser && (
        <div
          className={`w-8 h-8 flex-shrink-0 ${showAvatar ? '' : 'invisible'}`}
        >
          {showAvatar && (
            <img
              src={message.senderAvatar || '/images/artistNotFound.jpeg'}
              alt={message.senderName}
              className='w-8 h-8 object-cover border border-white/20'
              onError={e => {
                e.currentTarget.src = '/images/artistNotFound.jpeg';
              }}
            />
          )}
        </div>
      )}

      {/* Message content */}
      <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-1' : ''}`}>
        {/* Sender name and time (when needed) */}
        {showTime && (
          <div className={`mb-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
            {!isCurrentUser && (
              <span className='text-xs font-semibold text-white/80 mr-2'>
                {message.senderName}
              </span>
            )}
            <span className='text-xs text-white/50'>{timestamp}</span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`px-4 py-3 break-words ${
            isCurrentUser
              ? 'bg-orange-500 text-black'
              : 'bg-white/5 border border-white/10 text-white'
          }`}
        >
          <p className='text-sm whitespace-pre-wrap'>{message.text}</p>
        </div>

        {/* Read status (for current user's messages) */}
        {isCurrentUser && (
          <div className='text-right mt-1'>
            <span
              className={`text-xs ${
                message.isRead ? 'text-blue-400' : 'text-white/50'
              }`}
            >
              {message.isRead ? '✓✓' : '✓'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
