import React from 'react';
import { useSpotify } from '../hooks/useSpotify';
import PlaylistCard from '../components/cards/PlaylistCard';

const MoodCard = ({ title, emoji, color }) => (
  <div 
    className="card-hover"
    style={{ 
      background: color, 
      padding: '24px', 
      borderRadius: '8px', 
      height: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      cursor: 'pointer'
    }}
  >
    <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{title}</h2>
    <span style={{ fontSize: '48px', alignSelf: 'flex-end' }}>{emoji}</span>
  </div>
);

const Home = () => {
  const { data: homeData, loading, error } = useSpotify('getHomeData');

  const moods = [
    { title: 'Focused', emoji: '🧠', color: '#4c2b91' },
    { title: 'Late Night', emoji: '🌙', color: '#002d4b' },
    { title: 'Energy', emoji: '⚡', color: '#8c1a1a' },
    { title: 'Melancholic', emoji: '🌧️', color: '#2b4c2b' }
  ];

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading the universe...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--text-muted)' }}>Failed to load data. Please check your API key.</div>;
  }

  const featured = homeData?.featured;
  const newReleases = homeData?.newReleases;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Hero Section */}
      <section>
        <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Good evening</h1>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '16px' 
        }}>
          {moods.map(mood => (
            <MoodCard key={mood.title} {...mood} />
          ))}
        </div>
      </section>

      {/* Featured Playlists */}
      {featured?.playlists?.items?.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px' }}>Trending Now</h2>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}>Show all</span>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '24px' 
          }}>
            {featured.playlists.items.map(item => (
              <PlaylistCard key={item.id} item={item} type="playlist" />
            ))}
          </div>
        </section>
      )}

      {/* Trending Tracks */}
      {featured?.tracks?.items?.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px' }}>Hot Tracks</h2>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}>Show all</span>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '24px' 
          }}>
            {featured.tracks.items.slice(0, 6).map(item => (
              <PlaylistCard key={item.id} item={{
                ...item,
                images: item.album?.images || []
              }} type="track" />
            ))}
          </div>
        </section>
      )}

      {/* New Release Albums */}
      {newReleases?.albums?.items?.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px' }}>New Releases</h2>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}>Show all</span>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '24px' 
          }}>
            {newReleases.albums.items.map(item => (
              <PlaylistCard key={item.id} item={item} type="album" />
            ))}
          </div>
        </section>
      )}

      {/* Trending Artists */}
      {featured?.artists?.items?.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px' }}>Popular Artists</h2>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}>Show all</span>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '24px' 
          }}>
            {featured.artists.items.slice(0, 6).map(item => (
              <PlaylistCard key={item.id} item={item} type="artist" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
