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
    title: "For Users",
    items: [
      {
        question: "What is Uplist and how do I get started?",
        answer: "Uplist is a platform that connects talented artists with users looking to book performances, collaborations, or creative services. Simply create an account, browse our artist directory, and start connecting with artists that match your needs."
      },
      {
        question: "How do I book an artist and what if I need to cancel?",
        answer: "Browse our artist directory, select an artist you're interested in, and send them a booking request. You can discuss requirements, negotiate terms, and finalize details through our secure messaging system. Cancellation policies vary by artist, but most offer flexible options."
      },
      {
        question: "How do I know if an artist is reliable?",
        answer: "All artists on Uplist are verified and rated by previous clients. You can read reviews, check their portfolio, and see their booking history to make an informed decision. Our platform ensures quality standards are maintained."
      }
    ]
  },
  {
    title: "For Artists",
    items: [
      {
        question: "How do I create an artist profile and start receiving bookings?",
        answer: "Sign up as an artist, complete your profile with photos, bio, pricing, and availability. Our team will review and approve your profile to ensure quality standards. Once approved, you'll start receiving booking requests from interested clients."
      },
      {
        question: "What commission does Uplist take and how do I get paid?",
        answer: "Uplist charges a small platform fee on successful bookings to maintain the platform and provide support. Payments are processed securely through our platform, and funds are released to your account once bookings are completed and confirmed."
      },
      {
        question: "What payment methods are accepted and how secure are transactions?",
        answer: "We accept major credit cards, debit cards, UPI, and other popular payment methods. All transactions use industry-standard encryption and secure payment gateways. We never store complete payment details on our servers, ensuring maximum security."
      }
    ]
  }
];
