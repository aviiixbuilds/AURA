import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import PlaylistCard from '../components/cards/PlaylistCard';
import { Heart, Activity, User, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div style={{ 
    background: 'var(--bg-card)', padding: '24px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid var(--glass-border)'
  }}>
    <div style={{ 
      width: '48px', height: '48px', borderRadius: '12px', background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
    }}>
      <Icon size={24} />
    </div>
    <div>
      <div style={{ fontSize: '24px', fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  </div>
);

const Library = () => {
  const { likedSongs, stats } = useLibrary();
  const navigate = useNavigate();

  const topArtistName = Object.entries(stats.topArtists)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None yet';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <section>
        <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Your Library</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
           {/* Liked Songs Tile */}
           <div 
             onClick={() => navigate('/liked')}
             style={{ 
               gridColumn: 'span 2', 
               background: 'linear-gradient(135deg, #450af5, #c4efd9)',
               borderRadius: '8px', padding: '32px', cursor: 'pointer',
               display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
               gap: '12px', height: '100%'
             }}
           >
             <h2 style={{ fontSize: '32px', fontWeight: 800 }}>Liked Songs</h2>
             <p style={{ fontWeight: 600 }}>{likedSongs.length} liked songs</p>
           </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Session Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          <StatCard icon={Music} label="Tracks Played" value={stats.playCount} color="#1db954" />
          <StatCard icon={User} label="Top Artist" value={topArtistName} color="#450af5" />
          <StatCard icon={Activity} label="Activity Level" value="High" color="#e91429" />
        </div>
      </section>

      {likedSongs.length > 0 && (
        <section>
          <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Recently Liked</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
            {likedSongs.slice(0, 6).map(track => (
              <PlaylistCard key={track.id} item={track} type="track" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Library;
