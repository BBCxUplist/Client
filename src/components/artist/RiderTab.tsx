import { motion } from 'framer-motion';

interface RiderItem {
  id: string;
  title: string;
  isProvided: boolean;
}

interface RiderTabProps {
  artist: {
    rider?: RiderItem[];
  };
}

const RiderTab = ({ artist }: RiderTabProps) => {
  // Dummy rider data
  const dummyRiderData: RiderItem[] = [
    { id: '1', title: 'Guitar', isProvided: true },
    { id: '2', title: 'Drum Kit', isProvided: false },
    { id: '3', title: 'Bass Guitar', isProvided: true },
    { id: '4', title: 'Microphone', isProvided: false },
    { id: '5', title: 'Amplifier', isProvided: true },
    { id: '6', title: 'Keyboard', isProvided: false },
    { id: '7', title: 'Cables', isProvided: true },
    { id: '8', title: 'Monitor Speakers', isProvided: false },
    { id: '9', title: 'Mixer', isProvided: true },
    { id: '10', title: 'Lighting', isProvided: false },
  ];

  const riderItems = artist?.rider || dummyRiderData;

  const getProvidedItems = () => riderItems.filter(item => item.isProvided);
  const getVenueItems = () => riderItems.filter(item => !item.isProvided);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-6 md:space-y-8'
    >
      <h3 className='text-2xl md:text-3xl font-semibold text-orange-500 mb-6 font-mondwest'>
        Equipment Rider
      </h3>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {/* Artist Provides */}
        <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-8 bg-green-500/20 flex items-center justify-center rounded'>
              <svg
                className='w-5 h-5 text-green-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h4 className='text-white font-semibold text-lg'>
              Artist Provides
            </h4>
          </div>
          <div className='space-y-2'>
            {getProvidedItems().length > 0 ? (
              getProvidedItems().map(item => (
                <div
                  key={item.id}
                  className='flex items-center gap-2 text-green-400'
                >
                  <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                  <span className='text-sm'>{item.title}</span>
                </div>
              ))
            ) : (
              <p className='text-white/60 text-sm'>
                No equipment provided by artist
              </p>
            )}
          </div>
        </div>

        {/* Venue Provides */}
        <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-8 bg-orange-500/20 flex items-center justify-center rounded'>
              <svg
                className='w-5 h-5 text-orange-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </div>
            <h4 className='text-white font-semibold text-lg'>Venue Provides</h4>
          </div>
          <div className='space-y-2'>
            {getVenueItems().length > 0 ? (
              getVenueItems().map(item => (
                <div
                  key={item.id}
                  className='flex items-center gap-2 text-orange-400'
                >
                  <div className='w-2 h-2 bg-orange-400 rounded-full'></div>
                  <span className='text-sm'>{item.title}</span>
                </div>
              ))
            ) : (
              <p className='text-white/60 text-sm'>
                No equipment required from venue
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
        <h4 className='text-white font-semibold text-lg mb-4'>
          Additional Notes
        </h4>
        <div className='space-y-3 text-white/80 text-sm'>
          <p>• All equipment should be in good working condition</p>
          <p>• Setup time required: 2 hours before performance</p>
          <p>• Sound check scheduled 1 hour before show</p>
          <p>• Technical rider available upon request</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RiderTab;
