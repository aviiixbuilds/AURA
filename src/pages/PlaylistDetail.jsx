import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSpotify } from '../hooks/useSpotify';
import { Play, Heart, Clock, MoreHorizontal } from 'lucide-react';
import TrackRow from '../components/cards/TrackRow';

const PlaylistDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  let fallbackData = state?.fallbackData || null;
  
  if (!fallbackData) {
    try {
      const stored = JSON.parse(localStorage.getItem('aura-fallback-meta'));
      if (stored && stored.id === id) {
        fallbackData = stored;
      }
    } catch (e) {
      console.error("Failed to parse fallback meta", e);
    }
  }

  const { data: playlist, loading, error } = useSpotify('getPlaylist', id, fallbackData);

  if (loading) return <div style={{ color: 'var(--text-muted)' }}>Unfolding the playlist...</div>;
  if (error) return <div style={{ color: 'var(--text-muted)' }}>Failed to load playlist.</div>;
  if (!playlist) return <div style={{ color: 'var(--text-muted)' }}>Playlist not found.</div>;

  const { name, images, description, owner, tracks, followers } = playlist;
  const image = images?.[0]?.url || 'https://via.placeholder.com/300';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header Banner */}
      <section style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        gap: '24px', 
        padding: '24px 0',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
        marginBottom: '24px'
      }}>
        <img 
          src={image} 
          alt={name} 
          style={{ width: '232px', height: '232px', borderRadius: '4px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Playlist</span>
          <h1 style={{ fontSize: '72px', fontWeight: 900, margin: '8px 0' }}>{name}</h1>
          {description && <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{description}</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600 }}>
            <span>{owner?.display_name}</span>
            <span style={{ color: 'var(--text-muted)' }}>
              {followers?.total ? ` • ${followers.total.toLocaleString()} likes` : ''}
              {tracks?.total ? ` • ${tracks.total} songs` : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px' }}>
        <button style={{ 
          background: 'var(--accent)', border: 'none', borderRadius: '50%', 
          width: '56px', height: '56px', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', color: 'black', cursor: 'pointer' 
        }}>
          <Play size={28} className="fill-current" />
        </button>
        <Heart size={32} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
        <MoreHorizontal size={32} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
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
        {tracks?.items?.map((item, index) => {
          const track = item.track || item;
          if (!track) return null;
          return <TrackRow key={(track.id || index) + '-' + index} track={track} index={index} />;
        })}
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
