import {
  FileText,
  Image,
  Music,
  Video,
  File,
  Download,
  Play,
} from 'lucide-react';
import type { Message } from '@/constants/messagesData';

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
  const handleFileDownload = (fileUrl: string, fileName: string) => {
    // In a real app, this would handle file downloads
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return <FileText className='w-6 h-6 text-red-400' />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className='w-6 h-6 text-green-400' />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <Music className='w-6 h-6 text-purple-400' />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className='w-6 h-6 text-blue-400' />;
      default:
        return <File className='w-6 h-6 text-gray-400' />;
    }
  };

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
              src={message.senderAvatar}
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
          {/* Text message */}
          {message.type === 'text' && (
            <p className='text-sm'>{message.content}</p>
          )}

          {/* File message */}
          {message.type === 'file' && (
            <div
              onClick={() =>
                message.fileUrl &&
                message.fileName &&
                handleFileDownload(message.fileUrl, message.fileName)
              }
              className='flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity'
            >
              {message.fileName && getFileIcon(message.fileName)}
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold truncate'>
                  {message.fileName}
                </p>
                <p className='text-xs opacity-70'>{message.fileSize}</p>
              </div>
              <Download className='w-4 h-4 flex-shrink-0' />
            </div>
          )}

          {/* Image message */}
          {message.type === 'image' && (
            <div className='space-y-2'>
              {message.content && <p className='text-sm'>{message.content}</p>}
              <img
                src={message.fileUrl}
                alt={message.fileName}
                className='max-w-full h-auto max-h-64 object-cover border border-white/20'
                onClick={() =>
                  message.fileUrl && window.open(message.fileUrl, '_blank')
                }
              />
              <div className='flex items-center gap-2 text-xs opacity-70'>
                <span>{message.fileName}</span>
                <span>•</span>
                <span>{message.fileSize}</span>
              </div>
            </div>
          )}

          {/* Audio message */}
          {message.type === 'audio' && (
            <div className='flex items-center gap-3'>
              <Music className='w-6 h-6 text-purple-400' />
              <div className='flex-1'>
                <p className='text-sm font-semibold'>{message.fileName}</p>
                <p className='text-xs opacity-70'>{message.fileSize}</p>
              </div>
              <button className='p-2 bg-white/10 hover:bg-white/20 transition-colors'>
                <Play className='w-4 h-4' />
              </button>
            </div>
          )}
        </div>

        {/* Read status (for current user's messages) */}
        {isCurrentUser && (
          <div className='text-right mt-1'>
            <span
              className={`text-xs ${message.isRead ? 'text-blue-400' : 'text-white/50'}`}
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
