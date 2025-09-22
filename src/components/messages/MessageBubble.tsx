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
        return (
          <svg
            className='w-6 h-6 text-red-400'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
              clipRule='evenodd'
            />
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
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
        );
      case 'mp3':
      case 'wav':
      case 'ogg':
        return (
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
        );
      case 'mp4':
      case 'avi':
      case 'mov':
        return (
          <svg
            className='w-6 h-6 text-blue-400'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H3v4h10v-4z'
              clipRule='evenodd'
            />
          </svg>
        );
      default:
        return (
          <svg
            className='w-6 h-6 text-gray-400'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z'
              clipRule='evenodd'
            />
          </svg>
        );
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
              <svg
                className='w-4 h-4 flex-shrink-0'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
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
              <div className='flex-1'>
                <p className='text-sm font-semibold'>{message.fileName}</p>
                <p className='text-xs opacity-70'>{message.fileSize}</p>
              </div>
              <button className='p-2 bg-white/10 hover:bg-white/20 transition-colors'>
                <svg
                  className='w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                    clipRule='evenodd'
                  />
                </svg>
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
