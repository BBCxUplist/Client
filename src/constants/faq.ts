export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export const faqContent: FAQCategory[] = [
  {
    title: 'For Users',
    items: [
      {
        question: 'What is Uplist and how do I get started?',
        answer:
          'Uplist is a platform that connects talented artists with users looking to book performances, collaborations, or creative services. Simply create an account, browse our artist directory, and start connecting with artists that match your needs.',
      },
      {
        question: 'How do I book an artist and what if I need to cancel?',
        answer:
          "Browse our artist directory, select an artist you're interested in, and send them a booking request. You can discuss requirements, negotiate terms, and finalize details through our secure messaging system. Cancellation policies vary by artist, but most offer flexible options.",
      },
      {
        question: 'How do I know if an artist is reliable?',
        answer:
          'All artists on UPLIST are vetted and approved by our team before becoming bookable, ensuring high quality and professionalism. You can explore their portfolio, hear their music, and see how many likes they’ve received from the community.',
      },
    ],
  },
  {
    title: 'For Artists',
    items: [
      {
        question:
          'How do I create an artist profile and start receiving bookings?',
        answer:
          "Sign up as an artist, complete your profile with photos, bio and music. Request to be bookable, you can then add pricing, and availability. Our team will review and approve your profile to ensure quality standards. Once approved, you'll start receiving booking requests from interested clients. For select artists, Uplist offers talent representation to support their growth and connect them with the right opportunities.",
      },
      {
        question: 'What commission does Uplist take and how do I get paid?',
        answer:
          'Uplist charges a small platform fee on successful bookings to keep the platform running and provide dedicated support. Artists pay a 10% fee on each confirmed booking, while users pay a 5% surcharge on their total booking. All payments are processed securely through Uplist, and funds are released to artists once the event is completed and confirmed.',
      },
      {
        question:
          'What payment methods are accepted and how secure are transactions?',
        answer:
          'We accept major credit cards, debit cards, and other popular payment methods. All transactions use industry-standard encryption and secure payment gateways. We never store complete payment details on our servers, ensuring maximum security.',
      },
    ],
  },
];
