import React, { useState } from 'react';
import { X, PlusCircle, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const RightSidebar = () => {
  const { currentTrack } = usePlayer();
  const [isOpen, setIsOpen] = useState(true);

  // If no track is playing or it's dismissed, don't show the sidebar.
  // In a full implementation, you could have a toggle button in the player footer to re-open it.
  if (!currentTrack || !isOpen) {
    return null;
  }

  const trackName = currentTrack.name || 'Unknown Track';
  const artistName = currentTrack.artists?.[0]?.name || 'Unknown Artist';
  const image = currentTrack.album?.images?.[0]?.url || currentTrack.images?.[0]?.url || 'https://via.placeholder.com/400';
  
  // Spotify typically fetches this dynamically, but for UI parity we provide generic/detailed mock stats
  // if not available directly on the track object.
  const followers = currentTrack.artists?.[0]?.followers?.total 
    ? currentTrack.artists[0].followers.total.toLocaleString() 
    : '63,595'; 

  return (
    <aside
      className="no-scrollbar"
      style={{
        width: '360px',
        height: '100%',
        background: '#121212',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        flexShrink: 0,
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {trackName}
        </h3>
        <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
          <MoreHorizontal size={20} color="#b3b3b3" style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#b3b3b3'} />
          <X size={20} color="#b3b3b3" style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#b3b3b3'} />
        </div>
      </div>

      {/* Album Artwork */}
      <div style={{
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#282828',
        marginBottom: '24px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
      }}>
        <img src={image} alt="Album Art" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Info Row: Title, Artist and Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ minWidth: 0, paddingRight: '12px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 800, 
            margin: '0 0 4px 0', 
            color: '#fff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {trackName}
          </h2>
          <div style={{ 
            fontSize: '16px', 
            color: '#b3b3b3',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
           onMouseLeave={e => e.currentTarget.style.color = '#b3b3b3'}
          >
            {artistName}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
           <PlusCircle size={22} color="#b3b3b3" style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#b3b3b3'} />
        </div>
      </div>

      {/* About the Artist Card */}
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#fff' }}>About the artist</h4>
        
        {/* Artist Header (Image + Name) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
           <div style={{
             width: '64px',
             height: '64px',
             borderRadius: '50%',
             overflow: 'hidden',
             background: '#333'
           }}>
             <img src={image} alt={artistName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           </div>
           
           <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#fff' }}>
             {artistName}
           </h4>
        </div>

        {/* Listeners & Follow Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <span style={{ fontSize: '14px', color: '#b3b3b3' }}>
             {followers} monthly listeners
           </span>
           <button style={{
             background: 'transparent',
             border: '1px solid #727272',
             borderRadius: '24px',
             color: '#fff',
             fontSize: '12px',
             fontWeight: 700,
             padding: '6px 16px',
             cursor: 'pointer',
             transition: 'transform 0.1s, border-color 0.2s',
             fontFamily: 'inherit'
           }}
           onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'scale(1.04)'; }}
           onMouseLeave={e => { e.currentTarget.style.borderColor = '#727272'; e.currentTarget.style.transform = 'scale(1)'; }}
           >
             Follow
           </button>
        </div>

        {/* Artist Bio */}
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#b3b3b3',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          I'm an independent Artist. I've been blessed to hit the stage with many talented individuals. 
          Bringing a unique blend of energetic flows and deeply personal storytelling. Listen to my 
          latest releases and join the journey as I continue to explore new sounds and push boundaries.
        </p>
      </div>

    </aside>
  );
};

export default RightSidebar;
