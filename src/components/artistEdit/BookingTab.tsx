interface BookingTabProps {
  formData: {
    name: string;
    bio: string;
    price: number;
    genres: string[];
    isBookable: boolean;
  };
  handleInputChange: (
    field: string,
    value: string | number | boolean | string[]
  ) => void;
}

const BookingTab = ({ formData, handleInputChange }: BookingTabProps) => {
  return (
    <div className='space-y-8'>
      {/* Pricing Structure */}
      <div className='bg-white/5 border border-white/10 p-6'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Pricing Structure
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Base Price (₹)
            </label>
            <input
              type='number'
              value={formData.price}
              onChange={e =>
                handleInputChange('price', parseInt(e.target.value) || 0)
              }
              className='w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500'
              placeholder='Enter base price'
            />
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Price per Additional Hour (₹)
            </label>
            <input
              type='number'
              placeholder='5000'
              className='w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500'
            />
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Travel Fee (₹)
            </label>
            <input
              type='number'
              placeholder='2000'
              className='w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500'
            />
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Equipment Fee (₹)
            </label>
            <input
              type='number'
              placeholder='1000'
              className='w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500'
            />
          </div>
        </div>
      </div>

      {/* Availability Calendar */}
      <div className='bg-white/5 border border-white/10 p-6'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Availability Calendar
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Available Days
            </label>
            <div className='space-y-2'>
              {[
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ].map(day => (
                <label key={day} className='flex items-center gap-3'>
                  <input
                    type='checkbox'
                    defaultChecked={['Friday', 'Saturday', 'Sunday'].includes(
                      day
                    )}
                    className='w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500'
                  />
                  <span className='text-white'>{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Blocked Dates
            </label>
            <div className='space-y-3'>
              <div className='flex gap-2'>
                <input
                  type='date'
                  className='flex-1 bg-white/10 border border-white/20 text-white p-2 rounded focus:outline-none focus:border-orange-500'
                />
                <button className='bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-2 rounded hover:bg-red-500/30 transition-colors'>
                  Block
                </button>
              </div>
              <div className='text-white/60 text-sm'>
                <p>Currently blocked: 15 Jan, 28 Jan, 5 Feb</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Preferences */}
      <div className='bg-white/5 border border-white/10 p-6'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Booking Preferences
        </h3>

        <div className='space-y-4'>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Advance Booking Required
            </label>
            <select className='w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500'>
              <option>24 hours</option>
              <option>48 hours</option>
              <option>1 week</option>
              <option>2 weeks</option>
              <option>1 month</option>
            </select>
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Cancellation Policy
            </label>
            <select className='w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500'>
              <option>Flexible (Full refund up to 24h before)</option>
              <option>Moderate (Full refund up to 7 days before)</option>
              <option>Strict (50% refund up to 7 days before)</option>
              <option>No refunds</option>
            </select>
          </div>

          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              defaultChecked
              className='w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500'
            />
            <span className='text-white'>
              Require deposit for booking confirmation
            </span>
          </div>

          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              defaultChecked
              className='w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500'
            />
            <span className='text-white'>
              Send confirmation emails to clients
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTab;
