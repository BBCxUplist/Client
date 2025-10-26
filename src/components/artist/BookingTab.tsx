// components/artist/BookingTab.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { formatPrice } from '@/helper';
import { useCreateBooking } from '@/hooks/booking/useCreateBooking';
import type { BookingTabData } from '../../types/tabs';

interface BookingTabProps {
  artist: BookingTabData & {
    isAvailable?: boolean;
    isApproved?: boolean;
  };
}

const BookingTab = ({ artist }: BookingTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    eventType: '',
    duration: '',
    guests: '',
    budget: '',
    location: '',
    message: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  // Booking API hook
  const createBookingMutation = useCreateBooking();

  // Success/Error message states
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const handleBookingSubmit = async () => {
    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');

    if (!selectedDate) {
      setErrorMessage('Please select an event date');
      return;
    }

    // Validate phone number length
    if (
      bookingForm.contactPhone.length < 10 ||
      bookingForm.contactPhone.length > 15
    ) {
      setErrorMessage('Phone number must be between 10-15 digits');
      return;
    }

    try {
      // Prepare booking data according to API requirements
      const bookingData = {
        artistId: artist.id,
        eventDate: selectedDate.toISOString(),
        eventType: bookingForm.eventType,
        duration: parseInt(bookingForm.duration) || 0,
        expectedGuests: parseInt(bookingForm.guests) || 0,
        budgetRange: bookingForm.budget,
        eventLocation: bookingForm.location,
        specialRequirements: bookingForm.message,
        contactName: bookingForm.contactName,
        contactEmail: bookingForm.contactEmail,
        contactPhone: bookingForm.contactPhone,
      };

      console.log('Submitting booking:', bookingData);

      // Call the booking API
      const result = await createBookingMutation.mutateAsync(bookingData);

      if (result.success === true || result.success === undefined) {
        setSuccessMessage(
          'Booking request submitted successfully! We will get back to you soon.'
        );
        // Reset form
        setBookingForm({
          eventType: '',
          duration: '',
          guests: '',
          budget: '',
          location: '',
          message: '',
          contactName: '',
          contactEmail: '',
          contactPhone: '',
        });
        setSelectedDate(undefined);
      } else {
        setErrorMessage(result.message || 'Failed to submit booking request');
      }
    } catch (error: any) {
      console.error('Error submitting booking:', error);
      setErrorMessage(error.message || 'Failed to submit booking request');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-6 md:space-y-8 pb-12 lg:pb-0'
    >
      <h3 className='text-2xl md:text-3xl font-semibold text-orange-500 mb-6 font-mondwest'>
        Book {artist.displayName}
      </h3>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className='bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6'>
          <div className='flex items-center gap-3'>
            <div className='text-green-400 text-xl'>✅</div>
            <p className='text-green-400'>{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6'>
          <div className='flex items-center gap-3'>
            <div className='text-red-400 text-xl'>❌</div>
            <p className='text-red-400'>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Booking Status */}
      <div className='bg-white/5 p-4 border border-white/10'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-white/70 text-sm'>Booking Status</p>
            <p
              className={`text-lg font-semibold ${
                artist.isBookable ? 'text-orange-500' : 'text-red-400'
              }`}
            >
              {artist.isBookable ? 'AVAILABLE' : 'UNAVAILABLE'}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-white/70 text-sm'>Starting Price</p>
            <p className='text-xl font-bold text-orange-500 font-mondwest'>
              {formatPrice(artist.basePrice)}
            </p>
          </div>
        </div>
      </div>

      {artist.isBookable && artist.isAvailable && artist.isApproved && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8'>
          {/* Left Column - Booking Form */}
          <div className='space-y-6'>
            <div>
              <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
                Event Details
              </h4>

              {/* Date Selection */}
              <div className='mb-4'>
                <label className='block text-white/70 text-sm mb-2'>
                  Event Date *
                </label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={`w-full justify-start text-left font-normal bg-white/5 border-white/20 hover:bg-white/10 rounded-none ${
                        !selectedDate && 'text-white/50'
                      }`}
                      onClick={() => setIsCalendarOpen(true)}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {selectedDate
                        ? format(selectedDate, 'MMMM do, yyyy')
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0 bg-neutral-900 border-white/20'
                    align='start'
                  >
                    <Calendar
                      mode='single'
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      disabled={date =>
                        date < new Date() || date < new Date('1900-01-01')
                      }
                      className='pointer-events-auto rounded-none text-white hover:text-white'
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Form Fields */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Event Type *
                  </label>
                  <Input
                    placeholder='Wedding, Birthday, etc.'
                    value={bookingForm.eventType}
                    onChange={e =>
                      handleInputChange('eventType', e.target.value)
                    }
                    className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                  />
                </div>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Duration (Hours) *
                  </label>
                  <Input
                    type='number'
                    placeholder='2'
                    value={bookingForm.duration}
                    onChange={e =>
                      handleInputChange('duration', e.target.value)
                    }
                    className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                  />
                </div>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Expected Guests
                  </label>
                  <Input
                    type='number'
                    placeholder='50'
                    value={bookingForm.guests}
                    onChange={e => handleInputChange('guests', e.target.value)}
                    className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                  />
                </div>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Budget
                  </label>
                  <Input
                    placeholder='£500 - £2,000'
                    value={bookingForm.budget}
                    type='number'
                    onChange={e => handleInputChange('budget', e.target.value)}
                    className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                  />
                </div>
              </div>

              <div className='mt-4'>
                <label className='block text-white/70 text-sm mb-2'>
                  Event Location *
                </label>
                <Input
                  placeholder='Venue address or city'
                  value={bookingForm.location}
                  onChange={e => handleInputChange('location', e.target.value)}
                  className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                />
              </div>

              <div className='mt-4'>
                <label className='block text-white/70 text-sm mb-2'>
                  Special Requirements
                </label>
                <Textarea
                  placeholder='Any specific songs, arrangements, or requirements...'
                  value={bookingForm.message}
                  onChange={e => handleInputChange('message', e.target.value)}
                  className='bg-white/5 border-white/20 text-white placeholder:text-white/50 h-24 resize-none'
                />
              </div>
            </div>

            <div>
              <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
                Contact Information
              </h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Your Name *
                  </label>
                  <Input
                    placeholder='John Doe'
                    value={bookingForm.contactName}
                    onChange={e =>
                      handleInputChange('contactName', e.target.value)
                    }
                    className='bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-none'
                  />
                </div>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Email *
                  </label>
                  <Input
                    type='email'
                    placeholder='john@example.com'
                    value={bookingForm.contactEmail}
                    onChange={e =>
                      handleInputChange('contactEmail', e.target.value)
                    }
                    className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                  />
                </div>
              </div>
              <div className='mt-4'>
                <label className='block text-white/70 text-sm mb-2'>
                  Phone Number *
                </label>
                <Input
                  type='number'
                  placeholder='9876543210'
                  value={bookingForm.contactPhone}
                  onChange={e =>
                    handleInputChange('contactPhone', e.target.value)
                  }
                  className={`bg-white/5 border-white/20 text-white placeholder:text-white/50 ${
                    bookingForm.contactPhone &&
                    (bookingForm.contactPhone.length < 10 ||
                      bookingForm.contactPhone.length > 15)
                      ? 'border-red-500/50'
                      : ''
                  }`}
                />
                {bookingForm.contactPhone &&
                  (bookingForm.contactPhone.length < 10 ||
                    bookingForm.contactPhone.length > 15) && (
                    <p className='text-red-400 text-xs mt-1'>
                      Phone number must be between 10-15 digits
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className='space-y-6'>
            {/* Booking Summary */}
            <div>
              <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
                Booking Summary
              </h4>
              <div className='bg-white/5 p-6 border border-white/10 space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-white/70'>Artist:</span>
                  <span className='text-white font-semibold'>
                    {artist.displayName}
                  </span>
                </div>
                {selectedDate && (
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Date:</span>
                    <span className='text-white'>
                      {format(selectedDate, 'MMMM do, yyyy')}
                    </span>
                  </div>
                )}
                {bookingForm.eventType && (
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Event:</span>
                    <span className='text-white'>{bookingForm.eventType}</span>
                  </div>
                )}
                {bookingForm.duration && (
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Duration:</span>
                    <span className='text-white'>{bookingForm.duration}</span>
                  </div>
                )}
                <div className='border-t border-white/10 pt-3 mt-3'>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Starting Price:</span>
                    <span className='text-orange-500 font-bold font-mondwest'>
                      {formatPrice(artist.basePrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleBookingSubmit}
              className='w-full bg-orange-500 text-black hover:bg-orange-600 font-semibold py-3'
              disabled={
                createBookingMutation.isPending ||
                !selectedDate ||
                !bookingForm.eventType ||
                !bookingForm.duration ||
                !bookingForm.location ||
                !bookingForm.contactName ||
                !bookingForm.contactEmail ||
                !bookingForm.contactPhone ||
                bookingForm.contactPhone.length < 10 ||
                bookingForm.contactPhone.length > 15
              }
            >
              {createBookingMutation.isPending
                ? 'SUBMITTING...'
                : 'SEND BOOKING REQUEST'}
            </Button>
          </div>
        </div>
      )}

      {!artist.isBookable && (
        <div className='text-center py-12'>
          <p className='text-white/60 text-lg mb-4'>
            This artist is currently not accepting bookings
          </p>
        </div>
      )}

      {!artist.isApproved && (
        <div className='text-center py-12'>
          <div className='flex items-center justify-center mb-4'>
            <img
              src='/icons/badge.svg'
              alt='Approval Badge'
              className='w-12 h-12 opacity-50 mr-3'
            />
            <p className='text-white/60 text-lg'>
              This artist is not yet approved
            </p>
          </div>
          <p className='text-white/40 text-sm mb-6'>
            This artist is currently under review and not accepting bookings.
          </p>
        </div>
      )}

      {!artist.isAvailable && artist.isBookable && artist.isApproved && (
        <div className='text-center py-12'>
          <p className='text-white/60 text-lg mb-4'>
            This artist is currently not available
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BookingTab;
