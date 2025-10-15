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
      title: 'Discover Artists',
      description:
        'Browse artists across location, genres and styles with the explore page - find their profiles, hear their music and like the ones that inspire you.',
    },
    {
      title: 'Connect & Book',
      description:
        'For event organizers, our featured artists are verified and bookable, with curated profiles that make it simple to find and hire the right talent for any stage. Send booking requests to your chosen artists. Negotiate terms, discuss requirements, and finalise details through our secure platform.',
    },
    {
      title: 'Enjoy & Share Your',
      description:
        'Experience unforgettable performances and collaborations. Celebrate the music, follow your favorite artists and share your discoveries with the community.',
    },
  ],
  artist: [
    {
      title: 'Create Profile',
      description:
        'Set up or claim your pre-made artist profile to showcase your portfolio, music, and unique style. You can choose to be discoverable only, letting fans and organizers explore your work - or request to become bookable, where once approved you’ll receive a featured profile and be ready for gigs. Link your profile on your social media to make it even easier for new audiences to find you.',
    },
    {
      title: 'Receive Bookings',
      description:
        'Get booking requests from users interested in your talent. Review requirements and negotiate terms to ensure the perfect collaboration.',
    },
    {
      title: 'Perform & Earn',
      description:
        'Deliver exceptional performances and build your reputation. Earn money while doing what you love and expanding your network.',
    },
  ],
};
