import { useState } from "react";

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  isMobile: boolean;
}

interface FilterState {
  activeTab: "all" | "bookable";
  categories: string[];
  tags: string[];
  priceRange: [number, number];
  rating: number;
}

const Sidebar = ({ onFilterChange, isMobile }: FilterProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "bookable">("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Available filter options
  const categories = ["Hip-Hop", "Rap", "Bollywood", "Producer", "Regional Music", "Independent Artist", "Live Performance", "Battle Rap", "Storytelling", "Pop Rap", "Commercial Music", "Alternative Rap", "Underground", "Viral Artist", "Street Rap", "Music Producer", "MTV Hustle", "Regional Rap", "Fusion", "Traditional"];

  const handleTabChange = (tab: "all" | "bookable") => {
    setActiveTab(tab);
    updateFilters(tab, selectedCategories, selectedTags, priceRange, minRating);
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    updateFilters(activeTab, newCategories, selectedTags, priceRange, minRating);
  };

  const handlePriceChange = (min: number, max: number) => {
    const newPriceRange: [number, number] = [min, max];
    setPriceRange(newPriceRange);
    updateFilters(activeTab, selectedCategories, selectedTags, newPriceRange, minRating);
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
    updateFilters(activeTab, selectedCategories, selectedTags, priceRange, rating);
  };

  const updateFilters = (tab: "all" | "bookable", categories: string[], tags: string[], price: [number, number], rating: number) => {
    onFilterChange({
      activeTab: tab,
      categories,
      tags,
      priceRange: price,
      rating
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setPriceRange([0, 5000000]);
    setMinRating(0);
    updateFilters(activeTab, [], [], [0, 5000000], 0);
  };

  const activeFiltersCount = selectedCategories.length + selectedTags.length + (minRating > 0 ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 5000000 ? 1 : 0);

  if (isMobile) {
    return (
      <div className="w-full">
        {/* Mobile: Collapsible Filter Header */}
        <div 
          className="border border-dashed border-white p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-white font-semibold text-sm">FILTERS</h3>
              {activeFiltersCount > 0 && (
                <span className="bg-orange-500 text-black text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilters();
                  }}
                  className="text-orange-500 text-xs hover:text-orange-400 transition-colors"
                >
                  Clear
                </button>
              )}
              <svg 
                className={`w-4 h-4 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile: Expandable Filter Content */}
        {isExpanded && (
          <div className="border-l border-r border-b border-dashed border-white p-4 space-y-4">
            {/* Tab Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`border p-2 text-xs transition-all duration-300 ${
                  activeTab === "all"
                    ? "bg-orange-500 text-black border-black"
                    : "text-orange-500 border-orange-500 hover:bg-orange-500/10"
                }`}
                onClick={() => handleTabChange("all")}
              >
                ALL ARTISTS
              </button>
              <button
                className={`border p-2 text-xs transition-all duration-300 ${
                  activeTab === "bookable"
                    ? "bg-orange-500 text-black border-black"
                    : "text-orange-500 border-orange-500 hover:bg-orange-500/10"
                }`}
                onClick={() => handleTabChange("bookable")}
              >
                BOOKABLE
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-white text-xs font-medium mb-2">CATEGORIES</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {categories.slice(0, 9).map((category) => (
                  <label key={category} className="flex items-center space-x-1 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-3 h-3 text-orange-500 bg-transparent border-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="text-white truncate">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price and Rating in row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price Range */}
              <div>
                <h4 className="text-white text-xs font-medium mb-2">PRICE RANGE</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                    className="w-full px-2 py-1 text-xs bg-transparent border border-orange-500 text-white placeholder-white/50 focus:outline-none focus:border-orange-400"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs bg-transparent border border-orange-500 text-white placeholder-white/50 focus:outline-none focus:border-orange-400"
                  />
                </div>
                <div className="text-white text-xs text-center mt-1">
                  ₹{(priceRange[0] / 100000).toFixed(1)}L - ₹{(priceRange[1] / 100000).toFixed(1)}L
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="text-white text-xs font-medium mb-2">MIN RATING</h4>
                <div className="grid grid-cols-2 gap-1">
                  {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                    <label key={rating} className="flex items-center space-x-1 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => handleRatingChange(rating)}
                        className="w-3 h-3 text-orange-500 bg-transparent border-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-white">{rating}+⭐</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version (unchanged from original)
  return (
    <div className="w-[280px] h-full sticky top-[100px] space-y-6">
      {/* Tab Buttons */}
      <div className="space-y-2">
        <button
          className={`w-full border p-2 text-sm transition-all duration-300 ${
            activeTab === "all"
              ? "bg-orange-500 text-black border-black"
              : "text-orange-500 border-orange-500 hover:bg-orange-500/10"
          }`}
          onClick={() => handleTabChange("all")}
        >
          ALL ARTISTS
        </button>
        <button
          className={`w-full border p-2 text-sm transition-all duration-300 ${
            activeTab === "bookable"
              ? "bg-orange-500 text-black border-black"
              : "text-orange-500 border-orange-500 hover:bg-orange-500/10"
          }`}
          onClick={() => handleTabChange("bookable")}
        >
          BOOKABLE ARTISTS
        </button>
      </div>

      {/* Filter Section */}
      <div className="border-t border-dashed border-white pt-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white text-sm font-semibold">FILTER BY</p>
          <button
            onClick={clearFilters}
            className="text-orange-500 text-xs hover:text-orange-400 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Categories Filter */}
        <div className="mb-6">
          <h3 className="text-white text-xs font-medium mb-3">CATEGORIES</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="w-3 h-3 text-orange-500 bg-transparent border-orange-500 rounded focus:ring-orange-500"
                />
                <span className="text-white text-xs">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="text-white text-xs font-medium mb-3">PRICE RANGE</h3>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                className="w-20 px-2 py-1 text-xs bg-transparent border border-orange-500 text-white placeholder-white/50 focus:outline-none focus:border-orange-400"
              />
              <span className="text-white text-xs self-center">to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                className="w-20 px-2 py-1 text-xs bg-transparent border border-orange-500 text-white placeholder-white/50 focus:outline-none focus:border-orange-400"
              />
            </div>
            <div className="text-white text-xs text-center">
              ₹{(priceRange[0] / 100000).toFixed(1)}L - ₹{(priceRange[1] / 100000).toFixed(1)}L
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <h3 className="text-white text-xs font-medium mb-3">MINIMUM RATING</h3>
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0, 2.5, 2.0].map((rating) => (
              <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-3 h-3 text-orange-500 bg-transparent border-orange-500 focus:ring-orange-500"
                />
                <span className="text-white text-xs">{rating}+ ⭐</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
