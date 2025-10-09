export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'audio';
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export const dummyChats: Chat[] = [
  {
    id: 'chat-1',
    participantId: 'divine',
    participantName: 'Divine',
    participantAvatar: '/artist/artist1.jpeg',
    lastMessage:
      'Looking forward to the event! When can we discuss the setlist?',
    lastMessageTime: '2024-12-22T14:30:00Z',
    unreadCount: 2,
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-1',
        senderName: 'You',
        content:
          "Hi Divine! I'm excited about booking you for our event. Can we discuss the details?",
        timestamp: '2024-12-22T10:00:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-2',
        senderId: 'divine',
        senderName: 'Divine',
        content:
          "Absolutely! I'm thrilled to be part of your event. What kind of venue and audience are we looking at?",
        timestamp: '2024-12-22T10:15:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-3',
        senderId: 'user-1',
        senderName: 'You',
        content:
          "It's a college fest with about 5000 students. The venue has great sound systems and we're expecting a very energetic crowd.",
        timestamp: '2024-12-22T10:20:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-4',
        senderId: 'user-1',
        senderName: 'You',
        content: "Here's the venue layout and technical specifications",
        timestamp: '2024-12-22T10:22:00Z',
        type: 'file',
        fileName: 'venue-specs.pdf',
        fileSize: '2.4 MB',
        fileUrl: '/files/venue-specs.pdf',
        isRead: true,
      },
      {
        id: 'msg-5',
        senderId: 'divine',
        senderName: 'Divine',
        content:
          "Perfect! That sounds like my kind of crowd. I'll bring the energy they deserve! 🔥",
        timestamp: '2024-12-22T14:00:00Z',
        type: 'text',
        isRead: false,
      },
      {
        id: 'msg-6',
        senderId: 'divine',
        senderName: 'Divine',
        content:
          'Looking forward to the event! When can we discuss the setlist?',
        timestamp: '2024-12-22T14:30:00Z',
        type: 'text',
        isRead: false,
      },
    ],
  },
  {
    id: 'chat-2',
    participantId: 'krsna',
    participantName: 'KR$NA',
    participantAvatar: '/artist/artist3.jpeg',
    lastMessage:
      'The contract looks good. When do you need the final confirmation?',
    lastMessageTime: '2024-12-22T12:45:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-7',
        senderId: 'user-1',
        senderName: 'You',
        content:
          "Hi KR$NA! We'd love to have you perform at our corporate event.",
        timestamp: '2024-12-22T09:00:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-8',
        senderId: 'krsna',
        senderName: 'KR$NA',
        content:
          'Thanks for reaching out! Tell me more about the event and your requirements.',
        timestamp: '2024-12-22T09:30:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-9',
        senderId: 'user-1',
        senderName: 'You',
        content:
          "It's a product launch event for a tech company. We need a 45-minute set for about 800 people.",
        timestamp: '2024-12-22T10:00:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-10',
        senderId: 'krsna',
        senderName: 'KR$NA',
        content:
          'Sounds interesting! I can definitely do that. Let me send you my performance contract.',
        timestamp: '2024-12-22T12:00:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-11',
        senderId: 'krsna',
        senderName: 'KR$NA',
        content: 'Performance Agreement - KR$NA',
        timestamp: '2024-12-22T12:15:00Z',
        type: 'file',
        fileName: 'krsna-performance-contract.pdf',
        fileSize: '1.8 MB',
        fileUrl: '/files/contract.pdf',
        isRead: true,
      },
      {
        id: 'msg-12',
        senderId: 'krsna',
        senderName: 'KR$NA',
        content:
          'The contract looks good. When do you need the final confirmation?',
        timestamp: '2024-12-22T12:45:00Z',
        type: 'text',
        isRead: true,
      },
    ],
  },
  {
    id: 'chat-3',
    participantId: 'emiway',
    participantName: 'Emiway',
    participantAvatar: '/artist/artist8.jpeg',
    lastMessage: "Bantai! Let's make this event legendary! 💯",
    lastMessageTime: '2024-12-21T18:20:00Z',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-13',
        senderId: 'user-1',
        senderName: 'You',

        content:
          "Hey Emiway! We're organizing a music festival and would love to have you as our headliner.",
        timestamp: '2024-12-21T16:00:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-14',
        senderId: 'emiway',
        senderName: 'Emiway',
        content:
          'Yo! A music festival sounds dope! Tell me more about the lineup and the vibe.',
        timestamp: '2024-12-21T17:00:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-15',
        senderId: 'user-1',
        senderName: 'You',
        content: 'Here are some photos from our previous events',
        timestamp: '2024-12-21T17:30:00Z',
        type: 'image',
        fileName: 'festival-photos.jpg',
        fileSize: '3.2 MB',
        fileUrl: '/images/festival-photos.jpg',
        isRead: true,
      },
      {
        id: 'msg-16',
        senderId: 'emiway',
        senderName: 'Emiway',
        content: "Bantai! Let's make this event legendary! 💯",
        timestamp: '2024-12-21T18:20:00Z',
        type: 'text',
        isRead: false,
      },
    ],
  },
  {
    id: 'chat-4',
    participantId: 'user-sarah',
    participantName: 'Sarah Johnson',
    participantAvatar: '/images/artistNotFound.jpeg',
    lastMessage: 'Thank you for the amazing performance! The crowd loved it!',
    lastMessageTime: '2024-12-20T22:30:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-17',
        senderId: 'user-sarah',
        senderName: 'Sarah Johnson',
        content:
          "Hi! I saw your performance last week and I'd love to book you for my wedding reception.",
        timestamp: '2024-12-20T14:00:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-18',
        senderId: 'user-1',
        senderName: 'You',
        content:
          "Thank you so much! I'd be honored to perform at your wedding. When is the date?",
        timestamp: '2024-12-20T15:00:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-19',
        senderId: 'user-sarah',
        senderName: 'Sarah Johnson',
        content:
          "It's on March 15th, 2025. We're expecting about 200 guests. Would you be available?",
        timestamp: '2024-12-20T16:00:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-20',
        senderId: 'user-1',
        senderName: 'You',
        content: 'Let me check my calendar and get back to you by tomorrow!',
        timestamp: '2024-12-20T18:00:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-21',
        senderId: 'user-sarah',
        senderName: 'Sarah Johnson',
        content: 'Thank you for the amazing performance! The crowd loved it!',
        timestamp: '2024-12-20T22:30:00Z',
        type: 'text',
        isRead: true,
      },
    ],
  },
  {
    id: 'chat-5',
    participantId: 'king',
    participantName: 'King',
    participantAvatar: '/artist/artist10.jpeg',
    lastMessage:
      "I'm excited to work with you! Let's create something amazing.",
    lastMessageTime: '2024-12-19T20:15:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-22',
        senderId: 'user-1',
        senderName: 'You',
        content:
          "Hi King! We're planning a collaboration event and would love to have you involved.",
        timestamp: '2024-12-19T18:00:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-23',
        senderId: 'king',
        senderName: 'King',
        content:
          'Hey! Thanks for thinking of me. What kind of collaboration are we talking about?',
        timestamp: '2024-12-19T19:00:00Z',
        type: 'text',
        isRead: true,
      },
      {
        id: 'msg-24',
        senderId: 'king',
        senderName: 'King',
        content:
          "I'm excited to work with you! Let's create something amazing.",
        timestamp: '2024-12-19T20:15:00Z',
        type: 'text',
        isRead: true,
      },
    ],
  },
];

export const currentUser = {
  id: 'user-1',
  name: 'You',
  avatar: '/images/artistNotFound.jpeg',
  type: 'user' as const,
};
