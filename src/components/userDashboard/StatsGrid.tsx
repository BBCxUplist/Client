import { formatPrice } from '@/helper';

interface StatsGridProps {
  dashboardData: any;
  savedArtistsCount: number;
}

const StatsGrid = ({ dashboardData, savedArtistsCount }: StatsGridProps) => {
  // Define stats configuration
  const statsConfig = [
    {
      key: 'totalBookings',
      label: 'Total Bookings',
      value: dashboardData.stats.totalBookings,
      format: 'number',
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      value: dashboardData.stats.totalSpent,
      format: 'price',
    },
    {
      key: 'savedArtists',
      label: 'Saved Artists',
      value: savedArtistsCount,
      format: 'number',
    },
    {
      key: 'upcomingEvents',
      label: 'Upcoming',
      value: dashboardData.stats.upcomingEvents,
      format: 'number',
    },
    {
      key: 'completedEvents',
      label: 'Completed',
      value: dashboardData.stats.completedEvents,
      format: 'number',
    },
  ];

  const formatValue = (value: any, format: string) => {
    switch (format) {
      case 'price':
        return formatPrice(value);
      case 'number':
      default:
        return value;
    }
  };

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mb-8'>
      {statsConfig.map(stat => (
        <div
          key={stat.key}
          className='bg-white/5 border border-white/10 p-4 md:p-6'
        >
          <h3 className='text-white/70 text-xs md:text-sm mb-2'>
            {stat.label}
          </h3>
          <p className='text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest'>
            {formatValue(stat.value, stat.format)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
