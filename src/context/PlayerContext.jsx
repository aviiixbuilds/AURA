import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useLibrary } from './LibraryContext';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const { addPlay } = useLibrary();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(parseFloat(localStorage.getItem('aura-volume')) || 0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState([]);
  const [isAmbientMode, setIsAmbientMode] = useState(false);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      // Logic for next track could go here
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('aura-volume', volume);
    audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = (track) => {
    if (!track) return;

    // Always set the current track so the RightSidebar is shown
    if (currentTrack?.id === track.id) {
      // If same track, toggle play/pause (only if we have audio)
      if (track.preview_url) togglePlay();
      return;
    }

    setCurrentTrack(track);
    addPlay(track);

    if (track.preview_url) {
      // Real playback via Spotify 30-sec preview URL
      audioRef.current.src = track.preview_url;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      // No preview available — show track info in sidebar but can't play audio
      audioRef.current.src = '';
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioRef.current.src) {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const value = {
    currentTrack,
    isPlaying,
    volume,
    setVolume,
    progress,
    duration,
    queue,
    isAmbientMode,
    setIsAmbientMode,
    playTrack,
    togglePlay,
    seek
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
