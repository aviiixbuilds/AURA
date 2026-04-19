import React, { createContext, useContext, useState, useEffect } from 'react';
import { spotify } from '../services/spotify';

const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }) => {
  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem('aura-liked-songs');
    return saved ? JSON.parse(saved) : [];
  });

  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('aura-playlists');
    return saved ? JSON.parse(saved) : [];
  });

  const [libraryItems, setLibraryItems] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(false);

  const [stats, setStats] = useState({
    minutesListened: 0,
    playCount: 0,
    topArtists: {}
  });

  useEffect(() => {
    localStorage.setItem('aura-liked-songs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    localStorage.setItem('aura-playlists', JSON.stringify(playlists));
  }, [playlists]);

  /**
   * Fetch trending/popular playlists to populate the sidebar library.
   * This simulates a "Your Library" by pulling popular playlists.
   */
  const fetchLibrary = async () => {
    if (libraryItems.length > 0) return; // Already fetched
    setLibraryLoading(true);
    try {
      const data = await spotify.search('top playlists 2025', 'multi');
      const items = [];

      // Add playlists
      if (data?.playlists?.items) {
        data.playlists.items.forEach(p => {
          items.push({ ...p, type: 'playlist' });
        });
      }

      // Add some albums
      if (data?.albums?.items) {
        data.albums.items.slice(0, 3).forEach(a => {
          items.push({ ...a, type: 'album' });
        });
      }

      // Add some artists
      if (data?.artists?.items) {
        data.artists.items.slice(0, 3).forEach(a => {
          items.push({ ...a, type: 'artist' });
        });
      }

      setLibraryItems(items);
    } catch (err) {
      console.error('Failed to fetch library items:', err);
    } finally {
      setLibraryLoading(false);
    }
  };

  const toggleLike = (track) => {
    setLikedSongs(prev => {
      const isLiked = prev.some(s => s.id === track.id);
      if (isLiked) {
        return prev.filter(s => s.id !== track.id);
      } else {
        return [...prev, track];
      }
    });
  };

  const isLiked = (trackId) => likedSongs.some(s => s.id === trackId);

  const addPlay = (track) => {
    setStats(prev => {
      const artist = track.artists?.[0]?.name || 'Unknown';
      const newTopArtists = { ...prev.topArtists };
      newTopArtists[artist] = (newTopArtists[artist] || 0) + 1;

      return {
        ...prev,
        playCount: prev.playCount + 1,
        topArtists: newTopArtists
      };
    });
  };

  const addPlaylist = (playlist) => {
    setPlaylists(prev => [...prev, playlist]);
  };

  const value = {
    likedSongs,
    playlists,
    libraryItems,
    libraryLoading,
    stats,
    toggleLike,
    isLiked,
    addPlay,
    addPlaylist,
    fetchLibrary,
    setStats
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};
