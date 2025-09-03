import { motion } from "framer-motion";
import type { Artist } from "@/types";

interface ReviewsTabProps {
  artist: Artist;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  review: string;
  date: string;
  event: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    review: "Absolutely incredible performance! The energy was electric and the crowd was completely mesmerized. Booked for our corporate event and everyone was talking about it for weeks. Professional, punctual, and exceeded all expectations.",
    date: "2 weeks ago",
    event: "Corporate Event"
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    review: "This artist brought our wedding reception to life! The music selection was perfect and the performance was flawless. Our guests couldn't stop dancing. Highly recommend for any special occasion.",
    date: "1 month ago",
    event: "Wedding Reception"
  },
  {
    id: 3,
    name: "Priya Patel",
    rating: 4,
    review: "Great performance at our restaurant's anniversary party. The acoustic set was perfect for the intimate atmosphere. Very professional and easy to work with. Would definitely book again!",
    date: "2 months ago",
    event: "Restaurant Anniversary"
  }
];

const ReviewsTab = ({ artist }: ReviewsTabProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? "text-yellow-400" : "text-white/20"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 md:space-y-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl md:text-3xl font-semibold text-orange-500 font-mondwest">
          Reviews & Ratings
        </h3>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{artist.rating}</div>
          <div className="text-white/60 text-sm">Average Rating</div>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: review.id * 0.1 }}
            className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-white font-semibold text-lg mb-1">{review.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(review.rating)}
                  <span className="text-white/60 text-sm ml-2">{review.rating}/5</span>
                </div>
                <p className="text-orange-400 text-sm font-medium">{review.event}</p>
              </div>
              <span className="text-white/40 text-sm">{review.date}</span>
            </div>
            <p className="text-white/80 leading-relaxed">{review.review}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center py-8">
        <p className="text-white/60 text-sm">More reviews coming soon!</p>
      </div>
    </motion.div>
  );
};

export default ReviewsTab;
