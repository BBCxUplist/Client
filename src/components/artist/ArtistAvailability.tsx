import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ArtistAvailabilityProps {
  availability: string[];
}

export const ArtistAvailability = ({
  availability,
}: ArtistAvailabilityProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-bold font-dm-sans text-neutral-800 mb-3 sm:mb-4">
        Availability
      </h3>
      <div className="space-y-2 sm:space-y-3">
        {availability.length > 0 ? (
          availability.slice(0, 5).map(date => (
            <div
              key={date}
              className="flex items-center space-x-2 text-sm sm:text-base"
            >
              <Calendar className="h-4 w-4 text-orange-500" />
              <span className="text-neutral-800 font-medium">
                {formatDate(date)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-neutral-600 text-sm sm:text-base">
            No available dates
          </p>
        )}
        {availability.length > 5 && (
          <p className="text-neutral-600 text-sm sm:text-base font-medium">
            +{availability.length - 5} more dates
          </p>
        )}
      </div>
    </div>
  );
};
