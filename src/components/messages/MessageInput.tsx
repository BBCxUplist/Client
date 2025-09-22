import { useState, useRef } from 'react';

interface MessageInputProps {
  onSendMessage: (
    content: string,
    type?: 'text' | 'file' | 'image',
    file?: File
  ) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (file: File, type: 'file' | 'image' | 'audio') => {
    if (file) {
      const fileType = type === 'image' ? 'image' : 'file';
      onSendMessage(file.name, fileType, file);
      setIsFileMenuOpen(false);
    }
  };

  const triggerFileInput = (
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    inputRef.current?.click();
  };

  return (
    <div className='p-4 border-t border-white/10 bg-neutral-900'>
      {/* File upload inputs (hidden) */}
      <input
        ref={fileInputRef}
        type='file'
        accept='.pdf,.doc,.docx,.txt,.zip,.rar'
        className='hidden'
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file, 'file');
          e.target.value = '';
        }}
      />
      <input
        ref={imageInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file, 'image');
          e.target.value = '';
        }}
      />
      <input
        ref={audioInputRef}
        type='file'
        accept='audio/*'
        className='hidden'
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file, 'audio');
          e.target.value = '';
        }}
      />

      {/* File menu */}
      {isFileMenuOpen && (
        <div className='mb-4 bg-white/5 border border-white/10 p-3'>
          <div className='flex items-center justify-between mb-3'>
            <h4 className='text-sm font-semibold text-white'>Share a file</h4>
            <button
              onClick={() => setIsFileMenuOpen(false)}
              className='text-white/60 hover:text-white'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <div className='grid grid-cols-3 gap-3'>
            <button
              onClick={() => triggerFileInput(fileInputRef)}
              className='flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors'
            >
              <svg
                className='w-6 h-6 text-blue-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-xs text-white/80'>Document</span>
            </button>
            <button
              onClick={() => triggerFileInput(imageInputRef)}
              className='flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors'
            >
              <svg
                className='w-6 h-6 text-green-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-xs text-white/80'>Photo</span>
            </button>
            <button
              onClick={() => triggerFileInput(audioInputRef)}
              className='flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors'
            >
              <svg
                className='w-6 h-6 text-purple-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v6.114A4.369 4.369 0 005 11c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-xs text-white/80'>Audio</span>
            </button>
          </div>
        </div>
      )}

      {/* Message input */}
      <form onSubmit={handleSubmit} className='flex items-end gap-3'>
        {/* Attachment button */}
        <button
          type='button'
          onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
          className={`flex-shrink-0 p-3 border transition-all duration-300 ${
            isFileMenuOpen
              ? 'bg-orange-500 text-black border-orange-500'
              : 'bg-white/5 text-white/60 border-white/20 hover:bg-white/10 hover:text-white'
          }`}
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'
            />
          </svg>
        </button>

        {/* Text input */}
        <div className='flex-1 relative'>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Type a message...'
            rows={1}
            className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 pr-12 resize-none focus:border-orange-500 focus:outline-none transition-colors min-h-[48px] max-h-32 -mb-2'
            style={{
              height: 'auto',
              minHeight: '48px',
              maxHeight: '128px',
            }}
            onInput={e => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />

          {/* Emoji button */}
          <button
            type='button'
            className='absolute right-3 bottom-3 text-white/60 hover:text-white transition-colors'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </button>
        </div>

        {/* Send button */}
        <button
          type='submit'
          disabled={!message.trim()}
          className={`flex-shrink-0 p-3 transition-all duration-300 ${
            message.trim()
              ? 'bg-orange-500 text-black hover:bg-orange-600'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
