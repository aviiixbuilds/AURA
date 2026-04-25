import React from 'react';
import { useParams } from 'react-router-dom';
import { useSpotify } from '../hooks/useSpotify';
import { Play, Heart, Clock, MoreHorizontal } from 'lucide-react';
import TrackRow from '../components/cards/TrackRow';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';
import PlaylistImage from '../components/common/PlaylistImage';

const PlaylistDetail = () => {
  const { id } = useParams();
  const { data: playlist, loading, error } = useSpotify('getPlaylist', id);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const { toggleLike, isLiked } = useLibrary();

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Unfolding the playlist...</div>;
  if (error) return <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Failed to load playlist.</div>;
  if (!playlist) return <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Playlist not found.</div>;

  const { name, images, description, owner, tracks, followers } = playlist;
  const playlistIsLiked = playlist ? isLiked(playlist.id) : false;
  const isCurrentPlaylistPlaying = isPlaying && tracks?.items?.some(i => (i.track?.id || i.id) === currentTrack?.id);

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
          overflow: 'hidden', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)', 
          flexShrink: 0 
        }}>
          <PlaylistImage item={playlist} type="playlist" size={232} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Playlist</span>
          <h1 style={{ 
            fontSize: 'clamp(32px, 8cqi, 96px)', 
            fontWeight: 900, 
            margin: '0 0 8px 0', 
            lineHeight: 1.1,
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>{name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600, flexWrap: 'wrap' }}>
            <span>{owner?.display_name}</span>
            <span style={{ color: 'var(--text-muted)' }}>
              {followers?.total ? ` • ${followers.total.toLocaleString()} likes` : ''}
              {tracks?.total ? ` • ${tracks.total} songs` : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px', paddingLeft: '24px' }}>
        <div className="tooltip-container">
          <button 
            onClick={() => {
              if (isCurrentPlaylistPlaying) {
                togglePlay();
              } else if (tracks?.items?.length) {
                const queue = tracks.items.map(i => i.track || i).filter(Boolean);
                playTrack(queue[0], queue);
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
          <span className="tooltip tooltip-bottom">{isCurrentPlaylistPlaying ? 'Pause' : 'Play'} {name}</span>
        </div>

        <div className="tooltip-container">
          <button
            onClick={() => playlist && toggleLike(playlist)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: playlistIsLiked ? 'var(--accent)' : 'var(--text-muted)' }}
            className="control-button"
          >
            <Heart size={32} fill={playlistIsLiked ? 'var(--accent)' : 'none'} />
          </button>
          <span className="tooltip tooltip-bottom">{playlistIsLiked ? "Remove from Your Library" : "Save to Your Library"}</span>
        </div>

        <div className="tooltip-container">
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)' }}
            className="control-button"
          >
            <MoreHorizontal size={32} />
          </button>
          <span className="tooltip tooltip-bottom">More options for {name}</span>
        </div>
      </div>

      {/* Track List Header */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px', gap: '16px', 
        alignItems: 'center', padding: '0 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)',
        color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <Clock size={16} />
      </div>

      {/* Track List */}
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
        {(() => {
          const queue = tracks?.items?.map(i => i.track || i).filter(Boolean) || [];
          return tracks?.items?.map((item, index) => {
            const track = item.track || item;
            if (!track) return null;
            return <TrackRow key={(track.id || index) + '-' + index} track={track} index={index} collection={queue} />;
          });
        })()}
        {(!tracks?.items || tracks.items.length === 0) && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No tracks available for this playlist.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
