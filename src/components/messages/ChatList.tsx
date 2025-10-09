import { useEffect, useMemo, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Chat } from '@/constants/messagesData';

export type ArtistLite = {
  id?: string;
  username: string;
  displayName: string;
  avatar?: string;
};

export type ChatListProps = {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void | Promise<void>;
  onCreateNewChat?: (p: ArtistLite) => void | Promise<void>;
};

const API_URL = import.meta.env.VITE_API_URL as string;

const ChatList = ({ chats, selectedChatId, onChatSelect, onCreateNewChat }: ChatListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<ArtistLite[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const filteredChats = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      chat =>
        chat.participantName.toLowerCase().includes(q) ||
        chat.lastMessage.toLowerCase().includes(q)
    );
  }, [chats, searchTerm]);

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) {
      setSuggestions([]);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    const handle = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setLoading(true);
      try {
        // Username exact
        const r1 = await fetch(
          `${API_URL}/artists/username/${encodeURIComponent(term)}`,
          { signal: ctrl.signal }
        );

        if (r1.ok) {
          const j = await r1.json();
          const a = (j?.data || j?.artist || j) as any;
          if (a && (a.username || a.displayName)) {
            setSuggestions([
              {
                id: a.id,
                username: a.username || term,
                displayName: a.displayName || a.username || term,
                avatar: a.avatar || a.profilePicture || a.imageUrl,
              },
            ]);
            setLoading(false);
            return;
          }
        }

        // Fallback search
        const r2 = await fetch(
          `${API_URL}/artists/search?q=${encodeURIComponent(term)}`,
          { signal: ctrl.signal }
        );

        if (r2.ok) {
          const j2 = await r2.json();
          const arr: any[] = j2?.data || j2?.artists || [];
          setSuggestions(
            arr
              .filter(Boolean)
              .slice(0, 6)
              .map((a: any) => ({
                id: a.id,
                username: a.username,
                displayName: a.displayName || a.username,
                avatar: a.avatar || a.profilePicture || a.imageUrl,
              }))
          );
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(handle);
  }, [searchTerm]);

  const handlePickSuggestion = async (a: ArtistLite) => {
    if (onCreateNewChat) await onCreateNewChat(a);
    setSuggestions([]);
    setSearchTerm('');
  };

  return (
    <div className='h-full flex flex-col bg-neutral-900'>
      {/* Header */}
      <div className='p-4 lg:p-6 border-b border-white/10'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='font-mondwest text-2xl lg:text-3xl font-bold text-white'>
            Messages
          </h1>
          <div className='flex items-center gap-2'>
            <span className='text-white/60 text-sm'>
              {chats.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0)} unread
            </span>
          </div>
        </div>

        {/* Search + suggestions */}
        <div className='relative'>
          <input
            type='text'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Search by name or @username…'
            className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 pl-10 focus:border-orange-500 focus:outline-none transition-colors'
          />
          <svg
            className='pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>

          {searchTerm && (suggestions.length > 0 || loading) && (
            <div className='absolute z-20 mt-1 w-full max-h-72 overflow-y-auto bg-neutral-800 border border-white/10 shadow-xl'>
              {loading && <div className='px-3 py-2 text-xs text-white/60'>Searching…</div>}
              {suggestions.map((s) => (
                <button
                  key={`${s.id || s.username}`}
                  onClick={() => handlePickSuggestion(s)}
                  className='w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-3'
                >
                  <img
                    src={s.avatar || '/images/artistNotFound.jpeg'}
                    onError={e => { (e.currentTarget as HTMLImageElement).src = '/images/artistNotFound.jpeg'; }}
                    className='w-8 h-8 object-cover border border-white/10'
                  />
                  <div className='min-w-0'>
                    <div className='text-white truncate'>{s.displayName}</div>
                    <div className='text-white/60 text-xs truncate'>@{s.username}</div>
                  </div>
                </button>
              ))}
              {!loading && suggestions.length === 0 && (
                <div className='px-3 py-2 text-xs text-white/60'>No results</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className='flex-1 overflow-y-auto'>
        {filteredChats.length === 0 ? (
          <div className='p-6 text-center'>
            <p className='text-white/60'>
              {searchTerm ? 'No conversations found' : 'No messages yet'}
            </p>
          </div>
        ) : (
          filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`p-4 border-b border-white/5 cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                selectedChatId === chat.id ? 'bg-orange-500/10 border-l-4 border-l-orange-500' : ''
              }`}
            >
              <div className='flex items-start gap-3'>
                <div className='flex-shrink-0'>
                  <img
                    src={chat.participantAvatar || '/images/artistNotFound.jpeg'}
                    alt={chat.participantName}
                    className='w-12 h-12 object-cover border border-white/20'
                    onError={e => { (e.currentTarget as HTMLImageElement).src = '/images/artistNotFound.jpeg'; }}
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between mb-1'>
                    <h3 className='font-semibold text-white truncate'>{chat.participantName}</h3>
                    <div className='flex items-center gap-2 flex-shrink-0'>
                      <span className='text-xs text-white/50'>{formatTime(chat.lastMessageTime)}</span>
                      {chat.unreadCount > 0 && (
                        <div className='bg-orange-500 text-black text-xs font-bold px-2 py-1 min-w-[20px] h-5 flex items-center justify-center'>
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-white' : 'text-white/60'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
