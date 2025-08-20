import type { FAQ } from '@/constants/types';

export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How does the booking process work?',
    answer: 'Browse artists, select your preferred date and time, pay the initial deposit through our secure escrow system, and wait for the artist to accept your booking. Once accepted, you can communicate directly through our chat system.',
    category: 'booking',
  },
  {
    id: 'faq-2',     
    question: 'What is the escrow system?',
    answer: 'Our escrow system holds your payment securely until the event is completed. This ensures both parties are protected - you only pay when satisfied, and artists are guaranteed payment for their work.',
    category: 'payment',
  },
  {
    id: 'faq-3',
    question: 'Can I cancel a booking?',
    answer: 'Yes, you can cancel a booking up to 48 hours before the event. Cancellation fees may apply depending on the artist\'s policy and how close to the event date you cancel.',
    category: 'booking',
  },
  {
    id: 'faq-4',
    question: 'How do I become an approved artist?',
    answer: 'Submit an application with your portfolio, experience, and references. Our team will review your application and may request additional information. Once approved, you can start accepting bookings.',
    category: 'artists',
  },
  {
    id: 'faq-5',
    question: 'What if I have a dispute with an artist?',
    answer: 'Contact our support team immediately. We have a dispute resolution process in place to handle conflicts between users and artists fairly.',
    category: 'support',
  },
  {
    id: 'faq-6',
    question: 'Are there any fees for using UPlist?',
    answer: 'UPlist charges a small service fee on successful bookings. This helps us maintain the platform, provide customer support, and ensure secure transactions.',
    category: 'payment',
  },
];
