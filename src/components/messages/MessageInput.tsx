import { useState, useRef } from 'react';
import {
  Paperclip,
  Smile,
  Send,
  X,
  FileText,
  Image,
  Music,
} from 'lucide-react';

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
              <X className='w-4 h-4' />
            </button>
          </div>
          <div className='grid grid-cols-3 gap-3'>
            <button
              onClick={() => triggerFileInput(fileInputRef)}
              className='flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors'
            >
              <FileText className='w-6 h-6 text-blue-400' />
              <span className='text-xs text-white/80'>Document</span>
            </button>
            <button
              onClick={() => triggerFileInput(imageInputRef)}
              className='flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors'
            >
              <Image className='w-6 h-6 text-green-400' />
              <span className='text-xs text-white/80'>Photo</span>
            </button>
            <button
              onClick={() => triggerFileInput(audioInputRef)}
              className='flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors'
            >
              <Music className='w-6 h-6 text-purple-400' />
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
          <Paperclip className='w-5 h-5' />
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
            <Smile className='w-5 h-5' />
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
          <Send className='w-5 h-5' />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
