import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import TrackRow from '../components/cards/TrackRow';
import { Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import Tooltip from '../components/common/Tooltip';

const LikedSongs = () => {
  const { likedSongs } = useLibrary();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const isCurrentPlaylistPlaying = isPlaying && likedSongs.some(t => t.id === currentTrack?.id);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header Banner */}
      <section style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'clamp(16px, 4cqi, 40px)', 
        padding: '40px 0 40px 24px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
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

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px', paddingLeft: '24px' }}>
        <Tooltip content={isCurrentPlaylistPlaying ? 'Pause' : 'Play'}>
          <button 
            onClick={() => {
              if (isCurrentPlaylistPlaying) {
                togglePlay();
              } else if (likedSongs.length > 0) {
                playTrack(likedSongs[0], likedSongs);
              }
            }}
            style={{ 
              background: 'var(--accent)', border: 'none', borderRadius: '50%', 
              width: '56px', height: '56px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: 'black', cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            className="control-button"
          >
            {isCurrentPlaylistPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '4px' }}>
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            )}
          </button>
        </Tooltip>
      </div>

      {/* Track List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
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
