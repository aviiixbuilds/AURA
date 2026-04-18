import React from 'react';
import { useParams } from 'react-router-dom';
import { useSpotify } from '../hooks/useSpotify';
import { Play, Heart, Clock, MoreHorizontal } from 'lucide-react';
import TrackRow from '../components/cards/TrackRow';

const AlbumDetail = () => {
  const { id } = useParams();
  const { data: album, loading } = useSpotify('getAlbum', id);

  if (loading) return <div style={{ color: 'var(--text-muted)' }}>Crating the album...</div>;
  if (!album) return <div style={{ color: 'var(--text-muted)' }}>Album not found.</div>;

  const { name, images, artists, release_date, total_tracks, tracks } = album;
  const image = images?.[0]?.url || 'https://via.placeholder.com/300';
  const year = new Date(release_date).getFullYear();

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
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Album</span>
          <h1 style={{ fontSize: '72px', fontWeight: 900, margin: '8px 0' }}>{name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600 }}>
            <span style={{ cursor: 'pointer' }} className="hover:underline">{artists[0].name}</span>
            <span style={{ color: 'var(--text-muted)' }}>• {year} • {total_tracks} songs</span>
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
        display: 'grid', gridTemplateColumns: '40px 1fr 40px', gap: '16px', 
        alignItems: 'center', padding: '0 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)',
        color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        <span>#</span>
        <span>Title</span>
        <Clock size={16} />
      </div>

      {/* Track List */}
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
        {tracks.items.map((track, index) => (
          <TrackRow key={track.id} track={track} index={index} showAlbum={false} />
        ))}
      </div>
    </div>
  );
};

export default AlbumDetail;
