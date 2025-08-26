import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { 
  MessageCircle, 
  Search, 
  Send, 
  MoreVertical,
  Phone,
  Video,
  Image,
  Paperclip,
  Smile,
  ArrowLeft
} from 'lucide-react';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';
import { useArtistById } from '@/hooks/useArtists';
import { EmptyState } from '@/components/common/EmptyState';

export const Chat = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const { isAuthenticated, currentUserId } = useAuth();
  const currentUser = useCurrentUser();
  const [message, setMessage] = useState('');
  const [activeThread, setActiveThread] = useState(threadId || 'thread1');

  // Dummy conversations data
  const conversations = [
    {
      id: 'thread1',
      artistId: '1',
      lastMessage: 'Looking forward to our event!',
      lastMessageTime: '2 hours ago',
      unreadCount: 2,
      status: 'confirmed'
    },
    {
      id: 'thread2',
      artistId: '2',
      lastMessage: 'What time works best for you?',
      lastMessageTime: '1 day ago',
      unreadCount: 0,
      status: 'negotiating'
    },
    {
      id: 'thread3',
      artistId: '3',
      lastMessage: 'Thanks for the great performance!',
      lastMessageTime: '3 days ago',
      unreadCount: 0,
      status: 'completed'
    },
    {
      id: 'thread4',
      artistId: '4',
      lastMessage: 'I can do that date, no problem.',
      lastMessageTime: '1 week ago',
      unreadCount: 0,
      status: 'completed'
    },
    {
      id: 'thread5',
      artistId: '5',
      lastMessage: 'Let me check my availability...',
      lastMessageTime: '1 week ago',
      unreadCount: 1,
      status: 'pending'
    }
  ];

  // Dummy messages for the active thread
  const messages = [
    {
      id: '1',
      senderId: '1',
      text: 'Hi! I\'m interested in booking you for my event.',
      timestamp: '2024-02-10T10:00:00Z',
      isUser: false
    },
    {
      id: '2',
      senderId: currentUserId,
      text: 'Great! What kind of event are you planning?',
      timestamp: '2024-02-10T10:05:00Z',
      isUser: true
    },
    {
      id: '3',
      senderId: '1',
      text: 'It\'s a corporate party, about 50 people. Looking for some live music.',
      timestamp: '2024-02-10T10:10:00Z',
      isUser: false
    },
    {
      id: '4',
      senderId: currentUserId,
      text: 'Perfect! I can definitely help with that. What date are you thinking?',
      timestamp: '2024-02-10T10:15:00Z',
      isUser: true
    },
    {
      id: '5',
      senderId: '1',
      text: 'Looking forward to our event!',
      timestamp: '2024-02-10T12:00:00Z',
      isUser: false
    }
  ];

  const currentConversation = conversations.find(c => c.id === activeThread);
  const currentArtist = useArtistById(currentConversation?.artistId || '');

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={MessageCircle}
            title="Authentication Required"
            description="Please sign in to view your messages."
          />
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negotiating':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'completed':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* Sidebar - Conversations List */}
        <div className="w-80 border-r border-neutral-200 bg-neutral-50">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200">
            <h1 className="text-xl font-bold text-neutral-800 mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl bg-white text-neutral-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="overflow-y-auto h-[calc(100vh-120px)]">
            {conversations.map((conversation) => {
              const artist = useArtistById(conversation.artistId);
              if (!artist) return null;

              return (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: '#f8f9fa' }}
                  className={`p-4 border-b border-neutral-200 cursor-pointer transition-colors ${
                    activeThread === conversation.id ? 'bg-orange-50 border-r-2 border-r-orange-500' : ''
                  }`}
                  onClick={() => setActiveThread(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={artist.avatar || `https://ui-avatars.com/api/?name=${artist.name}&size=50&background=random`}
                      alt={artist.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-neutral-800 truncate">{artist.name}</h3>
                        <span className="text-xs text-neutral-500">{conversation.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-neutral-600 truncate mb-2">{conversation.lastMessage}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(conversation.status)}`}>
                          {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation && currentArtist ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/dashboard"
                      className="lg:hidden p-2 hover:bg-neutral-100 rounded-xl transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-neutral-600" />
                    </Link>
                    <img
                      src={currentArtist.avatar || `https://ui-avatars.com/api/?name=${currentArtist.name}&size=50&background=random`}
                      alt={currentArtist.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h2 className="font-semibold text-neutral-800">{currentArtist.name}</h2>
                      <p className="text-sm text-neutral-600">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                      <Phone className="h-5 w-5 text-neutral-600" />
                    </button>
                    <button className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                      <Video className="h-5 w-5 text-neutral-600" />
                    </button>
                    <button className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                      <MoreVertical className="h-5 w-5 text-neutral-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.isUser 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-neutral-800 border border-neutral-200'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.isUser ? 'text-orange-100' : 'text-neutral-500'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-neutral-200 bg-white">
                <div className="flex items-center space-x-3">
                  <button className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                    <Paperclip className="h-5 w-5 text-neutral-600" />
                  </button>
                  <button className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                    <Image className="h-5 w-5 text-neutral-600" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 border border-neutral-200 rounded-2xl bg-white text-neutral-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Smile className="h-5 w-5 text-neutral-600" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={MessageCircle}
                title="No conversation selected"
                description="Choose a conversation from the sidebar to start messaging."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
