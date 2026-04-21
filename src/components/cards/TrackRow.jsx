import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useLibrary } from '../../context/LibraryContext';

const TrackRow = ({ track, index, showAlbum = true }) => {
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const { toggleLike, isLiked } = useLibrary();
  const isActive = currentTrack?.id === track.id;
  const liked = isLiked(track.id);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div 
      onClick={() => playTrack(track)}
      className="hover:bg-white/10"
      style={{ 
        display: 'grid', 
        gridTemplateColumns: showAlbum ? '40px 1fr 1fr 100px' : '40px 1fr 100px', 
        gap: '16px', 
        alignItems: 'center', 
        padding: '12px 16px', 
        borderRadius: '4px',
        cursor: 'pointer', 
        transition: 'var(--transition-smooth)',
        color: isActive ? 'var(--accent)' : 'inherit'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isActive && isPlaying ? (
          <Pause size={16} className="fill-current" />
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>{index + 1}</span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {(() => {
          const imgUrl = track.album?.images?.[0]?.url || track.images?.[0]?.url || track.album?.images?.[track.album?.images?.length - 1]?.url;
          return imgUrl ? (
            <img 
              src={imgUrl} 
              alt={track.name} 
              style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: '#282828', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{color: '#555', fontSize: '10px'}}>{track.name.charAt(0)}</span>
            </div>
          );
        })()}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ 
            fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', 
            overflow: 'hidden', textOverflow: 'ellipsis' 
          }}>
            {track.name}
          </span>
          <span style={{ 
            fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', 
            overflow: 'hidden', textOverflow: 'ellipsis' 
          }}>
            {track.artists.map(a => a.name).join(', ')}
          </span>
        </div>
      </div>

      {showAlbum && (
        <span style={{ 
          fontSize: '14px', color: 'var(--text-muted)', whiteSpace: 'nowrap', 
          overflow: 'hidden', textOverflow: 'ellipsis' 
        }}>
          {track.album?.name}
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'flex-end' }}>
        <Heart 
          size={18} 
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track);
          }}
          style={{ 
            color: liked ? 'var(--accent)' : 'var(--text-muted)', 
            fill: liked ? 'var(--accent)' : 'none',
            transition: 'var(--transition-smooth)'
          }} 
        />
        <span style={{ fontSize: '14px', color: 'var(--text-muted)', width: '35px', textAlign: 'right' }}>
          {formatTime(track.duration_ms)}
        </span>
      </div>
    </div>
  );
};

export default TrackRow;
