// components/artist/BookingTab.tsx
import { useState, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Form } from '@/components/ui/form';
import { useCreateBooking } from '@/hooks/booking/useCreateBooking';
import type { BookingTabData } from '../../types/tabs';

// Import booking sub-components
import BookingMessages from './booking/BookingMessages';
import BookingStatus from './booking/BookingStatus';
import BookingEventDetails from './booking/BookingEventDetails';
import BookingContactInfo from './booking/BookingContactInfo';
import BookingSummary from './booking/BookingSummary';
import BookingUnavailable from './booking/BookingUnavailable';

interface BookingFormData {
  eventDate: Date | undefined;
  eventType: string;
  duration: string;
  guests: string;
  budget: string;
  location: string;
  message: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface BookingTabRef {
  isFormValid: () => boolean;
  submitForm: () => Promise<void>;
  isLoading: boolean;
}

interface BookingTabProps {
  artist: BookingTabData & {
    isAvailable?: boolean;
    isApproved?: boolean;
  };
  onExternalSubmit?: () => void;
}

const BookingTab = forwardRef<BookingTabRef, BookingTabProps>(
  ({ artist, onExternalSubmit }, ref) => {
    // React Hook Form setup
    const form = useForm<BookingFormData>({
      defaultValues: {
        eventDate: undefined,
        eventType: '',
        duration: '',
        guests: '',
        budget: '',
        location: '',
        message: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
      },
      mode: 'onChange',
    });

    const { handleSubmit, control, formState, reset, watch, setValue } = form;
    const { isValid, isDirty } = formState;

    // Booking API hook
    const createBookingMutation = useCreateBooking();

    // Error message state (success now uses toast)
    const [errorMessage, setErrorMessage] = useState('');

    // Watch form values for validation
    const watchedValues = watch();

    // Expose form state and submit function to parent
    useImperativeHandle(ref, () => ({
      isFormValid: () => {
        const allRequiredFieldsFilled = Boolean(
          watchedValues.eventDate &&
            watchedValues.eventType &&
            watchedValues.duration &&
            watchedValues.budget &&
            watchedValues.location &&
            watchedValues.contactName &&
            watchedValues.contactEmail &&
            watchedValues.contactPhone
        );
        return isValid && isDirty && allRequiredFieldsFilled;
      },
      submitForm: async () => {
        const allRequiredFieldsFilled = Boolean(
          watchedValues.eventDate &&
            watchedValues.eventType &&
            watchedValues.duration &&
            watchedValues.budget &&
            watchedValues.location &&
            watchedValues.contactName &&
            watchedValues.contactEmail &&
            watchedValues.contactPhone
        );
        if (isValid && allRequiredFieldsFilled) {
          await handleBookingSubmit(watchedValues as Required<BookingFormData>);
        }
      },
      isLoading: createBookingMutation.isPending,
    }));

    const handleBookingSubmit = async (data: Required<BookingFormData>) => {
      // Clear previous messages
      setErrorMessage('');

      try {
        // Prepare booking data according to API requirements
        const bookingData = {
          artistId: artist.id,
          eventDate: data.eventDate!.toISOString(),
          eventType: data.eventType,
          duration: parseInt(data.duration) || 0,
          expectedGuests: parseInt(data.guests) || 0,
          budgetRange: data.budget,
          eventLocation: data.location,
          specialRequirements: data.message,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
        };

        console.log('Submitting booking:', bookingData);

        // Call the booking API
        const result = await createBookingMutation.mutateAsync(bookingData);

        if (result.success === true || result.success === undefined) {
          // Show success toast
          toast.success(
            'Booking request submitted successfully! We will get back to you soon.'
          );
          // Reset form
          reset();
          if (onExternalSubmit) {
            onExternalSubmit();
          }
        } else {
          setErrorMessage(result.message || 'Failed to submit booking request');
        }
      } catch (error: any) {
        console.error('Error submitting booking:', error);
        setErrorMessage(error.message || 'Failed to submit booking request');
      }
    };

    const onSubmit = (data: BookingFormData) => {
      if (data.eventDate) {
        handleBookingSubmit(data as Required<BookingFormData>);
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

        {/* Error Messages (Success now uses toast) */}
        <BookingMessages successMessage='' errorMessage={errorMessage} />

        {/* Booking Status */}
        <BookingStatus
          artist={{
            isBookable: artist.isBookable || false,
            basePrice: artist.basePrice || 0,
          }}
        />

        {artist.isBookable && artist.isAvailable && artist.isApproved && (
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8'
            >
              {/* Left Column - Booking Form */}
              <div className='space-y-6'>
                <BookingEventDetails control={control} />
                <BookingContactInfo control={control} setValue={setValue} />
              </div>

              {/* Right Column - Booking Summary */}
              <BookingSummary
                artist={{
                  displayName: artist.displayName,
                  basePrice: artist.basePrice || 0,
                }}
                watchedValues={watchedValues}
                isSubmitting={createBookingMutation.isPending}
                isFormValid={isValid}
              />
            </form>
          </Form>
        )}

        {/* Booking Unavailable States */}
        <BookingUnavailable
          artist={{
            isBookable: artist.isBookable || false,
            isApproved: artist.isApproved || false,
            isAvailable: artist.isAvailable || false,
          }}
        />
      </motion.div>
    );
  }
);

BookingTab.displayName = 'BookingTab';

export default BookingTab;
