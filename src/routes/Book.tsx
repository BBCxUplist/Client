import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Star, 
  Calendar, 
  CreditCard, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useArtistById } from '@/hooks/useArtists';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';
import { useAppStore } from '@/store';
import { EmptyState } from '@/components/common/EmptyState';
import { InformationIcon } from '@/components/common/InformationIcon';
import { formatPrice, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

const bookingSchema = z.object({
  date: z.string().min(1, 'Please select a date'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export const Book: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const { isAuthenticated, currentUserId } = useAuth();
  const currentUser = useCurrentUser();
  const { createBooking, fundEscrow } = useAppStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const artist = useArtistById(artistId || '');
  const bookingForm = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      amount: artist?.price || 0,
    },
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={AlertCircle}
            title="Artist not found"
            description="The artist you're trying to book doesn't exist or has been removed."
            action={{
              label: "Browse Artists",
              onClick: () => navigate('/explore'),
              variant: "outline",
            }}
          />
        </div>
      </div>
    );
  }

  if (!artist.isBookable) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={AlertCircle}
            title="Artist not available"
            description="This artist is not currently available for booking."
            action={{
              label: "Browse Other Artists",
              onClick: () => navigate('/explore'),
              variant: "outline",
            }}
          />
        </div>
      </div>
    );
  }

  const ratingStars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={cn(
        'h-4 w-4',
        i < Math.floor(artist.rating) 
          ? 'fill-yellow-400 text-yellow-400' 
          : 'text-gray-300'
      )}
    />
  ));

  const handleSubmitDetails = (data: BookingFormData) => {
    bookingForm.setValue('date', data.date);
    bookingForm.setValue('amount', data.amount);
    setStep('payment');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      const formData = bookingForm.getValues();
      
      // Create booking
      const bookingId = createBooking(
        artist.id,
        currentUserId!,
        formData.date,
        formData.amount
      );
      
      // Fund escrow (mock payment)
      fundEscrow(bookingId, formData.amount);
      
      setStep('success');
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToDetails = () => {
    setStep('details');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-foreground">Book Artist</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={cn(
              'flex items-center space-x-2',
              step === 'details' ? 'text-primary' : 'text-muted-foreground'
            )}>
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                step === 'details' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                1
              </div>
              <span className="hidden sm:inline">Booking Details</span>
            </div>
            <div className="w-8 h-1 bg-muted rounded"></div>
            <div className={cn(
              'flex items-center space-x-2',
              step === 'payment' ? 'text-primary' : 'text-muted-foreground'
            )}>
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                2
              </div>
              <span className="hidden sm:inline">Payment</span>
            </div>
            <div className="w-8 h-1 bg-muted rounded"></div>
            <div className={cn(
              'flex items-center space-x-2',
              step === 'success' ? 'text-primary' : 'text-muted-foreground'
            )}>
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                step === 'success' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                3
              </div>
              <span className="hidden sm:inline">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'details' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">Booking Details</h2>
                
                <form onSubmit={bookingForm.handleSubmit(handleSubmitDetails)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Date
                    </label>
                    <select
                      {...bookingForm.register('date')}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Choose a date</option>
                      {artist.availability.map((date) => (
                        <option key={date} value={date}>
                          {formatDate(date)}
                        </option>
                      ))}
                    </select>
                    {bookingForm.formState.errors.date && (
                      <p className="mt-1 text-sm text-destructive">
                        {bookingForm.formState.errors.date.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Initial Deposit
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <input
                        {...bookingForm.register('amount', { valueAsNumber: true })}
                        type="number"
                        min={artist.price}
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Minimum deposit: {formatPrice(artist.price)}
                    </p>
                    {bookingForm.formState.errors.amount && (
                      <p className="mt-1 text-sm text-destructive">
                        {bookingForm.formState.errors.amount.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">Payment</h2>
                
                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Artist:</span>
                        <span className="text-foreground">{artist.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="text-foreground">{formatDate(bookingForm.getValues('date'))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="text-foreground font-semibold">
                          {formatPrice(bookingForm.getValues('amount'))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Secure Escrow Payment</h4>
                        <p className="text-sm text-muted-foreground">
                          Your payment is held securely in escrow until the event is completed. 
                          This protects both you and the artist.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isProcessing ? 'Processing Payment...' : 'Pay Securely'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleBackToDetails}
                      className="w-full py-2 px-4 border border-input bg-background text-foreground rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Back to Details
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card border border-border rounded-lg p-6 text-center"
              >
                <div className="mb-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
                  <p className="text-muted-foreground">
                    Your booking has been created and payment has been processed securely.
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Next Steps</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• The artist will review your booking request</p>
                    <p>• You'll receive a notification when they respond</p>
                    <p>• Once accepted, you can chat directly with the artist</p>
                  </div>
                </div>

                <button
                  onClick={handleViewDashboard}
                  className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                >
                  View Dashboard
                </button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Artist Summary */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Artist Summary</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={artist.avatar || `https://ui-avatars.com/api/?name=${artist.name}&size=80&background=random`}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{artist.name}</h4>
                  <div className="flex items-center space-x-1">
                    {ratingStars}
                    <span className="text-sm text-muted-foreground ml-1">
                      {artist.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Price:</span>
                  <span className="text-foreground font-semibold">{formatPrice(artist.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Dates:</span>
                  <span className="text-foreground">{artist.availability.length}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-1">
                  {artist.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Escrow Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">How Escrow Works</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Your payment is held securely until the event is completed</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>The artist receives payment only after you confirm satisfaction</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Full refund available if the artist cancels or doesn't perform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
