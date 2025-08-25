import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, MessageCircle, User } from 'lucide-react';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';
import { useBookingById } from '@/hooks/useBookings';
import { useArtistById } from '@/hooks/useArtists';
import { EmptyState } from '@/components/common/EmptyState';
import { formatDate } from '@/lib/utils';

export const Chat: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const { currentUserId } = useAuth();
  const currentUser = useCurrentUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      senderId: 'system',
      text: 'Chat thread created. You can now communicate about your booking.',
      timestamp: new Date().toISOString(),
    },
  ]);

  // Mock chat threads - in real app, this would come from an API
  const chatThreads = [
    {
      id: 'thread-1',
      artistId: 'artist-1',
      userId: 'user-1',
      bookingId: 'booking-1',
      lastMessage: 'Looking forward to the event!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: 'thread-2',
      artistId: 'artist-2',
      userId: 'user-1',
      bookingId: 'booking-2',
      lastMessage: 'What time should I arrive?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
  ];

  // If no threadId is provided, show chat list
  if (!threadId) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Messages</h1>
          
          {chatThreads.length > 0 ? (
            <div className="space-y-4">
              {chatThreads.map((thread) => {
                const booking = useBookingById(thread.bookingId);
                const artist = booking ? useArtistById(booking.artistId) : null;
                const user = booking ? useArtistById(booking.userId) : null;
                
                if (!booking || !artist || !user) return null;
                
                const otherParty = currentUser?.role === 'artist' ? user : artist;
                
                return (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => window.location.href = `/chat/${thread.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={otherParty.avatar || `https://ui-avatars.com/api/?name=${otherParty.name}&size=40&background=random`}
                        alt={otherParty.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{otherParty.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Booking for {formatDate(booking.date)} • ${booking.amount}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {thread.lastMessage}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(thread.lastMessageTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="No messages yet"
              description="You don't have any active chat threads. Start booking artists to begin conversations."
            />
          )}
        </div>
      </div>
    );
  }

  // Mock booking data - in real app, this would come from the threadId
  const booking = useBookingById('booking-1');
  const artist = booking ? useArtistById(booking.artistId) : null;
  const user = booking ? useArtistById(booking.userId) : null; // This should be getUserById

  if (!booking || !artist || !user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={ArrowLeft}
            title="Chat not found"
            description="The chat thread you're looking for doesn't exist."
          />
        </div>
      </div>
    );
  }

  const isArtist = currentUser?.role === 'artist';
  const otherParty = isArtist ? user : artist;

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUserId!,
      text: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center space-x-4">
            <img
              src={otherParty.avatar || `https://ui-avatars.com/api/?name=${otherParty.name}&size=40&background=random`}
              alt={otherParty.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="font-semibold text-foreground">{otherParty.name}</h1>
              <p className="text-sm text-muted-foreground">
                Booking for {formatDate(booking.date)} • ${booking.amount}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isOwnMessage = msg.senderId === currentUserId;
            const isSystemMessage = msg.senderId === 'system';

            if (isSystemMessage) {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm">
                    {msg.text}
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="bg-card border-t border-border p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
