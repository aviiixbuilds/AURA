import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useLibrary } from '../../context/LibraryContext';
import PlaylistImage from '../common/PlaylistImage';

const AmbientMode = () => {
  const { 
    currentTrack, isPlaying, togglePlay, progress, duration, 
    isAmbientMode, setIsAmbientMode 
  } = usePlayer();
  const { toggleLike, isLiked } = useLibrary();

  if (!isAmbientMode || !currentTrack) return null;

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const trackIsLiked = isLiked(currentTrack.id);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ 
          position: 'fixed', inset: 0, zIndex: 1000, 
          background: 'var(--bg-dark)', display: 'flex', 
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <div style={{ 
          position: 'absolute', inset: 0, 
          filter: 'blur(80px) brightness(0.4)', transform: 'scale(1.2)',
          zIndex: -1
        }}>
           <PlaylistImage item={currentTrack} type="track" size={200} />
        </div>

        {/* Close Button */}
        <button 
          onClick={() => setIsAmbientMode(false)}
          style={{ 
            position: 'absolute', top: '40px', right: '40px', 
            background: 'rgba(255,255,255,0.1)', border: 'none', 
            color: 'white', borderRadius: '50%', width: '48px', height: '48px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        {/* Content Container */}
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          gap: '40px', maxWidth: '600px', width: '90%', textAlign: 'center' 
        }}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
              width: '400px', height: '400px', borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)' 
            }}
          >
            <PlaylistImage item={currentTrack} type="track" size={400} />
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 900 }}>{currentTrack.name}</h1>
            <h2 style={{ fontSize: '24px', color: 'var(--text-muted)' }}>
              {currentTrack.artists.map(a => a.name).join(', ')}
            </h2>
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
              <div style={{ 
                width: `${(progress / duration) * 100}%`, 
                height: '100%', background: 'white', borderRadius: '3px' 
              }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}>
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <button 
              onClick={() => toggleLike(currentTrack)}
              style={{ 
                background: 'none', border: 'none', 
                color: trackIsLiked ? '#1DB954' : 'white', 
                cursor: 'pointer', display: 'flex', transition: 'all 0.2s ease'
              }}
            >
              <Heart size={32} fill={trackIsLiked ? '#1DB954' : 'none'} />
            </button>
            <SkipBack size={32} className="cursor-pointer hover:text-white" />
            <button 
              onClick={togglePlay}
              style={{ 
                width: '80px', height: '80px', borderRadius: '50%', background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                color: 'black', cursor: 'pointer', border: 'none'
              }}
            >
              {isPlaying ? <Pause size={40} className="fill-current" /> : <Play size={40} className="fill-current" />}
            </button>
            <SkipForward size={32} className="cursor-pointer hover:text-white" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AmbientMode;
