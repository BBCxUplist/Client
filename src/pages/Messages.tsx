import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import ChatList from '@/components/messages/ChatList';
import ChatWindow from '@/components/messages/ChatWindow';
import { dummyChats, currentUser } from '@/constants/messagesData';
import type { Chat, Message } from '@/constants/messagesData';

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>(dummyChats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsMobileView(true);

    // Mark messages as read when chat is selected
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              unreadCount: 0,
              messages: chat.messages.map(msg => ({ ...msg, isRead: true })),
            }
          : chat
      )
    );
  };

  const handleSendMessage = (
    content: string,
    type: 'text' | 'file' | 'image' = 'text',
    file?: File
  ) => {
    if (!selectedChatId || !content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type,
      fileName: file?.name,
      fileSize: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : undefined,
      fileUrl: file ? URL.createObjectURL(file) : undefined,
      isRead: false,
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: type === 'file' ? `📎 ${file?.name}` : content,
              lastMessageTime: newMessage.timestamp,
            }
          : chat
      )
    );
  };

  const handleBackToList = () => {
    setIsMobileView(false);
    setSelectedChatId(null);
  };

  return (
    <div className='min-h-screen bg-neutral-950'>
      <Navbar />

      <div className='h-[calc(100vh-80px)] flex'>
        {/* Chat List - Hidden on mobile when chat is selected */}
        <div
          className={`${isMobileView ? 'hidden' : 'block'} lg:block w-full lg:w-1/3 xl:w-1/4 border-r border-white/10`}
        >
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            onChatSelect={handleChatSelect}
          />
        </div>

        {/* Chat Window - Hidden on mobile when no chat is selected */}
        <div
          className={`${!selectedChatId ? 'hidden' : 'block'} lg:block flex-1`}
        >
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onBack={handleBackToList}
              showBackButton={isMobileView}
            />
          ) : (
            <div className='hidden lg:flex h-full items-center justify-center bg-neutral-900/50'>
              <div className='text-center'>
                <div className='w-24 h-24 mx-auto mb-6 bg-white/5 border border-white/10 flex items-center justify-center'>
                  <svg
                    className='w-12 h-12 text-white/30'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-white mb-2 font-mondwest'>
                  Select a conversation
                </h3>
                <p className='text-white/60 text-sm'>
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
