import React from 'react';
import { useParams } from 'react-router-dom';
import { useSpotify } from '../hooks/useSpotify';
import { Play, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import TrackRow from '../components/cards/TrackRow';

const ArtistPage = () => {
  const { id } = useParams();
  const { data: artist, loading: artLoading, error: artError } = useSpotify('getArtist', id);
  const { data: topTracks, loading: topLoading } = useSpotify('getArtistTopTracks', id);

  if (artLoading || topLoading) return <div style={{ color: 'var(--text-muted)' }}>Channeling the artist...</div>;
  if (artError) return <div style={{ color: 'var(--text-muted)' }}>Failed to load artist.</div>;
  if (!artist) return <div style={{ color: 'var(--text-muted)' }}>Artist not found.</div>;

  const { name, images, followers, genres } = artist;
  const image = images?.[0]?.url || 'https://via.placeholder.com/600';
  const genreList = Array.isArray(genres) ? genres : [];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header Banner */}
      <section style={{ 
        height: '40vh',
        display: 'flex', 
        alignItems: 'flex-end', 
        padding: '32px',
        margin: '-24px -24px 24px -24px',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={24} style={{ color: '#3d91ff' }} fill="#3d91ff" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Verified Artist</span>
          </div>
          <h1 style={{ fontSize: '96px', fontWeight: 900, margin: '0 0 16px 0' }}>{name}</h1>
          <span style={{ fontSize: '16px', fontWeight: 600 }}>
            {followers?.total ? `${followers.total.toLocaleString()} monthly listeners` : ''}
          </span>
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
        <button style={{ 
          background: 'transparent', border: '1px solid var(--text-muted)', 
          color: 'white', borderRadius: '4px', padding: '8px 16px', fontWeight: 700, 
          cursor: 'pointer' 
        }}>
          FOLLOW
        </button>
        <MoreHorizontal size={32} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        {/* Popular Tracks */}
        <section>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Popular</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topTracks?.tracks?.length > 0 ? (
              topTracks.tracks.slice(0, 5).map((track, index) => (
                <TrackRow key={(track.id || index) + '-' + index} track={track} index={index} showAlbum={false} />
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', padding: '16px' }}>No top tracks available.</div>
            )}
          </div>
        </section>

        {/* Artist Pick / About */}
        <section>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>About</h2>
          <div style={{ 
            background: 'var(--bg-card)', padding: '24px', borderRadius: '12px',
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${image})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
          }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <span style={{ fontSize: '14px', fontWeight: 700 }}>Genres</span>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                 {genreList.length > 0 ? (
                   genreList.map(genre => (
                     <span key={genre} style={{ 
                       background: 'rgba(255,255,255,0.1)', padding: '4px 12px', 
                       borderRadius: '16px', fontSize: '12px' 
                     }}>{genre}</span>
                   ))
                 ) : (
                   <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No genre info available</span>
                 )}
               </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArtistPage;
