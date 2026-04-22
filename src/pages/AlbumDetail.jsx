import React from 'react';
import { useParams } from 'react-router-dom';
import { useSpotify } from '../hooks/useSpotify';
import { Play, Heart, Clock, MoreHorizontal } from 'lucide-react';
import TrackRow from '../components/cards/TrackRow';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';
import PlaylistImage from '../components/common/PlaylistImage';

const AlbumDetail = () => {
  const { id } = useParams();
  const { data: album, loading, error } = useSpotify('getAlbum', id);
  const { playTrack } = usePlayer();
  const { toggleLike, isLiked } = useLibrary();

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Loading the album...</div>;
  if (error) return <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Failed to load album.</div>;
  if (!album) return <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Album not found.</div>;

  const { name, images, artists, release_date, total_tracks, tracks } = album;
  const albumIsLiked = album ? isLiked(album.id) : false;

  const year = release_date ? new Date(release_date).getFullYear() : '';

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
        <div style={{ width: '232px', height: '232px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', flexShrink: 0 }}>
          <PlaylistImage item={album} type="album" size={232} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Album</span>
          <h1 style={{ fontSize: '72px', fontWeight: 900, margin: '8px 0' }}>{name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600 }}>
            <span style={{ cursor: 'pointer' }} className="hover:underline">{artists?.[0]?.name}</span>
            <span style={{ color: 'var(--text-muted)' }}>
              {year ? ` • ${year}` : ''}
              {total_tracks ? ` • ${total_tracks} songs` : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px' }}>
        <div className="tooltip-container">
          <button 
            onClick={() => {
              if (tracks?.items?.length) {
                playTrack(tracks.items[0], tracks.items);
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
            <Play size={28} className="fill-current" />
          </button>
          <span className="tooltip tooltip-bottom">Play {name}</span>
        </div>

        <div className="tooltip-container">
          <button
            onClick={() => album && toggleLike(album)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: albumIsLiked ? 'var(--accent)' : 'var(--text-muted)' }}
            className="control-button"
          >
            <Heart size={32} fill={albumIsLiked ? 'var(--accent)' : 'none'} />
          </button>
          <span className="tooltip tooltip-bottom">{albumIsLiked ? "Remove from Your Library" : "Save to Your Library"}</span>
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
        {tracks?.items?.map((track, index) => (
          <TrackRow key={(track.id || index) + '-' + index} track={track} index={index} showAlbum={false} />
        ))}
        {(!tracks?.items || tracks.items.length === 0) && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No tracks available for this album.
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetail;
