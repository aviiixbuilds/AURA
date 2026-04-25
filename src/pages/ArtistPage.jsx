import React from 'react';
import { useParams } from 'react-router-dom';
import { useSpotify } from '../hooks/useSpotify';
import { Play, MoreHorizontal, CheckCircle } from 'lucide-react';
import TrackRow from '../components/cards/TrackRow';
import PlaylistImage from '../components/common/PlaylistImage';
import Tooltip from '../components/common/Tooltip';
import Loader from '../components/common/Loader';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';

const ArtistPage = () => {
  const { id } = useParams();
  const { data: artist, loading: artLoading, error: artError } = useSpotify('getArtist', id);
  const { data: topTracks, loading: topLoading } = useSpotify('getArtistTopTracks', id);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const { toggleFollow, isFollowing } = useLibrary();

  if (artLoading || topLoading) return <Loader />;
  if (artError) return <div style={{ color: 'var(--text-muted)' }}>Failed to load artist.</div>;
  if (!artist) return <div style={{ color: 'var(--text-muted)' }}>Artist not found.</div>;

  const { name, followers, genres } = artist;
  const genreList = Array.isArray(genres) ? genres : [];
  
  const artistIsFollowing = isFollowing(id);
  
  const handlePlayArtist = () => {
    const validTracks = topTracks?.tracks?.filter(Boolean) || [];
    if (validTracks.length > 0) {
      const firstTrack = validTracks[0];
      if (currentTrack?.id === firstTrack?.id) {
        togglePlay();
      } else {
        playTrack(firstTrack);
      }
    }
  };

  const isCurrentArtistPlaying = isPlaying && topTracks?.tracks?.some(t => t?.id === currentTrack?.id);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header Banner */}
      <section style={{ 
        height: '40vh',
        display: 'flex', 
        alignItems: 'flex-end', 
        padding: '32px',
        margin: '-24px -24px 24px -24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
          <PlaylistImage item={artist} type="artist" size={1200} style={{ filter: 'brightness(0.6)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.8))' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 1, flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={24} style={{ color: '#3d91ff' }} fill="#3d91ff" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Verified Artist</span>
          </div>
          <h1 style={{ 
            fontSize: 'clamp(48px, 12cqi, 128px)', 
            fontWeight: 900, 
            margin: '0 0 16px 0',
            lineHeight: 1.1,
            wordBreak: 'break-word'
          }}>{name}</h1>
          <span style={{ fontSize: '16px', fontWeight: 600 }}>
            {followers?.total ? `${followers.total.toLocaleString()} monthly listeners` : ''}
          </span>
        </div>
      </section>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px', paddingLeft: '24px' }}>
        <Tooltip content={isCurrentArtistPlaying ? 'Pause' : 'Play'}>
          <button 
            onClick={handlePlayArtist}
            style={{ 
              background: 'var(--accent)', border: 'none', borderRadius: '50%', 
              width: '56px', height: '56px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: 'black', cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            className="control-button"
          >
            {isCurrentArtistPlaying ? (
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

        <Tooltip content={isFollowing(id) ? "Unfollow" : "Follow"}>
          <button 
            onClick={() => toggleFollow(artist)}
            style={{ 
              background: 'transparent', border: '1px solid var(--text-muted)', 
              color: isFollowing(id) ? 'var(--accent)' : 'white', 
              borderRadius: '24px', padding: '8px 24px', fontWeight: 700, 
              cursor: 'pointer', transition: 'all 0.2s',
              borderColor: isFollowing(id) ? 'var(--accent)' : 'var(--text-muted)'
            }}
            className="control-button"
          >
            {isFollowing(id) ? 'FOLLOWING' : 'FOLLOW'}
          </button>
        </Tooltip>

        <Tooltip content={`More options for ${name}`}>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} className="control-button">
            <MoreHorizontal size={32} />
          </button>
        </Tooltip>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        {/* Popular Tracks */}
        <section>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Popular</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topTracks?.tracks?.length > 0 ? (
              topTracks.tracks.filter(Boolean).slice(0, 5).map((track, index) => (
                <TrackRow key={(track?.id || index) + '-' + index} track={track} index={index} showAlbum={false} />
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
            position: 'relative', overflow: 'hidden',
            height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
          }}>
             <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
               <PlaylistImage item={artist} type="artist" size={400} style={{ filter: 'brightness(0.4)' }} />
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8))' }} />
             </div>
             <div style={{ position: 'relative', zIndex: 1 }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <span style={{ fontSize: '14px', fontWeight: 700 }}>Genres</span>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                 {genreList.length > 0 ? (
                   genreList.map((genre, i) => {
                     const genreName = typeof genre === 'string' ? genre : (genre?.name || 'Unknown');
                     return (
                       <span key={i} style={{ 
                         background: 'rgba(255,255,255,0.1)', padding: '4px 12px', 
                         borderRadius: '16px', fontSize: '12px', textTransform: 'capitalize'
                       }}>{genreName}</span>
                     );
                   })
                 ) : (
                   <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No genre info available</span>
                 )}
               </div>
             </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArtistPage;
