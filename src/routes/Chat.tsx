import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ArrowLeft } from 'lucide-react';
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
                  <div className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
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
                  <p className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
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
              className="flex-1 px-3 py-2 border border-input rounded-md bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
