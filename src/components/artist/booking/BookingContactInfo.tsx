// components/artist/booking/BookingContactInfo.tsx
import { useEffect } from 'react';
import type { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useStore } from '@/stores/store';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

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

interface BookingContactInfoProps {
  control: Control<BookingFormData>;
  setValue: (name: keyof BookingFormData, value: any) => void;
}

const BookingContactInfo = ({ control, setValue }: BookingContactInfoProps) => {
  const { user } = useStore();

  useEffect(() => {
    if (user) {
      const contactName = user.displayName || user.name || '';
      if (contactName) {
        setValue('contactName', contactName);
      }

      if (user.email) {
        setValue('contactEmail', user.email);
      }

      if (user.phone) {
        setValue('contactPhone', user.phone);
      }
    }
  }, [user, setValue]);
  return (
    <div>
      <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
        Contact Information
      </h4>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <FormField
          control={control}
          name='contactName'
          rules={{
            required: 'Your name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='block text-white/70 text-sm mb-2'>
                Your Name *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='John Doe'
                  className='bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-none'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-red-400 text-xs mt-1' />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='contactEmail'
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='block text-white/70 text-sm mb-2'>
                Email *
              </FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='john@example.com'
                  className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-red-400 text-xs mt-1' />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name='contactPhone'
        rules={{
          required: 'Phone number is required',
          pattern: {
            value: /^[0-9]{10,15}$/,
            message: 'Phone number must be between 10-15 digits',
          },
        }}
        render={({ field }) => (
          <FormItem className='mt-4'>
            <FormLabel className='block text-white/70 text-sm mb-2'>
              Phone Number *
            </FormLabel>
            <FormControl>
              <Input
                type='number'
                placeholder='9876543210'
                className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                {...field}
              />
            </FormControl>
            <FormMessage className='text-red-400 text-xs mt-1' />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BookingContactInfo;
