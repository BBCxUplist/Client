import { useState } from 'react';

interface RiderItem {
  id: string;
  artistId: string;
  name: string;
  status: 'included' | 'to_be_provided';
  createdAt: string;
  updatedAt: string;
}

interface RiderTabProps {
  formData?: {
    rider?: RiderItem[];
  };
  riders?: RiderItem[];
  onCreateRider?: (riderData: {
    name: string;
    status: 'included' | 'to_be_provided';
  }) => Promise<void>;
  onUpdateRider?: (
    riderId: string,
    riderData: {
      name?: string;
      status?: 'included' | 'to_be_provided';
    }
  ) => Promise<void>;
  onDeleteRider?: (riderId: string) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

const RiderTab = ({
  riders = [],
  onCreateRider,
  onUpdateRider,
  onDeleteRider,
  isCreating,
  isDeleting,
}: RiderTabProps) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemStatus, setNewItemStatus] = useState<
    'included' | 'to_be_provided'
  >('included');

  // Use riders from profile API

  const handleAddItem = async () => {
    if (!newItemName.trim() || !onCreateRider) return;

    try {
      await onCreateRider({
        name: newItemName.trim(),
        status: newItemStatus,
      });

      setNewItemName('');
      setNewItemStatus('included');
    } catch (error) {
      console.error('Error creating rider item:', error);
    }
  };

  const handleToggleStatus = async (
    itemId: string,
    currentStatus: 'included' | 'to_be_provided'
  ) => {
    if (!onUpdateRider) return;

    try {
      const newStatus =
        currentStatus === 'included' ? 'to_be_provided' : 'included';
      await onUpdateRider(itemId, { status: newStatus });
    } catch (error) {
      console.error('Error updating rider item:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!onDeleteRider) return;

    try {
      await onDeleteRider(itemId);
    } catch (error) {
      console.error('Error deleting rider item:', error);
    }
  };

  const handleEditName = async (itemId: string, newName: string) => {
    if (!onUpdateRider) return;

    try {
      await onUpdateRider(itemId, { name: newName });
    } catch (error) {
      console.error('Error updating rider item:', error);
    }
  };

  return (
    <div className='space-y-8'>
      {/* Info Section */}
      <div className='bg-white/10 border border-white/30 rounded-lg p-4'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
            <svg
              className='w-4 h-4 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <div className='flex-1'>
            <h4 className='text-white font-semibold mb-1'>
              About Equipment Rider
            </h4>
            <p className='text-white/70 text-sm leading-relaxed'>
              List the equipment and technical requirements for your
              performances. Mark items as <strong>"Included"</strong> if you'll
              bring them yourself, or <strong>"To be provided"</strong> if you
              need the venue/booker to supply them. This helps bookers
              understand your technical needs upfront.
            </p>
          </div>
        </div>
      </div>

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
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='e.g., Guitar, Drum Kit, Microphone...'
            />
          </div>

          <div className='flex items-center gap-4'>
            <label className='flex items-center gap-2 text-white/70 text-sm'>
              <input
                type='radio'
                name='status'
                value='included'
                checked={newItemStatus === 'included'}
                onChange={e =>
                  setNewItemStatus(
                    e.target.value as 'included' | 'to_be_provided'
                  )
                }
                className='w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2'
              />
              Included
            </label>
            <label className='flex items-center gap-2 text-white/70 text-sm'>
              <input
                type='radio'
                name='status'
                value='to_be_provided'
                checked={newItemStatus === 'to_be_provided'}
                onChange={e =>
                  setNewItemStatus(
                    e.target.value as 'included' | 'to_be_provided'
                  )
                }
                className='w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2'
              />
              To be provided
            </label>
          </div>

          <div className='flex justify-end'>
            <button
              onClick={handleAddItem}
              disabled={!newItemName.trim() || isCreating}
              className='bg-orange-500 text-black px-6 py-3 font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isCreating ? 'Adding...' : 'Add Equipment'}
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
            {riders.length} {riders.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className='space-y-3'>
          {riders.length === 0 ? (
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
            riders.map(item => (
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
                    value={item.name}
                    onChange={e => handleEditName(item.id, e.target.value)}
                    className='w-full bg-transparent text-white text-sm font-medium focus:outline-none focus:bg-white/10 px-2 py-1 rounded'
                  />
                </div>

                {/* Provided Toggle */}
                <div className='flex items-center gap-2'>
                  <label className='flex items-center gap-2 text-white/70 text-sm cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={item.status === 'included'}
                      onChange={() => handleToggleStatus(item.id, item.status)}
                      className='w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2'
                    />
                    <span className='text-xs'>
                      {item.status === 'included'
                        ? 'Included'
                        : 'To be provided'}
                    </span>
                  </label>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isDeleting}
                  className='text-white/40 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
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
        {riders.length > 0 && (
          <div className='mt-6 p-4 bg-white/5 border border-white/10 rounded'>
            <h4 className='text-white font-medium mb-3'>Summary</h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-white/60'>You will provide:</span>
                <div className='mt-1'>
                  {riders.filter(item => item.status === 'included').length ===
                  0 ? (
                    <span className='text-white/40 italic'>None</span>
                  ) : (
                    riders
                      .filter(item => item.status === 'included')
                      .map(item => (
                        <span
                          key={item.id}
                          className='inline-block bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs mr-1 mb-1'
                        >
                          {item.name}
                        </span>
                      ))
                  )}
                </div>
              </div>
              <div>
                <span className='text-white/60'>Venue needs to provide:</span>
                <div className='mt-1'>
                  {riders.filter(item => item.status === 'to_be_provided')
                    .length === 0 ? (
                    <span className='text-white/40 italic'>None</span>
                  ) : (
                    riders
                      .filter(item => item.status === 'to_be_provided')
                      .map(item => (
                        <span
                          key={item.id}
                          className='inline-block bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs mr-1 mb-1'
                        >
                          {item.name}
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
