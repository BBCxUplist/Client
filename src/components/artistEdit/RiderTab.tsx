import { useState } from 'react';

interface RiderItem {
  id: string;
  title: string;
  isProvided: boolean;
}

interface RiderTabProps {
  formData?: {
    rider?: RiderItem[];
  };
  handleInputChange?: (field: string, value: any) => void;
}

const RiderTab = ({ formData, handleInputChange }: RiderTabProps) => {
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemProvided, setNewItemProvided] = useState(false);

  // Default rider items with constant data
  const defaultRiderItems: RiderItem[] = [
    { id: '1', title: 'Guitar', isProvided: true },
    { id: '2', title: 'Drum Kit', isProvided: false },
    { id: '3', title: 'Bass Guitar', isProvided: true },
    { id: '4', title: 'Microphone', isProvided: false },
    { id: '5', title: 'Amplifier', isProvided: true },
    { id: '6', title: 'Keyboard', isProvided: false },
    { id: '7', title: 'Cables', isProvided: true },
    { id: '8', title: 'Monitor Speakers', isProvided: false },
  ];

  const riderItems = formData?.rider || defaultRiderItems;

  const handleAddItem = () => {
    if (!newItemTitle.trim() || !handleInputChange) return;

    const newItem: RiderItem = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      isProvided: newItemProvided,
    };

    const updatedRider = [...riderItems, newItem];
    handleInputChange('rider', updatedRider);

    setNewItemTitle('');
    setNewItemProvided(false);
  };

  const handleToggleProvided = (itemId: string) => {
    if (!handleInputChange) return;

    const updatedRider = riderItems.map(item =>
      item.id === itemId ? { ...item, isProvided: !item.isProvided } : item
    );
    handleInputChange('rider', updatedRider);
  };

  const handleRemoveItem = (itemId: string) => {
    if (!handleInputChange) return;

    const updatedRider = riderItems.filter(item => item.id !== itemId);
    handleInputChange('rider', updatedRider);
  };

  const handleEditTitle = (itemId: string, newTitle: string) => {
    if (!handleInputChange) return;

    const updatedRider = riderItems.map(item =>
      item.id === itemId ? { ...item, title: newTitle } : item
    );
    handleInputChange('rider', updatedRider);
  };

  return (
    <div className='space-y-8'>
      {/* Add New Item Section */}
      <div className='bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-colors'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Add Equipment
        </h3>

        <div className='space-y-4'>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Equipment Title
            </label>
            <input
              type='text'
              value={newItemTitle}
              onChange={e => setNewItemTitle(e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='e.g., Guitar, Drum Kit, Microphone...'
            />
          </div>

          <div className='flex items-center gap-4'>
            <label className='flex items-center gap-2 text-white/70 text-sm'>
              <input
                type='checkbox'
                checked={newItemProvided}
                onChange={e => setNewItemProvided(e.target.checked)}
                className='w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2'
              />
              I will provide this equipment
            </label>
          </div>

          <div className='flex justify-end'>
            <button
              onClick={handleAddItem}
              disabled={!newItemTitle.trim()}
              className='bg-orange-500 text-black px-6 py-3 font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Add Equipment
            </button>
          </div>
        </div>
      </div>

      {/* Rider List */}
      <div className='bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-colors'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-xl font-semibold text-white font-mondwest'>
            Equipment Rider
          </h3>
          <span className='text-white/60 text-sm'>
            {riderItems.length} {riderItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className='space-y-3'>
          {riderItems.length === 0 ? (
            <div className='text-center py-12'>
              <div className='w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-white/40'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
                  />
                </svg>
              </div>
              <p className='text-white/60 text-lg mb-1'>
                No equipment added yet
              </p>
              <p className='text-white/40 text-sm'>
                Add your first equipment item from the section above
              </p>
            </div>
          ) : (
            riderItems.map(item => (
              <div
                key={item.id}
                className='group relative flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all rounded'
              >
                {/* Equipment Icon */}
                <div className='w-10 h-10 bg-orange-500/20 flex items-center justify-center rounded flex-shrink-0'>
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
                      d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
                    />
                  </svg>
                </div>

                {/* Equipment Details */}
                <div className='flex-1 min-w-0'>
                  <input
                    type='text'
                    value={item.title}
                    onChange={e => handleEditTitle(item.id, e.target.value)}
                    className='w-full bg-transparent text-white text-sm font-medium focus:outline-none focus:bg-white/10 px-2 py-1 rounded'
                  />
                </div>

                {/* Provided Toggle */}
                <div className='flex items-center gap-2'>
                  <label className='flex items-center gap-2 text-white/70 text-sm cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={item.isProvided}
                      onChange={() => handleToggleProvided(item.id)}
                      className='w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2'
                    />
                    <span className='text-xs'>
                      {item.isProvided ? 'I provide' : 'You provide'}
                    </span>
                  </label>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className='text-white/40 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all'
                  title='Remove equipment'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {riderItems.length > 0 && (
          <div className='mt-6 p-4 bg-white/5 border border-white/10 rounded'>
            <h4 className='text-white font-medium mb-3'>Summary</h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-white/60'>You will provide:</span>
                <div className='mt-1'>
                  {riderItems.filter(item => item.isProvided).length === 0 ? (
                    <span className='text-white/40 italic'>None</span>
                  ) : (
                    riderItems
                      .filter(item => item.isProvided)
                      .map(item => (
                        <span
                          key={item.id}
                          className='inline-block bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs mr-1 mb-1'
                        >
                          {item.title}
                        </span>
                      ))
                  )}
                </div>
              </div>
              <div>
                <span className='text-white/60'>Venue needs to provide:</span>
                <div className='mt-1'>
                  {riderItems.filter(item => !item.isProvided).length === 0 ? (
                    <span className='text-white/40 italic'>None</span>
                  ) : (
                    riderItems
                      .filter(item => !item.isProvided)
                      .map(item => (
                        <span
                          key={item.id}
                          className='inline-block bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs mr-1 mb-1'
                        >
                          {item.title}
                        </span>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderTab;
