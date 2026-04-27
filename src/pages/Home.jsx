import React from 'react';
import { useSpotify } from '../hooks/useSpotify';
import PlaylistCard from '../components/cards/PlaylistCard';
import FilterBar from '../components/common/FilterBar';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';
import { Play, Heart, Plus } from 'lucide-react';
import PlaylistImage from '../components/common/PlaylistImage';
import Loader from '../components/common/Loader';

const QuickCard = ({ item, type = 'playlist', customTitle, customImage, onClick }) => {
  const navigate = useNavigate();
  const { playTrack } = usePlayer();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (item?.id) {
      navigate(`/${type}/${item.id}`);
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (type === 'track' && item) {
      playTrack(item);
    } else if (item?.id) {
      navigate(`/${type}/${item.id}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="quick-card-hover"
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.07)',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
        position: 'relative'
      }}
    >
      <div style={{ width: '64px', height: '64px', flexShrink: 0, boxShadow: '4px 0 8px rgba(0,0,0,0.2)' }}>
        {customImage ? customImage : <PlaylistImage item={item} type={type} size={64} />}
      </div>
      <div style={{ padding: '0 16px', flex: 1, minWidth: 0 }}>
        <span style={{ 
          fontSize: '15px', 
          fontWeight: 700, 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          display: 'block'
        }}>
          {customTitle || item?.name}
        </span>
      </div>
      <div 
        className="quick-play-button"
        onClick={handlePlayClick}
        style={{
          marginRight: '12px',
          background: 'var(--accent)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          opacity: 0,
          transform: 'scale(0.8)',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        <Play size={20} className="fill-current" />
      </div>
    </div>
  );
};

const Home = () => {
  const { data: homeData, loading, error } = useSpotify('getHomeData');
  const { recentlyPlayed } = useLibrary();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = React.useState('All');

  if (loading) {
    return <Loader message="INITIALIZING AURA...." />;
  }

  if (error) {
    return <div style={{ color: 'var(--text-muted)' }}>Failed to load data. Please check your API key.</div>;
  }

  const featured = homeData?.featured;
  const newReleases = homeData?.newReleases;

  const filters = ['All', 'Music', 'Podcasts'];

  return (
    <div style={{ position: 'relative' }}>
      {/* The "HUGE" Gradient Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '300px', 
        background: `linear-gradient(to bottom, rgba(7, 133, 121, 0.95) 0%, rgba(7, 133, 121, 0.3) 50%, transparent 100%)`,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <FilterBar 
        filters={filters} 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 24px 24px 24px', position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <section>
          <h1 style={{ fontSize: '32px', marginBottom: '24px', marginTop: '8px', fontWeight: 800 }}>Good evening</h1>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gridAutoRows: '64px',
            gap: '16px 24px'
          }}>
            {/* 1. Last played song */}
            {recentlyPlayed.length > 0 && (
              <QuickCard 
                item={recentlyPlayed[0]} 
                type="track" 
              />
            )}

            {/* 2. Liked Songs */}
            <QuickCard 
              customTitle="Liked Songs"
              onClick={() => navigate('/library/liked')}
              customImage={
                <div style={{ 
                  width: '100%', height: '100%', 
                  background: 'linear-gradient(135deg, #450af5, #c4efd9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Heart size={28} fill="white" color="white" />
                </div>
              }
            />

            {/* 3-8: From recently played or featured */}
            {recentlyPlayed.slice(1, 7).map((item, idx) => (
              <QuickCard key={`recent-${idx}`} item={item} type={item._type || 'playlist'} />
            ))}

            {recentlyPlayed.length < 7 && featured?.playlists?.items?.slice(0, 6 - (recentlyPlayed.length - 1)).map((item, idx) => (
              <QuickCard key={`feat-${idx}`} item={item} type="playlist" />
            ))}
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .quick-card-hover:hover {
              background: rgba(255, 255, 255, 0.15) !important;
            }
            .quick-card-hover:hover .quick-play-button {
              opacity: 1;
              transform: scale(1);
            }
          `}} />
        </section>

        {/* Picked for you & Recommended Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
          {featured?.playlists?.items?.[0] && (
            <section>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: 800 }}>Picked for you</h2>
              <div 
                className="card-hover"
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '20px', 
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center'
                }}
              >
                <div style={{ width: '180px', height: '180px', flexShrink: 0, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  <PlaylistImage item={featured.playlists.items[0]} type="playlist" size={180} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Playlist</span>
                  <h3 style={{ fontSize: '32px', fontWeight: 900 }}>{featured.playlists.items[0].name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                    <button 
                      onClick={() => navigate(`/playlist/${featured.playlists.items[0].id}`)}
                      style={{ 
                        background: 'white', color: 'black', border: 'none', 
                        borderRadius: '50%', width: '48px', height: '48px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Play size={24} fill="black" />
                    </button>
                    <button style={{ background: 'none', border: '1px solid #727272', color: 'white', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Plus size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Recommended for...</h2>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}>Show all</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
              {featured?.playlists?.items?.slice(1, 3).map(item => (
                <PlaylistCard key={item.id} item={item} type="playlist" />
              ))}
            </div>
          </section>
        </div>

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
        {/* Recently Played */}
        {recentlyPlayed.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Recents</h2>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}>Show all</span>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
              gap: '24px' 
            }}>
              {recentlyPlayed.map((item, idx) => (
                <PlaylistCard key={`recent-list-${idx}`} item={item} type={item._type || 'playlist'} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
