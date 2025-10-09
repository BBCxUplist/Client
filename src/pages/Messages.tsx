import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuthStatus } from '@/hooks/auth'; // <- your react-query hook set
import Navbar from '@/components/landing/Navbar';
import ChatList from '@/components/messages/ChatList';
import ChatWindow from '@/components/messages/ChatWindow';
import type { Chat, Message } from '@/constants/messagesData';

// --- Env + Helpers --------------------------------------------------------
const WS_URL = import.meta.env.VITE_WS_URL as string;
const API_URL = import.meta.env.VITE_API_URL as string;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isUuid = (v?: string | null) => !!v && UUID_RE.test(v);

// Map server message row -> UI message
function mapServerMsgToFrontend(saved: any, meId: string): Message {
  return {
    id: String(saved.id ?? `msg-${Date.now()}`),
    senderId: saved.senderId,
    senderName: saved.senderName || (saved.senderId === meId ? 'You' : 'User'),
    content: saved.text,
    timestamp: new Date(saved.createdAt || Date.now()).toISOString(),
    type: 'text',
    isRead: saved.senderId === meId,
  };
}

type ArtistLite = {
  id?: string;
  username: string;
  displayName: string;
  avatar?: string;
};

// ------------------ API helpers ------------------
// All requests must include ?meId=<UUID> per backend contract.
async function startOrGetConversation(myId: string, peerId: string) {
  const res = await fetch(`${API_URL}/messages/start?meId=${encodeURIComponent(myId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ peerId }),
  });
  if (!res.ok) throw new Error('failed_to_start_conversation');
  const j = await res.json();
  return j.conversation as { id: string; createdAt: string };
}

async function fetchHistory(
  myId: string,
  conversationId: string,
  before?: string,
  limit = 30,
) {
  const url = new URL(`${API_URL}/messages/history`);
  url.searchParams.set('meId', myId);
  url.searchParams.set('conversationId', conversationId);
  if (before) url.searchParams.set('before', before);
  url.searchParams.set('limit', String(limit));
  const res = await fetch(url);
  if (!res.ok) throw new Error('failed_to_fetch_history');
  return res.json() as Promise<{
    conversationId: string;
    items: any[];
    nextBefore: string | null;
    hasMore: boolean;
  }>;
}

async function fetchConversations(myId: string) {
  const url = new URL(`${API_URL}/messages/conversations`);
  url.searchParams.set('meId', myId);
  const res = await fetch(url);
  if (!res.ok) throw new Error('failed_to_fetch_conversations');
  return res.json() as Promise<{
    conversations: Array<{
      id: string;
      createdAt: string;
      participantName: string;
      participantAvatar?: string;
      participantId?: string;
      lastMessage?: string;
      lastMessageTime?: string;
    }>;
  }>;
}

// --- Component ------------------------------------------------------------
const Messages = () => {
  const { data: authData, isLoading: authLoading } = useAuthStatus();
  const meId = authData?.user?.id ?? '';
  const meName = authData?.user?.name ?? 'You';


  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [wsReady, setWsReady] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId) || null,
    [chats, selectedChatId]
  );

  // Initial conversations load
  useEffect(() => {
    if (authLoading) return;
    if (!isUuid(meId)) {
      setBanner('You need to be signed in with a valid account to use messages.');
      return;
    }
    (async () => {
      try {
        const data = await fetchConversations(meId);
        const initialChats = (data.conversations || []).map((c) => ({
          id: c.id,
          participantName: c.participantName || 'Conversation',
          participantAvatar: c.participantAvatar || '/images/artistNotFound.jpeg',
          lastMessage: c.lastMessage || 'Say hi 👋',
          lastMessageTime: c.lastMessageTime || new Date(c.createdAt).toISOString(),
          unreadCount: 0,
          messages: [],
          // @ts-ignore optional for UI
          otherUserId: c.participantId,
        })) as any;
        setChats(initialChats);
      } catch (e) {
        console.error(e);
        setBanner('Failed to load conversations.');
      }
    })();
  }, [authLoading, meId]);

  // WebSocket lifecycle
  useEffect(() => {
    if (!WS_URL || !isUuid(meId)) return;

    function connect() {
      // Server accepts ?token=<UUID>
      const url = `${WS_URL}?token=${encodeURIComponent(meId)}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.addEventListener('open', () => {
        setWsReady(true);
        if (selectedChatId && isUuid(selectedChatId)) {
          ws.send(JSON.stringify({ type: 'join', conversationId: selectedChatId }));
        }
      });

      ws.addEventListener('message', (evt) => {
        try {
          const pkt = JSON.parse(evt.data);

          if (pkt.type === 'connected' || pkt.type === 'joined' || pkt.type === 'left') return;

          if (pkt.type === 'error') {
            console.warn('WS error payload:', pkt);
            setBanner(pkt?.error || 'WebSocket error.');
            return;
          }

          if (pkt.type === 'typing') {
            // Optionally surface typing UI
            return;
          }

          if (pkt.type === 'message' && pkt.message) {
            const saved = pkt.message;
            const convId = String(saved.conversationId);

            setChats((prev) => {
              const idx = prev.findIndex((c) => c.id === convId);
              const mapped = mapServerMsgToFrontend(saved, meId);

              if (idx === -1) {
                const participantName =
                  saved.senderId === meId ? 'New conversation' : mapped.senderName || 'Conversation';
                const newChat: Chat = {
                  id: convId,
                  participantName,
                  participantAvatar: '/images/artistNotFound.jpeg',
                  messages: [mapped],
                  lastMessage: mapped.content,
                  lastMessageTime: mapped.timestamp,
                  unreadCount: selectedChatId === convId ? 0 : 1,
                } as any;
                return [newChat, ...prev];
              }

              const isActive = selectedChatId === convId;
              const updated: Chat = {
                ...prev[idx],
                messages: [...prev[idx].messages, mapped],
                lastMessage: mapped.content,
                lastMessageTime: mapped.timestamp,
                unreadCount: isActive ? 0 : (prev[idx].unreadCount || 0) + 1,
              };
              const copy = [...prev];
              copy[idx] = updated;
              return copy;
            });
            return;
          }
        } catch (e) {
          console.error('Failed to parse WS message', e);
        }
      });

      ws.addEventListener('close', () => {
        setWsReady(false);
        wsRef.current = null;
        if (!reconnectTimer.current) {
          reconnectTimer.current = setTimeout(() => {
            reconnectTimer.current = null;
            connect();
          }, 1200);
        }
      });

      ws.addEventListener('error', (err) => {
        console.error('WS error', err);
        setBanner('WebSocket connection error.');
        ws.close();
      });
    }

    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WS_URL, meId]);

  // When switching chats: clear unread + JOIN room
  useEffect(() => {
    if (!selectedChatId) return;

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              unreadCount: 0,
              messages: chat.messages.map((m) => ({ ...m, isRead: true })),
            }
          : chat
      )
    );

    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN && isUuid(selectedChatId)) {
      ws.send(JSON.stringify({ type: 'join', conversationId: selectedChatId }));
    }
  }, [selectedChatId]);

  // Select chat
  const handleChatSelect = async (chatId: string) => {
    setSelectedChatId(chatId);
    setIsMobileView(true);

    // Lazy load history
    const chat = chats.find(c => c.id === chatId);
    if (chat && (!chat.messages || chat.messages.length === 0)) {
      try {
        const hist = await fetchHistory(meId, chatId);
        const mapped = hist.items.map((it) => mapServerMsgToFrontend(it, meId));
        setChats(prev => prev.map(c => c.id === chatId ? {
          ...c,
          messages: mapped,
          lastMessage: mapped[mapped.length - 1]?.content || c.lastMessage,
          lastMessageTime: mapped[mapped.length - 1]?.timestamp || c.lastMessageTime,
        } : c));
      } catch (e) {
        console.error(e);
        setBanner('Failed to load message history.');
      }
    }
  };

  // Send message
  const handleSendMessage = async (
    content: string,
    type: 'text' | 'file' | 'image' = 'text',
    file?: File
  ) => {
    if (!selectedChatId || !content.trim() || !isUuid(selectedChatId) || !wsRef.current) return;

    const optimistic: Message = {
      id: `msg-${Date.now()}`,
      senderId: meId,
      senderName: meName,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type,
      fileName: file?.name,
      fileSize: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : undefined,
      fileUrl: file ? URL.createObjectURL(file) : undefined,
      isRead: true,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, optimistic],
              lastMessage: type === 'file' ? `📎 ${file?.name}` : optimistic.content,
              lastMessageTime: optimistic.timestamp,
            }
          : chat
      )
    );

    // Server derives receiver from conversation participants
    const ws = wsRef.current;
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'message',
          conversationId: selectedChatId,
          text: content.trim(),
          metadata: type !== 'text' ? { kind: type, name: file?.name, size: file?.size } : undefined,
        })
      );
    }
  };

  const handleBackToList = () => {
    setIsMobileView(false);
    setSelectedChatId(null);
  };

  // Create/open a chat by starting/looking up the 1:1 conversation
  const handleCreateNewChat = async (participant: ArtistLite) => {
    if (!participant?.id || !isUuid(participant.id)) {
      setBanner('Selected user is missing a valid id.');
      return;
    }
    try {
      const conv = await startOrGetConversation(meId, participant.id);

      // Join room (flat shape)
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'join', conversationId: conv.id }));
      }

      // Fetch recent history
      const hist = await fetchHistory(meId, conv.id);
      const mappedMsgs: Message[] = hist.items.map((saved: any) => mapServerMsgToFrontend(saved, meId));
      const nowIso = new Date().toISOString();

      const newChat: Chat = {
        id: conv.id,
        participantName: participant.displayName || participant.username,
        participantAvatar: participant.avatar || '/images/artistNotFound.jpeg',
        lastMessage: mappedMsgs[mappedMsgs.length - 1]?.content || 'Say hi 👋',
        lastMessageTime: mappedMsgs[mappedMsgs.length - 1]?.timestamp || nowIso,
        unreadCount: 0,
        messages: mappedMsgs,
        // @ts-ignore optional for your UI
        otherUserId: participant.id,
        // @ts-ignore optional for your UI
        participants: [
          { id: meId, name: meName },
          { id: participant.id, name: participant.displayName || participant.username, avatar: participant.avatar },
        ],
      } as any;

      setChats((prev) => {
        const exists = prev.find((c) => c.id === conv.id);
        if (exists) return prev;
        return [newChat, ...prev];
      });
      setSelectedChatId(conv.id);
      setIsMobileView(true);
    } catch (e) {
      console.error(e);
      setBanner('Could not start conversation.');
    }
  };

  // Load older history
  const loadOlder = async (conversationId: string) => {
    const chat = chats.find(c => c.id === conversationId);
    if (!chat) return;
    const oldest = chat.messages[0]?.timestamp;
    try {
      const hist = await fetchHistory(meId, conversationId, oldest);
      const older = hist.items.map((saved: any) => mapServerMsgToFrontend(saved, meId));
      if (!older.length) return;
      setChats(prev => prev.map(c => c.id === conversationId
        ? { ...c, messages: [...older, ...c.messages] }
        : c
      ));
    } catch (e) {
      console.error(e);
      setBanner('Failed to load older messages.');
    }
  };

  // Typing indicator
  const sendTyping = (isTyping: boolean) => {
    if (!selectedChatId || !wsRef.current || !isUuid(selectedChatId)) return;
    const ws = wsRef.current;
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'typing',
        conversationId: selectedChatId,
        isTyping,
      }));
    }
  };

  return (
    <div className='min-h-screen bg-neutral-950'>
      <Navbar />

      {/* Inline banner (no alerts, no prompts) */}
      {banner && (
        <div className="bg-orange-500/10 border border-orange-500/40 text-orange-300 px-4 py-2 text-sm flex items-center justify-between">
          <span>{banner}</span>
          <button
            className="text-orange-300/80 hover:text-orange-200"
            onClick={() => setBanner(null)}
          >
            ✕
          </button>
        </div>
      )}

      <div className='h-[calc(100vh-80px)] flex'>
        {/* Chat List - Hidden on mobile when chat is selected */}
        <div
          className={`${isMobileView ? 'hidden' : 'block'} lg:block w-full lg:w-1/3 xl:w-1/4 border-r border-white/10`}
        >
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            onChatSelect={handleChatSelect}
            onCreateNewChat={handleCreateNewChat}
          />
        </div>

        {/* Chat Window - Hidden on mobile when no chat is selected */}
        <div className={`${!selectedChatId ? 'hidden' : 'block'} lg:block flex-1`}>
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              currentUser={{ id: meId, name: meName } as any}
              onSendMessage={handleSendMessage}
              onBack={handleBackToList}
              showBackButton={isMobileView}
              onLoadOlder={() => loadOlder(selectedChat.id)}
              onTypingStart={() => sendTyping(true)}
              onTypingEnd={() => sendTyping(false)}
            />
          ) : (
            <div className='hidden lg:flex h-full items-center justify-center texture-bg'>
              <div className='text-center'>
                <div className='w-24 h-24 mx-auto mb-6 bg-white/5 border border-white/10 flex items-center justify-center'>
                  <svg className='w-12 h-12 text-white/30' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-white mb-2 font-mondwest'>Select a conversation</h3>
                <p className='text-white/60 text-sm'>Choose a chat from the sidebar to start messaging</p>
                <p className='mt-3 text-xs text-white/40'>
                  WS: {wsReady ? 'connected' : 'connecting…'}
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
