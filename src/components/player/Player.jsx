import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, 
  Volume2, Maximize2, Mic2, ListMusic, Heart 
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useLibrary } from '../../context/LibraryContext';
import PlaylistImage from '../common/PlaylistImage';

const Player = ({ toggleLyrics }) => {
  const { 
    currentTrack, isPlaying, togglePlay, progress, duration, 
    volume, setVolume, seek, isAmbientMode, setIsAmbientMode 
  } = usePlayer();
  const { toggleLike, isLiked } = useLibrary();

  const trackIsLiked = currentTrack ? isLiked(currentTrack.id) : false;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <footer style={{ 
      height: 'var(--player-height)', 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: 200,
      background: '#000',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Track Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '30%', minWidth: 0, opacity: currentTrack ? 1 : 0 }}>
        <div style={{ 
          width: '56px', height: '56px', borderRadius: '4px', 
          background: 'var(--bg-card)', flexShrink: 0, overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          cursor: 'pointer'
        }} onClick={() => currentTrack && setIsAmbientMode(true)}>
          {currentTrack && (
            <PlaylistImage item={currentTrack} type="track" size={56} />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <span style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack?.name}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack?.artists?.map(a => a.name).join(', ')}
          </span>
        </div>
        <button 
          onClick={() => currentTrack && toggleLike(currentTrack)}
          style={{ 
            background: 'none', border: 'none', padding: '4px', 
            cursor: 'pointer', color: trackIsLiked ? '#1DB954' : 'var(--text-muted)',
            transition: 'all 0.2s ease', display: 'flex'
          }}
        >
          <Heart size={18} fill={trackIsLiked ? '#1DB954' : 'none'} />
        </button>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        gap: '8px', width: '40%' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: currentTrack ? 'var(--text-muted)' : '#404040' }}>
          <Shuffle size={18} className={currentTrack ? "cursor-pointer hover:text-white" : ""} />
          <SkipBack size={20} className={currentTrack ? "fill-current cursor-pointer hover:text-white" : "fill-current"} />
          <div 
            onClick={() => currentTrack && togglePlay()}
            style={{ 
              width: '32px', height: '32px', borderRadius: '50%', background: currentTrack ? 'white' : '#404040',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black',
              cursor: currentTrack ? 'pointer' : 'default', transition: 'transform 0.1s active'
            }}
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
          </div>
          <SkipForward size={20} className={currentTrack ? "fill-current cursor-pointer hover:text-white" : "fill-current"} />
          <Repeat size={18} className={currentTrack ? "cursor-pointer hover:text-white" : ""} />
        </div>
        
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '35px', textAlign: 'right' }}>
            {currentTrack ? formatTime(progress) : '--:--'}
          </span>
          <div 
            style={{ 
              flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', 
              borderRadius: '2px', position: 'relative', cursor: currentTrack ? 'pointer' : 'default',
            }}
            onClick={(e) => {
              if (!currentTrack) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const pct = x / rect.width;
              seek(pct * duration);
            }}
            onMouseEnter={e => {
              if (currentTrack) e.currentTarget.firstChild.style.background = '#1DB954';
            }}
            onMouseLeave={e => {
              if (currentTrack) e.currentTarget.firstChild.style.background = 'white';
            }}
          >
            <div style={{ 
              width: `${currentTrack ? (progress / duration) * 100 : 0}%`, 
              height: '100%', 
              background: 'white', 
              borderRadius: '2px',
              transition: 'background 0.2s'
            }}></div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '35px' }}>
            {currentTrack ? formatTime(duration) : '--:--'}
          </span>
        </div>
      </div>

      {/* Volume & Extras */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '16px', 
        justifyContent: 'flex-end', width: '30%', color: 'var(--text-muted)' 
      }}>
        <Mic2 size={18} className={currentTrack ? "cursor-pointer hover:text-white" : ""} onClick={toggleLyrics} />
        <ListMusic size={18} className={currentTrack ? "cursor-pointer hover:text-white" : ""} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px' }}>
          <Volume2 size={18} />
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ 
              flex: 1, height: '4px', cursor: 'pointer', accentColor: 'white'
            }}
          />
        </div>
        <Maximize2 
          size={18} 
          className={currentTrack ? "cursor-pointer hover:text-white" : ""} 
          onClick={() => currentTrack && setIsAmbientMode(true)}
        />
      </div>
    </footer>
  );
};

export default Player;
