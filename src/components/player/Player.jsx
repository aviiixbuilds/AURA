import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, 
  Volume2, Maximize2, Mic2, ListMusic, Heart 
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useLibrary } from '../../context/LibraryContext';
import PlaylistImage from '../common/PlaylistImage';
import Tooltip from '../common/Tooltip';

const Player = ({ toggleLyrics }) => {
  const navigate = useNavigate();
  const { 
    currentTrack, isPlaying, togglePlay, progress, duration, 
    volume, setVolume, seek, isAmbientMode, setIsAmbientMode,
    isShuffle, repeatMode, skipNext, skipPrevious, toggleShuffle, toggleRepeat
  } = usePlayer();
  const { toggleLike, isLiked } = useLibrary();

  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);
  const [tempVolume, setTempVolume] = useState(volume);

  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  const trackIsLiked = currentTrack ? isLiked(currentTrack.id) : false;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Dragging logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingProgress && progressRef.current) {
        const rect = progressRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, x / rect.width));
        setTempProgress(pct * duration);
      }
      if (isDraggingVolume && volumeRef.current) {
        const rect = volumeRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, x / rect.width));
        setVolume(pct);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingProgress) {
        seek(tempProgress);
        setIsDraggingProgress(false);
      }
      if (isDraggingVolume) {
        setIsDraggingVolume(false);
      }
    };

    if (isDraggingProgress || isDraggingVolume) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingProgress, isDraggingVolume, duration, tempProgress, seek, setVolume]);

  const displayProgress = isDraggingProgress ? tempProgress : progress;
  const progressPct = duration > 0 ? (displayProgress / duration) * 100 : 0;

  return (
    <footer style={{ 
      height: 'var(--player-height)', 
      position: 'relative',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: 200,
      background: '#000',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Track Info */}
      <div className="player-track-info" style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '30%', minWidth: 0, opacity: currentTrack ? 1 : 0 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, flex: 1 }}>
          <span style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack?.name}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack?.artists?.map((a, i) => (
              <React.Fragment key={a.id || i}>
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (a.id) {
                      navigate(`/artist/${a.id}`);
                      if (isAmbientMode) setIsAmbientMode(false);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  {a.name}
                </span>
                {i < currentTrack.artists.length - 1 ? ', ' : ''}
              </React.Fragment>
            ))}
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
        <div 
          onClick={() => currentTrack && togglePlay()}
          className="desktop-hidden control-button"
          style={{ 
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            cursor: currentTrack ? 'pointer' : 'default', padding: '8px'
          }}
        >
          {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current" />}
        </div>
      </div>

      {/* Controls */}
      <div className="mobile-hidden" style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        gap: '8px', width: '40%' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: currentTrack ? 'var(--text-muted)' : '#404040' }}>
          <Tooltip content={isShuffle ? "Disable shuffle" : "Enable shuffle"}>
            <Shuffle 
              size={18} 
              className={`control-button ${currentTrack ? "cursor-pointer" : ""}`} 
              onClick={() => currentTrack && toggleShuffle()}
              style={{ color: isShuffle ? '#1DB954' : 'inherit' }}
            />
          </Tooltip>

          <Tooltip content="Previous">
            <SkipBack 
              size={20} 
              className={`control-button fill-current ${currentTrack ? "cursor-pointer" : ""}`} 
              onClick={() => currentTrack && skipPrevious()}
            />
          </Tooltip>

          <div 
            onClick={() => currentTrack && togglePlay()}
            style={{ 
              width: '32px', height: '32px', borderRadius: '50%', background: currentTrack ? 'white' : '#404040',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black',
              cursor: currentTrack ? 'pointer' : 'default', transition: 'transform 0.1s active'
            }}
            className="control-button"
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
          </div>

          <Tooltip content="Next">
            <SkipForward 
              size={20} 
              className={`control-button fill-current ${currentTrack ? "cursor-pointer" : ""}`} 
              onClick={() => currentTrack && skipNext()}
            />
          </Tooltip>

          <Tooltip content={repeatMode === 'off' ? "Enable repeat" : repeatMode === 'all' ? "Enable repeat one" : "Disable repeat"}>
            <div style={{ position: 'relative' }}>
              <Repeat 
                size={18} 
                className={`control-button ${currentTrack ? "cursor-pointer" : ""}`} 
                onClick={() => currentTrack && toggleRepeat()}
                style={{ color: repeatMode !== 'off' ? '#1DB954' : 'inherit' }}
              />
              {repeatMode === 'one' && (
                <span style={{ 
                  position: 'absolute', top: '-4px', right: '-4px', fontSize: '9px', 
                  background: '#1DB954', color: 'black', borderRadius: '50%', 
                  width: '12px', height: '12px', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', fontWeight: 'bold', pointerEvents: 'none'
                }}>1</span>
              )}
            </div>
          </Tooltip>
        </div>
        
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '35px', textAlign: 'right' }}>
            {currentTrack ? formatTime(displayProgress) : '--:--'}
          </span>
          <div 
            ref={progressRef}
            style={{ 
              flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', 
              borderRadius: '2px', position: 'relative', cursor: currentTrack ? 'pointer' : 'default',
            }}
            onMouseDown={(e) => {
              if (!currentTrack) return;
              const rect = progressRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const pct = Math.max(0, Math.min(1, x / rect.width));
              setTempProgress(pct * duration);
              setIsDraggingProgress(true);
            }}
            onMouseEnter={e => {
              if (currentTrack) {
                e.currentTarget.firstChild.style.background = '#1DB954';
                e.currentTarget.lastChild.style.opacity = '1';
              }
            }}
            onMouseLeave={e => {
              if (currentTrack && !isDraggingProgress) {
                e.currentTarget.firstChild.style.background = 'white';
                e.currentTarget.lastChild.style.opacity = '0';
              }
            }}
          >
            <div style={{ 
              width: `${progressPct}%`, 
              height: '100%', 
              background: isDraggingProgress ? '#1DB954' : 'white', 
              borderRadius: '2px',
              transition: isDraggingProgress ? 'none' : 'background 0.2s'
            }}></div>
            <div style={{
              position: 'absolute',
              left: `${progressPct}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'white',
              opacity: isDraggingProgress ? 1 : 0,
              transition: 'opacity 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}></div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '35px' }}>
            {currentTrack ? formatTime(duration) : '--:--'}
          </span>
        </div>
      </div>

      {/* Volume & Extras */}
      <div className="mobile-hidden" style={{ 
        display: 'flex', alignItems: 'center', gap: '16px', 
        justifyContent: 'flex-end', width: '30%', color: 'var(--text-muted)' 
      }}>
        <Tooltip content="Lyrics">
          <Mic2 size={18} className={`control-button ${currentTrack ? "cursor-pointer" : ""}`} onClick={toggleLyrics} />
        </Tooltip>

        <Tooltip content="Queue">
          <ListMusic size={18} className={`control-button ${currentTrack ? "cursor-pointer" : ""}`} />
        </Tooltip>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px' }}>
          <Volume2 size={18} />
          <div 
            ref={volumeRef}
            style={{ 
              flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', 
              borderRadius: '2px', position: 'relative', cursor: 'pointer'
            }}
            onMouseDown={(e) => {
              const rect = volumeRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left;
              setVolume(Math.max(0, Math.min(1, x / rect.width)));
              setIsDraggingVolume(true);
            }}
            onMouseEnter={e => {
              e.currentTarget.firstChild.style.background = '#1DB954';
              e.currentTarget.lastChild.style.opacity = '1';
            }}
            onMouseLeave={e => {
              if (!isDraggingVolume) {
                e.currentTarget.firstChild.style.background = 'white';
                e.currentTarget.lastChild.style.opacity = '0';
              }
            }}
          >
            <div style={{ 
              width: `${volume * 100}%`, 
              height: '100%', 
              background: isDraggingVolume ? '#1DB954' : 'white', 
              borderRadius: '2px',
              transition: isDraggingVolume ? 'none' : 'background 0.2s'
            }}></div>
            <div style={{
              position: 'absolute',
              left: `${volume * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'white',
              opacity: isDraggingVolume ? 1 : 0,
              transition: 'opacity 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Player;
