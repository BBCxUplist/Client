import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import type { GalleryTabData } from '../../types/tabs';

interface GalleryTabProps {
  artist: GalleryTabData;
}

const GalleryTab = ({ artist }: GalleryTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-6 md:space-y-8'
    >
      <h3 className='text-2xl md:text-3xl font-semibold text-orange-500 mb-6 font-mondwest'>
        Gallery
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
        {artist?.photos && artist.photos.length > 0 ? (
          artist.photos.map((image: string, index: number) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div className='relative group cursor-pointer'>
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className='w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300'
                    draggable={false}
                    onError={e => {
                      e.currentTarget.src = '/images/artistNotFound.jpeg';
                    }}
                  />
                  <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                    <span className='text-white text-sm font-semibold'>
                      View
                    </span>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className='max-w-4xl max-h-[90vh] p-0 bg-transparent border-none shadow-none'>
                <div className='relative w-full h-full'>
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className='w-full h-full object-contain rounded-lg'
                    draggable={false}
                    onError={e => {
                      e.currentTarget.src = '/images/artistNotFound.jpeg';
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-center col-span-full'>
            <img
              src='/icons/empty/gallery.svg'
              alt='No gallery images available'
              className='w-24 h-24 mb-4 opacity-50'
            />
            <p className='text-white/60 text-lg'>No gallery images available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GalleryTab;
