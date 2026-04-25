import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import TrackRow from '../components/cards/TrackRow';
import { Heart } from 'lucide-react';

const LikedSongs = () => {
  const { likedSongs } = useLibrary();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header Banner */}
      <section style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'clamp(16px, 4cqi, 40px)', 
        padding: '40px 0 40px 24px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
        marginBottom: '24px'
      }}>
        <div style={{ 
          width: 'clamp(140px, 20cqi, 232px)', 
          height: 'clamp(140px, 20cqi, 232px)', 
          borderRadius: '4px', 
          background: 'linear-gradient(135deg, #450af5, #c4efd9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          flexShrink: 0
        }}>
          <Heart size={80} fill="white" color="white" style={{ width: '40%', height: '40%' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Playlist</span>
          <h1 style={{ 
            fontSize: 'clamp(32px, 7cqi, 96px)', 
            fontWeight: 900, 
            margin: '0 0 8px 0',
            lineHeight: 1.1,
            wordBreak: 'break-word'
          }}>Liked Songs</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600, flexWrap: 'wrap' }}>
            <span>Your personal collection</span>
            <span style={{ color: 'var(--text-muted)' }}>• {likedSongs.length} songs</span>
          </div>
        </div>
      </section>

      {/* Track List */}
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
        {likedSongs.length > 0 ? (
          likedSongs.map((track, index) => (
            <TrackRow key={track.id} track={track} index={index} />
          ))
        ) : (
          <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Heart size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3>Your liked songs will appear here</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongs;
