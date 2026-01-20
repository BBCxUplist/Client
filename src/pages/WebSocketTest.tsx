import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/stores/store';
import { useChatWebSocket } from '@/hooks/useChatWebSocket';
import { useConversations } from '@/hooks/useChat';
import type { Message } from '@/types/chat';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'sent' | 'received' | 'info' | 'error';
  data: any;
}

const WebSocketTest = () => {
  const { user } = useStore();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [customPayload, setCustomPayload] = useState(
    '{\n  "type": "message",\n  "conversationId": "",\n  "text": "Hello!"\n}'
  );
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations for easy selection
  const { data: conversationsData } = useConversations();

  const addLog = (type: LogEntry['type'], data: any) => {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type,
      data,
    };
    setLogs(prev => [...prev, entry]);
  };

  const {
    isConnected,
    connectionStatus,
    readyState,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTypingIndicator,
  } = useChatWebSocket({
    onMessage: (message: Message) => {
      addLog('received', { event: 'message', message });
    },
    onTyping: (conversationId, userId, isTyping) => {
      addLog('received', { event: 'typing', conversationId, userId, isTyping });
    },
    onError: (error, code) => {
      addLog('error', { event: 'error', error, code });
    },
  });

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Log connection status changes
  useEffect(() => {
    addLog('info', {
      event: 'connectionStatusChange',
      status: connectionStatus,
      readyState,
    });
  }, [connectionStatus, readyState]);

  const handleJoinConversation = () => {
    if (!selectedConversationId) return;
    addLog('sent', { action: 'join', conversationId: selectedConversationId });
    joinConversation(selectedConversationId);
  };

  const handleLeaveConversation = () => {
    if (!selectedConversationId) return;
    addLog('sent', { action: 'leave', conversationId: selectedConversationId });
    leaveConversation(selectedConversationId);
  };

  const handleSendMessage = () => {
    if (!selectedConversationId || !messageText.trim()) return;
    addLog('sent', {
      action: 'message',
      conversationId: selectedConversationId,
      text: messageText,
    });
    sendMessage(selectedConversationId, messageText.trim());
    setMessageText('');
  };

  const handleSendTyping = (isTyping: boolean) => {
    if (!selectedConversationId) return;
    addLog('sent', {
      action: 'typing',
      conversationId: selectedConversationId,
      isTyping,
    });
    sendTypingIndicator(selectedConversationId, isTyping);
  };

  const handleSendCustomPayload = () => {
    try {
      const payload = JSON.parse(customPayload);
      addLog('sent', { action: 'custom', payload });
      // Note: This would require exposing sendJsonMessage from the hook
      // For now, we'll just log it
      addLog('info', {
        message:
          'Custom payload logged (direct send requires hook modification)',
      });
    } catch (e) {
      addLog('error', { message: 'Invalid JSON payload', error: String(e) });
    }
  };

  const clearLogs = () => setLogs([]);

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'sent':
        return 'text-blue-400';
      case 'received':
        return 'text-green-400';
      case 'info':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  const getLogBgColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'sent':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'received':
        return 'bg-green-500/10 border-green-500/30';
      case 'info':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/10 border-red-500/30';
      default:
        return 'bg-white/10 border-white/30';
    }
  };

  if (!user) {
    return (
      <div className='min-h-screen bg-neutral-950 flex items-center justify-center'>
        <div className='text-white text-center'>
          <h1 className='text-2xl font-bold mb-4'>WebSocket Test Page</h1>
          <p className='text-white/60'>
            Please log in to test WebSocket connections
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-950 text-white p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-2xl font-bold'>WebSocket Test Page</h1>
            <p className='text-white/60 text-sm mt-1'>
              Debug and test WebSocket connections
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                isConnected
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
              />
              {connectionStatus}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className='bg-white/5 border border-white/10 rounded-lg p-4 mb-6'>
          <h2 className='text-sm font-semibold text-white/60 mb-2'>
            Current User
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
            <div>
              <span className='text-white/40'>ID:</span>
              <span className='ml-2 font-mono text-xs bg-white/10 px-2 py-0.5 rounded'>
                {user.id}
              </span>
            </div>
            <div>
              <span className='text-white/40'>Name:</span>
              <span className='ml-2'>
                {user.name || user.displayName || 'N/A'}
              </span>
            </div>
            <div>
              <span className='text-white/40'>Email:</span>
              <span className='ml-2'>{user.email || 'N/A'}</span>
            </div>
            <div>
              <span className='text-white/40'>Role:</span>
              <span className='ml-2'>{user.role || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Controls Panel */}
          <div className='space-y-4'>
            {/* Conversation Selection */}
            <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
              <h2 className='text-sm font-semibold text-white/60 mb-3'>
                Conversation
              </h2>
              <select
                value={selectedConversationId}
                onChange={e => setSelectedConversationId(e.target.value)}
                className='w-full bg-neutral-800 border border-white/20 rounded px-3 py-2 text-sm mb-3'
              >
                <option value=''>Select a conversation...</option>
                {conversationsData?.conversations.map(conv => (
                  <option key={conv.id} value={conv.id}>
                    {conv.participantName} ({conv.id.slice(0, 8)}...)
                  </option>
                ))}
              </select>
              <div className='flex gap-2'>
                <button
                  onClick={handleJoinConversation}
                  disabled={!selectedConversationId}
                  className='flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-600/30 disabled:cursor-not-allowed px-3 py-2 rounded text-sm font-medium transition-colors'
                >
                  Join
                </button>
                <button
                  onClick={handleLeaveConversation}
                  disabled={!selectedConversationId}
                  className='flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-600/30 disabled:cursor-not-allowed px-3 py-2 rounded text-sm font-medium transition-colors'
                >
                  Leave
                </button>
              </div>
            </div>

            {/* Send Message */}
            <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
              <h2 className='text-sm font-semibold text-white/60 mb-3'>
                Send Message
              </h2>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder='Type a message...'
                  className='flex-1 bg-neutral-800 border border-white/20 rounded px-3 py-2 text-sm'
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!selectedConversationId || !messageText.trim()}
                  className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/30 disabled:cursor-not-allowed px-4 py-2 rounded text-sm font-medium transition-colors'
                >
                  Send
                </button>
              </div>
            </div>

            {/* Typing Indicator */}
            <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
              <h2 className='text-sm font-semibold text-white/60 mb-3'>
                Typing Indicator
              </h2>
              <div className='flex gap-2'>
                <button
                  onClick={() => handleSendTyping(true)}
                  disabled={!selectedConversationId}
                  className='flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/30 disabled:cursor-not-allowed px-3 py-2 rounded text-sm font-medium transition-colors'
                >
                  Start Typing
                </button>
                <button
                  onClick={() => handleSendTyping(false)}
                  disabled={!selectedConversationId}
                  className='flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/30 disabled:cursor-not-allowed px-3 py-2 rounded text-sm font-medium transition-colors'
                >
                  Stop Typing
                </button>
              </div>
            </div>

            {/* Custom Payload */}
            <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
              <h2 className='text-sm font-semibold text-white/60 mb-3'>
                Custom JSON Payload
              </h2>
              <textarea
                value={customPayload}
                onChange={e => setCustomPayload(e.target.value)}
                className='w-full bg-neutral-800 border border-white/20 rounded px-3 py-2 text-sm font-mono h-32 mb-3'
                spellCheck={false}
              />
              <button
                onClick={handleSendCustomPayload}
                className='w-full bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded text-sm font-medium transition-colors'
              >
                Log Custom Payload
              </button>
            </div>
          </div>

          {/* Logs Panel */}
          <div className='bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col h-[700px]'>
            <div className='flex items-center justify-between mb-3'>
              <h2 className='text-sm font-semibold text-white/60'>
                Event Logs
              </h2>
              <div className='flex gap-2'>
                <span className='text-xs text-white/40'>
                  {logs.length} events
                </span>
                <button
                  onClick={clearLogs}
                  className='text-xs text-red-400 hover:text-red-300 transition-colors'
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className='flex gap-4 mb-3 text-xs'>
              <div className='flex items-center gap-1'>
                <div className='w-2 h-2 rounded-full bg-blue-400' />
                <span className='text-white/60'>Sent</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='w-2 h-2 rounded-full bg-green-400' />
                <span className='text-white/60'>Received</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='w-2 h-2 rounded-full bg-yellow-400' />
                <span className='text-white/60'>Info</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='w-2 h-2 rounded-full bg-red-400' />
                <span className='text-white/60'>Error</span>
              </div>
            </div>

            {/* Log entries */}
            <div className='flex-1 overflow-y-auto space-y-2 font-mono text-xs'>
              {logs.length === 0 ? (
                <div className='text-white/40 text-center py-8'>
                  No events logged yet. Connect and interact to see WebSocket
                  events.
                </div>
              ) : (
                logs.map(log => (
                  <div
                    key={log.id}
                    className={`p-2 rounded border ${getLogBgColor(log.type)}`}
                  >
                    <div className='flex items-center justify-between mb-1'>
                      <span
                        className={`font-semibold uppercase ${getLogColor(log.type)}`}
                      >
                        {log.type}
                      </span>
                      <span className='text-white/40'>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className='text-white/80 whitespace-pre-wrap break-all overflow-x-auto'>
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* Connection Details */}
        <div className='mt-6 bg-white/5 border border-white/10 rounded-lg p-4'>
          <h2 className='text-sm font-semibold text-white/60 mb-3'>
            Connection Details
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
            <div>
              <span className='text-white/40'>Ready State:</span>
              <span className='ml-2 font-mono'>{readyState}</span>
            </div>
            <div>
              <span className='text-white/40'>Status:</span>
              <span className='ml-2'>{connectionStatus}</span>
            </div>
            <div>
              <span className='text-white/40'>Connected:</span>
              <span
                className={`ml-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}
              >
                {isConnected ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className='text-white/40'>Selected Conv:</span>
              <span className='ml-2 font-mono text-xs'>
                {selectedConversationId
                  ? selectedConversationId.slice(0, 12) + '...'
                  : 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketTest;
