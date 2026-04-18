import React, { createContext, useContext, useState, useEffect } from 'react';

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
      const artist = track.artists[0].name;
      const newTopArtists = { ...prev.topArtists };
      newTopArtists[artist] = (newTopArtists[artist] || 0) + 1;

      return {
        ...prev,
        playCount: prev.playCount + 1,
        topArtists: newTopArtists
      };
    });
  };

  const value = {
    likedSongs,
    playlists,
    stats,
    toggleLike,
    isLiked,
    addPlay,
    setStats
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};
