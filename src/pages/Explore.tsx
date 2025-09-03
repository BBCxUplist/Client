import { useState } from 'react';
import { Link } from 'react-router-dom';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  // Mock data for artists
  const artists = [
    { id: 1, name: 'Sarah Johnson', genre: 'Pop', image: '/dist/artist/artist1.jpeg', followers: '125K' },
    { id: 2, name: 'Mike Chen', genre: 'Rock', image: '/dist/artist/artist2.jpeg', followers: '89K' },
    { id: 3, name: 'Emma Davis', genre: 'Jazz', image: '/dist/artist/artist3.jpeg', followers: '67K' },
    { id: 4, name: 'Alex Rivera', genre: 'Hip Hop', image: '/dist/artist/artist4.jpeg', followers: '234K' },
    { id: 5, name: 'Lisa Wang', genre: 'Pop', image: '/dist/artist/artist5.jpeg', followers: '156K' },
    { id: 6, name: 'David Kim', genre: 'Electronic', image: '/dist/artist/artist6.jpeg', followers: '98K' },
  ];

  const genres = ['all', 'pop', 'rock', 'jazz', 'hip hop', 'electronic', 'classical', 'country'];

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || artist.genre.toLowerCase() === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-orange-800">
              Uplist
            </Link>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <svg className="absolute right-3 top-2.5 w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Genre Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">Browse by Genre</h2>
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                  selectedGenre === genre
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-orange-600 border border-orange-300 hover:bg-orange-50'
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Artists Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-6">
            {selectedGenre === 'all' ? 'All Artists' : `${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Artists`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map((artist) => (
              <div key={artist.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/dist/images/userNotFound.jpeg';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {artist.genre}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">{artist.name}</h3>
                  <p className="text-orange-600 text-sm mb-3">{artist.followers} followers</p>
                  <button className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200">
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">Featured This Week</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <img
                src="/dist/images/artistOnStage.jpeg"
                alt="Featured Artist"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-orange-800">Live Performance</h3>
                <p className="text-orange-600 text-sm">Check out this amazing live show</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src="/dist/images/cd.png"
                alt="New Release"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-orange-800">New Release</h3>
                <p className="text-orange-600 text-sm">Latest album from trending artists</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;

