import { useState, useRef, useCallback, memo } from 'react';
import { Send, Smile, DollarSign } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
  onOpenQuoteModal?: () => void;
  isArtist?: boolean;
}

const MessageInput = memo(
  ({
    onSendMessage,
    onTypingChange,
    onOpenQuoteModal,
    isArtist = false,
  }: MessageInputProps) => {
    const [message, setMessage] = useState('');
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isTypingRef = useRef(false);

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
          onSendMessage(message.trim());
          setMessage('');

          // Stop typing indicator
          if (onTypingChange && isTypingRef.current) {
            onTypingChange(false);
            isTypingRef.current = false;
          }

          // Clear timeout
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
        }
      },
      [message, onSendMessage, onTypingChange]
    );

    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      },
      [handleSubmit]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setMessage(value);

        if (!onTypingChange) return;

        // Start typing indicator
        if (value.trim() && !isTypingRef.current) {
          onTypingChange(true);
          isTypingRef.current = true;
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing after 2 seconds of inactivity
        if (value.trim()) {
          typingTimeoutRef.current = setTimeout(() => {
            if (onTypingChange && isTypingRef.current) {
              onTypingChange(false);
              isTypingRef.current = false;
            }
          }, 2000);
        } else {
          // Stop typing immediately if input is empty
          if (isTypingRef.current) {
            onTypingChange(false);
            isTypingRef.current = false;
          }
        }
      },
      [onTypingChange]
    );

    return (
      <div className='flex items-end justify-between p-4 border-t border-white/10 bg-neutral-900'>
        {/* Message input */}
        <form onSubmit={handleSubmit} className='w-full flex gap-3 items-end'>
          {/* Quote button (for artists only) */}
          {isArtist && onOpenQuoteModal && (
            <button
              type='button'
              onClick={onOpenQuoteModal}
              className='flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white/5 text-orange-500 border border-white/20 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all'
              title='Send Quote'
            >
              <DollarSign className='w-5 h-5' />
            </button>
          )}

          {/* Text input */}
          <div className='w-full relative flex'>
            <textarea
              value={message}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder='Type a message...'
              rows={1}
              className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 pr-12 resize-none focus:border-orange-500 focus:outline-none transition-colors '
              style={{
                height: '48px',
                minHeight: '48px',
                maxHeight: '128px',
              }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = '48px';
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />

            {/* Emoji button */}
            <button
              type='button'
              className='absolute right-3 bottom-3 text-white/60 hover:text-white transition-colors'
            >
              <Smile className='w-5 h-5' />
            </button>
          </div>

          {/* Send button */}
          <button
            type='submit'
            disabled={!message.trim()}
            className={`flex-shrink-0 w-12 h-12 flex items-center justify-center transition-all duration-300 ${
              message.trim()
                ? 'bg-orange-500 text-black hover:bg-orange-600'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            <Send className='w-5 h-5' />
          </button>
        </form>
      </div>
    );
  }
);

MessageInput.displayName = 'MessageInput';

export default MessageInput;
