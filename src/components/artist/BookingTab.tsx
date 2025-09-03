// components/artist/BookingTab.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface Artist {
  id: string;
  name: string;
  price: number;
  isBookable: boolean;
  location?: string;
  // ... other artist properties
}

interface BookingTabProps {
  artist: Artist;
}

const BookingTab = ({ artist }: BookingTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    eventType: "",
    duration: "",
    guests: "",
    budget: "",
    location: "",
    message: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [artistResponse, setArtistResponse] = useState<{
    isAvailable: boolean | null;
    message: string;
    alternativeDates: Date[];
    quotedPrice: number | null;
  }>({
    isAvailable: null,
    message: "",
    alternativeDates: [],
    quotedPrice: null,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);

    // Simulate artist response after date selection
    setTimeout(() => {
      const isAvailable = Math.random() > 0.3; // 70% chance available
      setArtistResponse({
        isAvailable,
        message: isAvailable
          ? `Great! I'm available on ${
              date ? format(date, "MMMM do, yyyy") : "that date"
            }. Let's make your event amazing!`
          : `Sorry, I'm not available on ${
              date ? format(date, "MMMM do, yyyy") : "that date"
            }. But I have alternative dates available.`,
        alternativeDates: isAvailable
          ? []
          : [
              new Date(Date.now() + 86400000 * 2), // +2 days
              new Date(Date.now() + 86400000 * 5), // +5 days
              new Date(Date.now() + 86400000 * 7), // +7 days
            ],
        quotedPrice: isAvailable
          ? artist.price + Math.floor(Math.random() * 10000)
          : null,
      });
    }, 1500);
  };

  const handleBookingSubmit = () => {
    console.log("Booking submitted:", { selectedDate, bookingForm, artist });
    // Handle booking submission logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 md:space-y-8"
    >
      <h3 className="text-2xl md:text-3xl font-semibold text-orange-500 mb-6 font-mondwest">
        Book {artist.name}
      </h3>

      {/* Booking Status */}
      <div className="bg-white/5 p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Booking Status</p>
            <p
              className={`text-lg font-semibold ${
                artist.isBookable ? "text-orange-500" : "text-red-400"
              }`}
            >
              {artist.isBookable ? "AVAILABLE" : "UNAVAILABLE"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-sm">Starting Price</p>
            <p className="text-xl font-bold text-orange-500 font-mondwest">
              {formatPrice(artist.price)}
            </p>
          </div>
        </div>
      </div>

      {artist.isBookable && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Booking Form */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-white mb-4 font-mondwest">
                Event Details
              </h4>

              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">
                  Event Date *
                </label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen} >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal bg-white/5 border-white/20 hover:bg-white/10 rounded-none ${
                        !selectedDate && "text-white/50"
                      }`}
                      onClick={() => setIsCalendarOpen(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "MMMM do, yyyy")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-neutral-900 border-white/20"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      className="pointer-events-auto rounded-none text-white hover:text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Event Type *
                  </label>
                  <Input
                    placeholder="Wedding, Birthday, etc."
                    value={bookingForm.eventType}
                    onChange={(e) =>
                      handleInputChange("eventType", e.target.value)
                    }
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Duration *
                  </label>
                  <Input
                    placeholder="2 hours, 3 hours, etc."
                    value={bookingForm.duration}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Expected Guests
                  </label>
                  <Input
                    placeholder="50, 100, 200, etc."
                    value={bookingForm.guests}
                    onChange={(e) =>
                      handleInputChange("guests", e.target.value)
                    }
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Budget Range
                  </label>
                  <Input
                    placeholder="₹50,000 - ₹1,00,000"
                    value={bookingForm.budget}
                    onChange={(e) =>
                      handleInputChange("budget", e.target.value)
                    }
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-white/70 text-sm mb-2">
                  Event Location *
                </label>
                <Input
                  placeholder="Venue address or city"
                  value={bookingForm.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="mt-4">
                <label className="block text-white/70 text-sm mb-2">
                  Special Requirements
                </label>
                <Textarea
                  placeholder="Any specific songs, arrangements, or requirements..."
                  value={bookingForm.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-24 resize-none"
                />
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-white mb-4 font-mondwest">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Your Name *
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={bookingForm.contactName}
                    onChange={(e) =>
                      handleInputChange("contactName", e.target.value)
                    }
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={bookingForm.contactEmail}
                    onChange={(e) =>
                      handleInputChange("contactEmail", e.target.value)
                    }
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-white/70 text-sm mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={bookingForm.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Artist Response & Summary */}
          <div className="space-y-6">
            {selectedDate && (
              <div>
                <h4 className="text-xl font-semibold text-white mb-4 font-mondwest">
                  Artist Response
                </h4>

                {artistResponse.isAvailable !== null ? (
                  <div
                    className={`bg-white/5 p-6 border ${
                      artistResponse.isAvailable
                        ? "border-green-500/30"
                        : "border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-3 h-3 mr-3 ${
                          artistResponse.isAvailable
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <p
                        className={`font-semibold ${
                          artistResponse.isAvailable
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {artistResponse.isAvailable
                          ? "AVAILABLE"
                          : "NOT AVAILABLE"}
                      </p>
                    </div>
                    <p className="text-white/80 mb-4">
                      {artistResponse.message}
                    </p>

                    {artistResponse.quotedPrice && (
                      <div className="bg-white/5 p-4 mb-4">
                        <p className="text-white/70 text-sm mb-1">
                          Quoted Price for this Event
                        </p>
                        <p className="text-2xl font-bold text-orange-500 font-mondwest">
                          {formatPrice(artistResponse.quotedPrice)}
                        </p>
                      </div>
                    )}

                    {artistResponse.alternativeDates.length > 0 && (
                      <div>
                        <p className="text-white/70 text-sm mb-2">
                          Alternative Dates Available:
                        </p>
                        <div className="space-y-2">
                          {artistResponse.alternativeDates.map(
                            (altDate, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleDateSelect(altDate)}
                                className="mr-2 mb-2 bg-white/5 border-white/20 text-white hover:bg-orange-500/20"
                              >
                                {format(altDate, "MMM dd, yyyy")}
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/5 p-6 border border-white/10">
                    <div className="animate-pulse">
                      <p className="text-white/70">Checking availability...</p>
                      <div className="w-full h-2 bg-white/10 mt-2">
                        <div className="h-2 bg-orange-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Booking Summary */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4 font-mondwest">
                Booking Summary
              </h4>
              <div className="bg-white/5 p-6 border border-white/10 space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Artist:</span>
                  <span className="text-white font-semibold">
                    {artist.name}
                  </span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Date:</span>
                    <span className="text-white">
                      {format(selectedDate, "MMMM do, yyyy")}
                    </span>
                  </div>
                )}
                {bookingForm.eventType && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Event:</span>
                    <span className="text-white">{bookingForm.eventType}</span>
                  </div>
                )}
                {bookingForm.duration && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Duration:</span>
                    <span className="text-white">{bookingForm.duration}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Starting Price:</span>
                    <span className="text-orange-500 font-bold font-mondwest">
                      {formatPrice(artist.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleBookingSubmit}
              className="w-full bg-orange-500 text-black hover:bg-orange-600 font-semibold py-3"
              disabled={
                !selectedDate ||
                !bookingForm.eventType ||
                !bookingForm.contactName ||
                !bookingForm.contactEmail
              }
            >
              SEND BOOKING REQUEST
            </Button>
          </div>
        </div>
      )}

      {!artist.isBookable && (
        <div className="text-center py-12">
          <p className="text-white/60 text-lg mb-4">
            This artist is currently unavailable for bookings
          </p>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Get Notified When Available
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default BookingTab;
