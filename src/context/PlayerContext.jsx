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
  const [isSimulated, setIsSimulated] = useState(false);

  const audioRef = useRef(new Audio());
  const simulationIntervalRef = useRef(null);

  const stopSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  };

  const startSimulation = () => {
    stopSimulation();
    simulationIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1;
        if (next >= duration) {
          setIsPlaying(false);
          stopSimulation();
          return duration;
        }
        return next;
      });
    }, 1000);
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const updateProgress = () => {
      if (!isSimulated) {
        setProgress(audio.currentTime);
        setDuration(audio.duration || currentTrack?.duration_ms / 1000 || 0);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      stopSimulation();
    };
  }, [volume, isSimulated, currentTrack]);

  useEffect(() => {
    localStorage.setItem('aura-volume', volume);
    audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = (track) => {
    if (!track) return;

    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    // Stop everything first
    stopSimulation();
    audioRef.current.pause();
    audioRef.current.src = '';
    
    const trackDuration = (track.duration_ms / 1000) || 0;
    setCurrentTrack(track);
    setDuration(trackDuration);
    setProgress(0);
    addPlay(track);

    if (track.preview_url) {
      setIsSimulated(false);
      audioRef.current.src = track.preview_url;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      setIsSimulated(true);
      setIsPlaying(true);
      // Interval will be started by the useEffect or togglePlay
    }
  };

  useEffect(() => {
    if (isPlaying && isSimulated) {
      startSimulation();
    } else {
      stopSimulation();
    }
  }, [isPlaying, isSimulated, duration]);

  const togglePlay = () => {
    if (isPlaying) {
      if (!isSimulated) audioRef.current.pause();
      else stopSimulation();
    } else {
      if (!isSimulated && audioRef.current.src) {
        audioRef.current.play();
      } else if (isSimulated) {
        startSimulation();
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
