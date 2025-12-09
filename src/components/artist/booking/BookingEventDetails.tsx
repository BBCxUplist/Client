// components/artist/booking/BookingEventDetails.tsx
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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

interface BookingEventDetailsProps {
  control: Control<BookingFormData>;
}

const BookingEventDetails = ({ control }: BookingEventDetailsProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setIsCalendarOpen(false);
    return date;
  };

  return (
    <div>
      <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
        Event Details
      </h4>

      {/* Date Selection */}
      <FormField
        control={control}
        name='eventDate'
        rules={{
          required: 'Please select an event date',
          validate: value => {
            if (!value) return 'Please select an event date';
            if (value < new Date()) return 'Event date must be in the future';
            return true;
          },
        }}
        render={({ field }) => (
          <FormItem className='mb-4'>
            <FormLabel className='block text-white/70 text-sm mb-2'>
              Event Date *
            </FormLabel>
            <FormControl>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={`w-full justify-start text-left font-normal bg-white/5 border-white/20 hover:bg-white/10 rounded-none ${
                      !field.value && 'text-white/50'
                    }`}
                    onClick={() => setIsCalendarOpen(true)}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {field.value
                      ? format(field.value, 'MMMM do, yyyy')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto p-0 bg-neutral-900 border-white/20'
                  align='start'
                >
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={value => {
                      field.onChange(handleDateSelect(value));
                    }}
                    initialFocus
                    disabled={date =>
                      date < new Date() || date < new Date('1900-01-01')
                    }
                    className='pointer-events-auto rounded-none text-white hover:text-white'
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage className='text-red-400 text-xs mt-1' />
          </FormItem>
        )}
      />

      {/* Form Fields */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <FormField
          control={control}
          name='eventType'
          rules={{
            required: 'Event type is required',
            minLength: {
              value: 2,
              message: 'Event type must be at least 2 characters',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='block text-white/70 text-sm mb-2'>
                Event Type *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='Wedding, Birthday, etc.'
                  className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-red-400 text-xs mt-1' />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='duration'
          rules={{
            required: 'Duration is required',
            pattern: {
              value: /^[1-9]\d*$/,
              message: 'Duration must be a positive number',
            },
            min: {
              value: 1,
              message: 'Duration must be at least 1 hour',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='block text-white/70 text-sm mb-2'>
                Duration (Hours) *
              </FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='2'
                  className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-red-400 text-xs mt-1' />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='guests'
          rules={{
            pattern: {
              value: /^[0-9]*$/,
              message: 'Guests must be a valid number',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='block text-white/70 text-sm mb-2'>
                Expected Guests
              </FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='50'
                  className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-red-400 text-xs mt-1' />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='budget'
          rules={{
            required: 'Budget is required',
            pattern: {
              value: /^\d+$/,
              message: 'Budget must be a number only',
            },
            min: {
              value: 1,
              message: 'Budget must be greater than 0',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='block text-white/70 text-sm mb-2'>
                Budget (£)
              </FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='500'
                  min='1'
                  step='1'
                  className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                  {...field}
                  onChange={e => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage className='text-red-400 text-xs mt-1' />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name='location'
        rules={{
          required: 'Event location is required',
          minLength: {
            value: 3,
            message: 'Location must be at least 3 characters',
          },
        }}
        render={({ field }) => (
          <FormItem className='mt-4'>
            <FormLabel className='block text-white/70 text-sm mb-2'>
              Event Location *
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Venue address or city'
                className='bg-white/5 border-white/20 text-white placeholder:text-white/50'
                {...field}
              />
            </FormControl>
            <FormMessage className='text-red-400 text-xs mt-1' />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='message'
        render={({ field }) => (
          <FormItem className='mt-4'>
            <FormLabel className='block text-white/70 text-sm mb-2'>
              Special Requirements
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder='Any specific songs, arrangements, or requirements...'
                className='bg-white/5 border-white/20 text-white placeholder:text-white/50 h-24 resize-none'
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

export default BookingEventDetails;
