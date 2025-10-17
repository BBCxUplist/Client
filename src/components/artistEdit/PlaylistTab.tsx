import { useState } from 'react';

interface PlaylistItem {
  id: string;
  title: string;
  platform: 'youtube' | 'soundcloud' | 'spotify' | 'custom';
  url: string;
}

interface Playlist {
  id: string;
  title: string;
  items: PlaylistItem[];
  createdAt: string;
}

interface PlaylistTabProps {
  formData?: {
    embeds?: {
      youtube?: string[];
      soundcloud?: string[];
      spotify?: string[];
      custom?: { title: string; url: string }[];
    };
    playlists?: Playlist[];
  };
  handleInputChange?: (field: string, value: any) => void;
}

const PlaylistTab = ({ formData, handleInputChange }: PlaylistTabProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [activePlatformTab, setActivePlatformTab] = useState<
    'youtube' | 'soundcloud' | 'spotify' | 'custom'
  >('youtube');

  // Get all available songs from embeds
  const availableSongs: PlaylistItem[] = [];

  if (formData?.embeds) {
    // YouTube songs
    formData.embeds.youtube?.forEach((url, index) => {
      availableSongs.push({
        id: `youtube-${index}`,
        title: url,
        platform: 'youtube',
        url: url,
      });
    });

    // SoundCloud songs
    formData.embeds.soundcloud?.forEach((url, index) => {
      availableSongs.push({
        id: `soundcloud-${index}`,
        title: url,
        platform: 'soundcloud',
        url: url,
      });
    });

    // Spotify songs
    formData.embeds.spotify?.forEach((url, index) => {
      availableSongs.push({
        id: `spotify-${index}`,
        title: url,
        platform: 'spotify',
        url: url,
      });
    });

    // Custom songs
    formData.embeds.custom?.forEach((track, index) => {
      availableSongs.push({
        id: `custom-${index}`,
        title: typeof track === 'string' ? track : track.title,
        platform: 'custom',
        url: typeof track === 'string' ? track : track.url,
      });
    });
  }

  const playlists = formData?.playlists || [];

  const handleCreatePlaylist = () => {
    if (
      !newPlaylistTitle.trim() ||
      selectedSongs.length === 0 ||
      !handleInputChange
    )
      return;

    const playlistItems = availableSongs.filter(song =>
      selectedSongs.includes(song.id)
    );

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      title: newPlaylistTitle.trim(),
      items: playlistItems,
      createdAt: new Date().toISOString(),
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    handleInputChange('playlists', updatedPlaylists);

    // Reset form
    setNewPlaylistTitle('');
    setSelectedSongs([]);
    setShowCreateModal(false);

    console.log('Created playlist:', newPlaylist);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    if (!handleInputChange) return;

    const updatedPlaylists = playlists.filter(
      playlist => playlist.id !== playlistId
    );
    handleInputChange('playlists', updatedPlaylists);
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setNewPlaylistTitle(playlist.title);
    setSelectedSongs(playlist.items.map(item => item.id));
    setShowCreateModal(true);
  };

  const handleUpdatePlaylist = () => {
    if (
      !editingPlaylist ||
      !newPlaylistTitle.trim() ||
      selectedSongs.length === 0 ||
      !handleInputChange
    )
      return;

    const playlistItems = availableSongs.filter(song =>
      selectedSongs.includes(song.id)
    );

    const updatedPlaylist: Playlist = {
      ...editingPlaylist,
      title: newPlaylistTitle.trim(),
      items: playlistItems,
    };

    const updatedPlaylists = playlists.map(playlist =>
      playlist.id === editingPlaylist.id ? updatedPlaylist : playlist
    );

    handleInputChange('playlists', updatedPlaylists);

    // Reset form
    setNewPlaylistTitle('');
    setSelectedSongs([]);
    setEditingPlaylist(null);
    setShowCreateModal(false);

    console.log('Updated playlist:', updatedPlaylist);
  };

  const handleSongToggle = (songId: string) => {
    setSelectedSongs(prev =>
      prev.includes(songId)
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const getPlatformIcon = (platform: string) => {
    if (platform === 'custom') {
      return (
        <svg
          className='w-4 h-4 text-orange-400'
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
      );
    }
    return (
      <img
        src={`/icons/embeds/${platform}.png`}
        alt={platform}
        className='w-4 h-4'
      />
    );
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingPlaylist(null);
    setNewPlaylistTitle('');
    setSelectedSongs([]);
    setActivePlatformTab('youtube');
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-colors'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-semibold text-white font-mondwest'>
              Playlists
            </h3>
            <p className='text-white/60 text-sm mt-1'>
              Create and manage your music playlists
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'
          >
            Create Playlist
          </button>
        </div>

        {/* Playlists List */}
        <div className='space-y-4'>
          {playlists.length === 0 ? (
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
                No playlists created yet
              </p>
              <p className='text-white/40 text-sm'>
                Create your first playlist to organize your music
              </p>
            </div>
          ) : (
            playlists.map(playlist => (
              <div
                key={playlist.id}
                className='group relative bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all rounded p-4'
              >
                <div className='flex items-center justify-between mb-3'>
                  <div>
                    <h4 className='text-white font-medium'>{playlist.title}</h4>
                    <p className='text-white/60 text-sm'>
                      {playlist.items.length}{' '}
                      {playlist.items.length === 1 ? 'track' : 'tracks'}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleEditPlaylist(playlist)}
                      className='text-white/60 hover:text-orange-400 p-2 transition-colors'
                      title='Edit playlist'
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      className='text-white/60 hover:text-red-400 p-2 transition-colors'
                      title='Delete playlist'
                    >
                      <svg
                        className='w-4 h-4'
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
                </div>

                {/* Playlist Items */}
                <div className='space-y-2'>
                  {playlist.items.map((item, index) => (
                    <div
                      key={item.id}
                      className='flex items-center gap-3 p-2 bg-white/5 rounded'
                    >
                      <div className='w-6 h-6 bg-orange-500/20 flex items-center justify-center rounded text-xs text-orange-400 font-medium'>
                        {index + 1}
                      </div>
                      <div className='w-6 h-6 flex items-center justify-center'>
                        {getPlatformIcon(item.platform)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-white text-sm truncate'>
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Playlist Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-zinc-900 border border-white/20 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-semibold text-white font-mondwest'>
                {editingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}
              </h3>
              <button
                onClick={handleCloseModal}
                className='text-white/60 hover:text-white p-2'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='space-y-6'>
              {/* Playlist Title */}
              <div>
                <label className='block text-white/70 text-sm mb-2'>
                  Playlist Title
                </label>
                <input
                  type='text'
                  value={newPlaylistTitle}
                  onChange={e => setNewPlaylistTitle(e.target.value)}
                  className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
                  placeholder='Enter playlist title...'
                />
              </div>

              {/* Platform Tabs */}
              <div>
                <label className='block text-white/70 text-sm mb-3'>
                  Select Songs ({selectedSongs.length} selected)
                </label>

                {/* Platform Tabs */}
                <div className='flex gap-2 mb-4 border-b border-white/10 overflow-x-auto'>
                  {[
                    {
                      value: 'youtube',
                      label: 'YouTube',
                      icon: '/icons/embeds/youtube.png',
                    },
                    {
                      value: 'soundcloud',
                      label: 'SoundCloud',
                      icon: '/icons/embeds/soundcloud.png',
                    },
                    {
                      value: 'spotify',
                      label: 'Spotify',
                      icon: '/icons/embeds/spotify.png',
                    },
                    { value: 'custom', label: 'Custom', icon: null },
                  ].map(platform => (
                    <button
                      key={platform.value}
                      onClick={() =>
                        setActivePlatformTab(platform.value as any)
                      }
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                        activePlatformTab === platform.value
                          ? 'text-orange-400 border-orange-500'
                          : 'text-white/60 border-transparent hover:text-white/80'
                      }`}
                    >
                      {platform.icon ? (
                        <img
                          src={platform.icon}
                          alt={platform.label}
                          className='w-4 h-4'
                        />
                      ) : (
                        <svg
                          className='w-4 h-4'
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
                      )}
                      {platform.label}
                      {availableSongs.filter(
                        song => song.platform === platform.value
                      ).length > 0 && (
                        <span className='bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded-full'>
                          {
                            availableSongs.filter(
                              song => song.platform === platform.value
                            ).length
                          }
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Songs for Active Platform */}
                {(() => {
                  const platformSongs = availableSongs.filter(
                    song => song.platform === activePlatformTab
                  );

                  if (platformSongs.length === 0) {
                    return (
                      <div className='text-center py-8 bg-white/5 border border-white/10 rounded'>
                        <p className='text-white/60'>
                          No {activePlatformTab} songs available
                        </p>
                        <p className='text-white/40 text-sm mt-1'>
                          Add some {activePlatformTab} music to your profile
                          first
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className='space-y-2 max-h-60 overflow-y-auto'>
                      {platformSongs.map(song => (
                        <label
                          key={song.id}
                          className='flex items-center gap-3 p-3 bg-white/5 border border-white/10 hover:bg-white/[0.08] rounded cursor-pointer transition-colors'
                        >
                          <input
                            type='checkbox'
                            checked={selectedSongs.includes(song.id)}
                            onChange={() => handleSongToggle(song.id)}
                            className='w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2'
                          />
                          <div className='w-6 h-6 flex items-center justify-center'>
                            {getPlatformIcon(song.platform)}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='text-white text-sm font-medium truncate'>
                              {song.title}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Action Buttons */}
              <div className='flex justify-end gap-3'>
                <button
                  onClick={handleCloseModal}
                  className='bg-white/10 border border-white/30 text-white px-4 py-2 font-semibold hover:bg-white/20 transition-colors'
                >
                  Cancel
                </button>
                <button
                  onClick={
                    editingPlaylist
                      ? handleUpdatePlaylist
                      : handleCreatePlaylist
                  }
                  disabled={
                    !newPlaylistTitle.trim() || selectedSongs.length === 0
                  }
                  className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {editingPlaylist ? 'Update Playlist' : 'Create Playlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistTab;
