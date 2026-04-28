import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { spotify } from '../services/spotify';
import PlaylistCard from '../components/cards/PlaylistCard';
import TrackRow from '../components/cards/TrackRow';
import FilterBar from '../components/common/FilterBar';
import Loader from '../components/common/Loader';

const Search = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Tracks', 'Albums', 'Artists', 'Playlists'];

  // Sync query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setQuery(q);
  }, [location.search]);

  useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await spotify.search(query);
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <>
      <FilterBar 
        filters={filters} 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 24px 24px 24px' }}>
        {/* Search Bar Container in Main Area */}
        <div style={{ position: 'relative', maxWidth: '500px' }}>
          <div style={{ 
            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }}>
            <SearchIcon size={20} />
          </div>
          <input 
            type="text" 
            placeholder="What do you want to listen to?" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px 16px 12px 48px', 
              background: 'var(--bg-card)', 
              border: '1px solid transparent', 
              borderRadius: '24px', 
              color: 'white',
              fontFamily: 'inherit',
              fontSize: '14px',
              outline: 'none',
              transition: 'var(--transition-smooth)'
            }}
            onFocus={(e) => e.target.style.border = '1px solid var(--glass-border)'}
            onBlur={(e) => e.target.style.border = '1px solid transparent'}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              style={{ 
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {!query && (
          <section>
            <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Browse all</h2>
            <div className="card-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
              gap: '24px' 
            }}>
              {['Podcast', 'Live Events', 'Pop', 'Hip-Hop', 'Chart-topping', 'New Releases'].map(cat => (
                <div key={cat} className="card-hover" style={{ 
                  height: '180px', background: 'var(--bg-card)', borderRadius: '8px', 
                  padding: '16px', fontSize: '20px', fontWeight: 800, cursor: 'pointer'
                }}>
                  {cat}
                </div>
              ))}
            </div>
          </section>
        )}

        {loading && <Loader message="EXPLORING UNIVERSE.." />}

        {results && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Check if everything is empty */}
            {!(results.tracks?.items?.length || results.albums?.items?.length || results.artists?.items?.length || results.playlists?.items?.length) ? (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '100px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '12px' 
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800 }}>No results found for "{query}"</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Please check your spelling or use different keywords.</p>
              </div>
            ) : (
              <>
                {/* Tracks */}
                {results.tracks?.items?.length > 0 && (activeFilter === 'All' || activeFilter === 'Tracks') && (
                  <section>
                    <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Tracks</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {results.tracks.items.slice(0, 5).map((track, index) => (
                        <TrackRow key={track.id + '-' + index} track={track} index={index} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Albums */}
                {results.albums?.items?.length > 0 && (activeFilter === 'All' || activeFilter === 'Albums') && (
                  <section>
                    <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Albums</h2>
                    <div className="card-grid" style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                      gap: '24px' 
                    }}>
                      {results.albums.items.map(album => (
                        <PlaylistCard key={album.id} item={album} type="album" />
                      ))}
                    </div>
                  </section>
                )}

                {/* Artists */}
                {results.artists?.items?.length > 0 && (activeFilter === 'All' || activeFilter === 'Artists') && (
                  <section>
                    <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Artists</h2>
                    <div className="card-grid" style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                      gap: '24px' 
                    }}>
                      {results.artists.items.map(artist => (
                        <PlaylistCard key={artist.id} item={artist} type="artist" />
                      ))}
                    </div>
                  </section>
                )}

                {/* Playlists */}
                {results.playlists?.items?.length > 0 && (activeFilter === 'All' || activeFilter === 'Playlists') && (
                  <section>
                    <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Playlists</h2>
                    <div className="card-grid" style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                      gap: '24px' 
                    }}>
                      {results.playlists.items.map(playlist => (
                        <PlaylistCard key={playlist.id} item={playlist} type="playlist" />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );

};

export default Search;
