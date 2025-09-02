export interface HowItWorksStep {
  title: string;
  description: string;
}

export interface HowItWorksContent {
  user: HowItWorksStep[];
  artist: HowItWorksStep[];
}

export const howItWorksContent: HowItWorksContent = {
  user: [
    {
      title: "Discover Artists",
      description: "Browse through our curated collection of talented artists across various genres and styles. Find the perfect match for your event or project."
    },
    {
      title: "Book & Connect",
      description: "Send booking requests to your chosen artists. Negotiate terms, discuss requirements, and finalize details through our secure platform."
    },
    {
      title: "Enjoy & Rate",
      description: "Experience amazing performances and collaborations. Share your feedback and help other users discover great artists."
    }
  ],
  artist: [
    {
      title: "Create Profile",
      description: "Set up your artist profile with portfolio, pricing, and availability. Showcase your unique style and connect with potential clients."
    },
    {
      title: "Receive Bookings",
      description: "Get booking requests from users interested in your talent. Review requirements and negotiate terms to ensure the perfect collaboration."
    },
    {
      title: "Perform & Earn",
      description: "Deliver exceptional performances and build your reputation. Earn money while doing what you love and expanding your network."
    }
  ]
};
