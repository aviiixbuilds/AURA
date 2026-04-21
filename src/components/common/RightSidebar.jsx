import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Maximize2, ArrowUpRight } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useLibrary } from '../../context/LibraryContext';
import PlaylistImage from './PlaylistImage';

const MIN_WIDTH = 280;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 340;

const RightSidebar = () => {
  const { currentTrack } = usePlayer();
  const { toggleLike, isLiked } = useLibrary();
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sidebarRef = useRef(null);

  // Auto-open whenever a new track is selected
  useEffect(() => {
    if (currentTrack) setIsOpen(true);
  }, [currentTrack?.id]);

  // Sync width to CSS variable so layout adjusts
  useEffect(() => {
    document.documentElement.style.setProperty('--right-sidebar-width', `${isOpen ? width : 0}px`);
  }, [width, isOpen]);

  // Resize drag logic (drag from LEFT edge of the sidebar)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !sidebarRef.current) return;
      const sidebarLeft = sidebarRef.current.getBoundingClientRect().left;
      const newWidth = sidebarLeft + width - e.clientX + width;
      // Simpler: width from right edge
      const windowWidth = window.innerWidth;
      const newW = windowWidth - e.clientX;
      if (newW >= MIN_WIDTH && newW <= MAX_WIDTH) setWidth(newW);
    };
    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, width]);

  const trackName = currentTrack?.name || 'Unknown Track';
  const artistName = currentTrack?.artists?.[0]?.name || 'Unknown Artist';
  
  // STABLE LISTENER COUNT
  const listenerCount = React.useMemo(() => {
    return Math.floor(Math.random() * 800 + 100);
  }, [artistName]);

  if (!currentTrack || !isOpen) return null;

  const trackIsLiked = isLiked(currentTrack.id);


  return (
    <>
      {/* ── Fullscreen Album Art Overlay ── */}
      {isFullscreen && (
        <div
          onClick={() => setIsFullscreen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <div style={{ width: '80vmin', height: '80vmin', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>
            <PlaylistImage item={currentTrack} type="track" size={600} />
          </div>
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{trackName}</div>
            <div style={{ fontSize: '16px', color: '#b3b3b3', marginTop: '8px' }}>{artistName}</div>
          </div>
          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              position: 'absolute', top: '24px', right: '24px',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '50%', width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>
      )}

      <aside
        ref={sidebarRef}
        className="no-scrollbar"
        style={{
          width: `${width}px`,
          minWidth: `${MIN_WIDTH}px`,
          maxWidth: `${MAX_WIDTH}px`,
          height: '100%',
          background: '#121212',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflowY: 'auto',
          boxSizing: 'border-box',
          position: 'relative',
          transition: isResizing ? 'none' : 'width 0.2s ease',
        }}
      >
        {/* ── Drag Handle (left edge) ── */}
        <div
          onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px',
            cursor: 'col-resize', zIndex: 10,
            background: isResizing ? 'rgba(255,255,255,0.2)' : 'transparent',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { if (!isResizing) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={e => { if (!isResizing) e.currentTarget.style.background = 'transparent'; }}
        />

        {/* ── Top Header Row ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 16px 12px 20px', flexShrink: 0
        }}>
          <h3 style={{
            fontSize: '14px', fontWeight: 700, margin: 0, color: '#fff',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {trackName}
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexShrink: 0, alignItems: 'center' }}>
            {/* Fullscreen expand button */}
            <button
              onClick={() => setIsFullscreen(true)}
              title="View full screen"
              style={{
                background: 'none', border: 'none', color: '#b3b3b3',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                padding: '4px', borderRadius: '4px', transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#b3b3b3'}
            >
              <ArrowUpRight size={18} />
            </button>
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              title="Close"
              style={{
                background: 'none', border: 'none', color: '#b3b3b3',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                padding: '4px', borderRadius: '4px', transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#b3b3b3'}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Album Art ── */}
        <div style={{
          width: '100%',
          padding: '0 16px',
          position: 'relative',
          flexShrink: 0,
          boxSizing: 'border-box',
          cursor: 'zoom-in',
        }}
          onClick={() => setIsFullscreen(true)}
        >
          <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <PlaylistImage item={currentTrack} type="track" size={width} />

            {/* Hover overlay hint */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0)',
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; }}
            >
              <Maximize2 size={32} color="#fff" style={{ opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* ── Track Info Row ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '16px 16px 12px',
          flexShrink: 0,
        }}>
          <div style={{ minWidth: 0, paddingRight: '12px' }}>
            <h2 style={{
              fontSize: '18px', fontWeight: 800, margin: '0 0 4px',
              color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>
              {trackName}
            </h2>
            <div style={{
              fontSize: '14px', color: '#b3b3b3', cursor: 'pointer',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              transition: 'color 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#b3b3b3'}
            >
              {artistName}
            </div>
          </div>
          <button 
            onClick={() => toggleLike(currentTrack)}
            title={trackIsLiked ? "Remove from Liked Songs" : "Add to Liked Songs"}
            style={{
              background: 'none', border: 'none', 
              color: trackIsLiked ? '#1DB954' : '#b3b3b3',
              cursor: 'pointer', flexShrink: 0, display: 'flex',
              alignItems: 'center', padding: '4px', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              if (!trackIsLiked) e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              if (!trackIsLiked) e.currentTarget.style.color = '#b3b3b3';
            }}
          >
            <Heart size={22} fill={trackIsLiked ? '#1DB954' : 'none'} />
          </button>
        </div>

        {/* ── About the Artist Card ── */}
        <div style={{
          margin: '0 12px 16px',
          borderRadius: '8px',
          overflow: 'hidden',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.06)',
        }}>
          {/* Artist header image (use album art as bg) */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: -1, overflow: 'hidden'
          }}>
            <PlaylistImage item={currentTrack} type="track" size={120} style={{ filter: 'brightness(0.6)' }} />
          </div>
          <div style={{
            width: '100%', height: '120px',
            background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7))',
            display: 'flex', alignItems: 'flex-end', padding: '12px',
            boxSizing: 'border-box',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>About the artist</span>
          </div>

          <div style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: '#fff' }}>
              {artistName}
            </h4>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '12px'
            }}>
              <span style={{ fontSize: '13px', color: '#b3b3b3' }}>
                {listenerCount.toLocaleString() + ',000'} monthly listeners
              </span>
              <button style={{
                background: 'transparent', border: '1px solid #727272',
                borderRadius: '24px', color: '#fff', fontSize: '12px',
                fontWeight: 700, padding: '5px 16px', cursor: 'pointer',
                transition: 'all 0.2s', fontFamily: 'inherit'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#727272'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                Follow
              </button>
            </div>
            <p style={{
              margin: 0, fontSize: '13px', color: '#b3b3b3', lineHeight: 1.6,
              display: '-webkit-box', WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              A versatile artist delivering captivating sounds across genres. Known for immersive production and 
              emotional depth. Follow for the latest releases and updates.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default RightSidebar;
