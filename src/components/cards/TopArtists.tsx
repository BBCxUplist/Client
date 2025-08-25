import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Artist } from '@/constants/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import "@/index.css"

interface TopArtistsProps {
  artists: Artist[];
}

const TopArtists: React.FC<TopArtistsProps> = ({ artists }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="">
        <h2 className="text-2xl font-bold font-dm-sans text-neutral-800">
          Top <span className="text-orange-500">Artists</span>
        </h2>
      </div>

      {/* Top Artists Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: false,
          containScroll: "trimSnaps",
        }}
        className="w-full"
      >
        <CarouselContent className="px-6">
          {artists.map((artist, index) => (
            <CarouselItem key={artist.id} className="basis-[30%] rounded-2xl pt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => navigate(`/artist/${artist.slug}`)}
                className="cursor-pointer group"
              >
                <div className="relative border-2 border-neutral-200 rounded-2xl p-2">
                  {/* Artist Image */}
                  <div className="aspect-square transition-all duration-300">
                    <img
                      src={
                        artist.avatar ||
                        artist.photos?.[0] ||
                        `/images/userNotFound.jpeg`
                      }
                      alt={artist.name}
                      className="w-full h-full object-cover bg-transparent transition-transform duration-300 rounded-2xl"
                    />
                    
                    {/* Rank Badge */}
                    <div className="absolute -top-3 -left-3 w-14 h-14 bg-neutral-800 border-4 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Artist Info - One Line */}
                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-neutral-800 text-sm truncate group-hover:text-orange-600 transition-colors flex-1">
                        {artist.name}
                      </h3>
                      <span className="text-xs text-neutral-600 ml-2">
                        {artist.tags?.[0] || 'Artist'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 hidden" />
        <CarouselNext className="right-2 hidden" />
      </Carousel>
    </div>
  );
};

export default TopArtists;
