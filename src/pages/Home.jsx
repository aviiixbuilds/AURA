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
  const { data: featured, loading: featLoading } = useSpotify('getFeaturedPlaylists');
  const { data: newReleases, loading: newLoading } = useSpotify('getNewReleases');

  const moods = [
    { title: 'Focused', emoji: '🧠', color: '#4c2b91' },
    { title: 'Late Night', emoji: '🌙', color: '#002d4b' },
    { title: 'Energy', emoji: '⚡', color: '#8c1a1a' },
    { title: 'Melancholic', emoji: '🌧️', color: '#2b4c2b' }
  ];

  if (featLoading || newLoading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading the universe...</div>;
  }

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
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px' }}>Featured Playlists</h2>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}>Show all</span>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: '24px' 
        }}>
          {featured?.playlists?.items?.map(item => (
            <PlaylistCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* New Releases */}
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
          {newReleases?.albums?.items?.map(item => (
            <PlaylistCard key={item.id} item={item} type="album" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
