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
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'

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
          stopSimulation();
          handleNextTrack();
          return duration;
        }
        return next;
      });
    }, 1000);
  };

  const skipNext = () => {
    const q = queueRef.current;
    const ct = currentTrackRef.current;
    if (!q.length || !ct) return;

    if (repeatMode === 'one') {
      // Re-play the same track
      seek(0);
      if (!isSimulated) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
      return;
    }

    if (isShuffle && q.length > 1) {
      let randomIndex = Math.floor(Math.random() * q.length);
      // Try to avoid playing the same song if possible
      if (q[randomIndex].id === ct.id) {
        randomIndex = (randomIndex + 1) % q.length;
      }
      playTrack(q[randomIndex]);
      return;
    }

    const currentIndex = q.findIndex(t => t.id === ct.id);
    if (currentIndex >= 0 && currentIndex < q.length - 1) {
      playTrack(q[currentIndex + 1]);
    } else if (repeatMode === 'all' && q.length > 0) {
      playTrack(q[0]);
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const skipPrevious = () => {
    // If we're deep into a song, just restart it
    if (progress > 3) {
      seek(0);
      if (!isSimulated) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
      return;
    }

    const q = queueRef.current;
    const ct = currentTrackRef.current;
    if (!q.length || !ct) return;

    const currentIndex = q.findIndex(t => t.id === ct.id);
    if (currentIndex > 0) {
      playTrack(q[currentIndex - 1]);
    } else if (repeatMode === 'all' && q.length > 0) {
      playTrack(q[q.length - 1]);
    } else {
      seek(0);
    }
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);
  
  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const queueRef = useRef([]);
  const currentTrackRef = useRef(null);

  useEffect(() => {
    queueRef.current = queue;
    currentTrackRef.current = currentTrack;
  }, [queue, currentTrack]);

  const handleNextTrack = () => {
    skipNext();
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const updateProgress = () => {
      if (!isSimulated) {
        setProgress(audio.currentTime);
        setDuration(audio.duration || currentTrackRef.current?.duration_ms / 1000 || 0);
      }
    };

    const handleEnded = () => {
      handleNextTrack();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      stopSimulation();
    };
  }, [volume, isSimulated]);

  useEffect(() => {
    localStorage.setItem('aura-volume', volume);
    audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = (track, newQueue = null) => {
    if (!track) return;

    if (newQueue) {
      setQueue(newQueue);
    }

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
    isShuffle,
    repeatMode,
    playTrack,
    togglePlay,
    seek,
    skipNext,
    skipPrevious,
    toggleShuffle,
    toggleRepeat
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
