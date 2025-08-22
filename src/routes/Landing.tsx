import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Shield,
  MessageCircle,
  Star,
  Music,
  ChevronRight,
  Play,
  Instagram,
  Youtube,
} from "lucide-react";
import { useFeaturedArtists } from "@/hooks/useArtists";
import { faqs } from "@/constants/faqs";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import { cn } from "@/lib/utils";

export const Landing: React.FC = () => {
  const featuredArtists = useFeaturedArtists();

  const features = [
    {
      icon: Search,
      title: "Discover",
      description: "Browse verified artists by genre, price, and availability",
    },
    {
      icon: Shield,
      title: "Book Securely",
      description: "Secure escrow payments protect both parties",
    },
    {
      icon: MessageCircle,
      title: "Chat & Finalize",
      description: "Direct messaging for coordination and details",
    },
  ];

  const socialEmbeds = [
    {
      platform: "YouTube",
      icon: Youtube,
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      title: "Live Performance Highlights",
    },
    {
      platform: "Spotify",
      icon: Youtube,
      url: "https://open.spotify.com/embed/artist/1vCWHaC5f2uS3yhpwWbIA6",
      title: "Artist Playlists",
    },
    {
      platform: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/p/example/embed/",
      title: "Behind the Scenes",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-foreground mb-6"
            >
              Artist Discovery and
              <span className="text-primary block">Bookings Made Simple</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            >
              Connect with talented musicians, book secure performances, and
              create unforgettable experiences for your events.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/explore"
                className="inline-flex items-center justify-center px-8 py-3 rounded-md text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Explore Artists
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3 rounded-md text-lg font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to book the perfect artist for your event
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 rounded-lg bg-background border border-border hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Artists
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover some of our top-rated performers
            </p>
          </div>

          {featuredArtists.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtists.slice(0, 6).map((artist) => (
                <motion.div
                  key={artist.id}
                  className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        artist.avatar ||
                        `https://ui-avatars.com/api/?name=${artist.name}&size=200&background=random`
                      }
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-semibold">
                      ${artist.price}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {artist.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(artist.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        {artist.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {artist.bio}
                    </p>
                    <Link
                      to={`/artist/${artist.slug}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-12">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No featured artists available
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Social Embeds Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              See Our Artists in Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Check out performances and behind-the-scenes content
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialEmbeds.map((embed, index) => (
              <motion.div
                key={embed.platform}
                className="bg-background border border-border rounded-lg overflow-hidden shadow-sm"
              >
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <embed.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {embed.platform}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {embed.title}
                  </p>
                </div>
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Play className="h-12 w-12 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about booking artists
            </p>
          </div>

          <StaggerContainer className="space-y-4">
            {faqs.slice(0, 4).map((faq) => (
              <motion.div
                key={faq.id}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Need Help?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground mb-8"
          >
            Our support team is here to help you with any questions
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a
              href="mailto:help.uplist@gmail.com"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Ready to Book Your Event?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl mb-8 opacity-90"
          >
            Join thousands of satisfied customers who have booked amazing live
            music
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/explore"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md text-lg font-medium bg-background text-foreground hover:bg-background/90 transition-colors"
            >
              Browse Artists
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md text-lg font-medium border border-primary-foreground/20 hover:bg-primary-foreground/10 transition-colors"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
