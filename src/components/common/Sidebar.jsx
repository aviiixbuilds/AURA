import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Search, Library, Heart, Plus, 
  ArrowRight, Search as SearchIcon, ListFilter,
  Pin, Music
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';

/* ─── Small Navigation Links (Home, Search) ─── */
const NavItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '8px 12px',
      borderRadius: '8px',
      color: isActive ? '#fff' : '#b3b3b3',
      fontWeight: 700,
      fontSize: '15px',
      transition: 'color 0.2s'
    })}
  >
    <Icon size={24} />
    <span>{label}</span>
  </NavLink>
);

/* ─── Playlist Row Item ─── */
const LibraryItem = ({ item, type = 'playlist' }) => {
  const navigate = useNavigate();
  const image = item.images?.[0]?.url;
  const subtitle = type === 'liked'
    ? `Playlist • ${item.count || 0} songs`
    : `${item.type || 'Playlist'} • ${item.owner?.display_name || ''}`;

  return (
    <div
      onClick={() => {
        if (type === 'liked') return navigate('/liked');
        navigate(`/${item.type || 'playlist'}/${item.id}`);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Thumbnail */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: type === 'artist' ? '50%' : '4px',
        background: type === 'liked'
          ? 'linear-gradient(135deg, #450af5, #c4efd9)'
          : '#282828',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {image ? (
          <img src={image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : type === 'liked' ? (
          <Heart size={20} fill="white" color="white" />
        ) : (
          <Music size={20} color="#b3b3b3" />
        )}
      </div>

      {/* Text */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          color: type === 'liked' ? '#fff' : '#e0e0e0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {item.name}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#a7a7a7',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
};

/* ─── Filter Chip ─── */
const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? '#fff' : 'rgba(255,255,255,0.08)',
      color: active ? '#000' : '#fff',
      border: 'none',
      borderRadius: '16px',
      padding: '6px 14px',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
      fontFamily: 'inherit'
    }}
  >
    {label}
  </button>
);

/* ─── Main Sidebar Component ─── */
const Sidebar = () => {
  const navigate = useNavigate();
  const { likedSongs, playlists: userPlaylists, libraryItems, fetchLibrary } = useLibrary();
  const { currentTrack } = usePlayer();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const searchInputRef = useRef(null);

  const MIN_WIDTH = 280;
  const MAX_WIDTH = 480;

  // Fetch library items on mount
  useEffect(() => {
    if (fetchLibrary) fetchLibrary();
  }, []);

  // Resize handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX));
      setSidebarWidth(newWidth);
      document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Build the library list
  const allItems = [];

  // Liked Songs always first
  allItems.push({
    _type: 'liked',
    id: 'liked-songs',
    name: 'Liked Songs',
    count: likedSongs.length,
    images: [],
    pinned: true
  });

  // Add library items from API
  if (libraryItems) {
    libraryItems.forEach(item => {
      allItems.push(item);
    });
  }

  // Add user-created playlists
  if (userPlaylists) {
    userPlaylists.forEach(p => {
      if (!allItems.find(x => x.id === p.id)) {
        allItems.push({ ...p, type: 'playlist' });
      }
    });
  }

  // Filter
  const filteredItems = allItems.filter(item => {
    // Type filter
    if (activeFilter === 'playlists' && item.type !== 'playlist' && item._type !== 'liked') return false;
    if (activeFilter === 'artists' && item.type !== 'artist') return false;
    if (activeFilter === 'albums' && item.type !== 'album') return false;

    // Search filter
    if (searchQuery) {
      return item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  const handleCreatePlaylist = () => {
    const name = `My Playlist #${(userPlaylists?.length || 0) + 1}`;
    const newPlaylist = {
      id: `user-pl-${Date.now()}`,
      name,
      description: '',
      images: [],
      owner: { display_name: 'You' },
      tracks: { total: 0, items: [] },
      followers: { total: 0 },
      type: 'playlist'
    };
    // This will be handled by the LibraryContext
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('aura-playlists') || '[]');
      existing.push(newPlaylist);
      localStorage.setItem('aura-playlists', JSON.stringify(existing));
      window.location.reload(); // Simple refresh — could be improved
    }
  };

  return (
    <aside
      ref={sidebarRef}
      style={{
        width: `${sidebarWidth}px`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#121212',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        position: 'relative',
        flexShrink: 0
      }}
    >
      {/* ─── Top Navigation ─── */}
      <div style={{
        padding: '12px 16px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        background: '#121212',
        borderRadius: '8px 8px 0 0'
      }}>
        <NavItem icon={Home} label="Home" to="/" />
        <NavItem icon={Search} label="Search" to="/search" />
      </div>

      {/* ─── Library Section ─── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#121212',
        borderRadius: '0 0 8px 8px',
        marginTop: '8px',
        overflow: 'hidden'
      }}>
        {/* Library Header */}
        <div style={{
          padding: '12px 16px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <NavLink
            to="/library"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#b3b3b3',
              fontWeight: 700,
              fontSize: '15px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#b3b3b3'}
          >
            <Library size={24} />
            <span>Your Library</span>
          </NavLink>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleCreatePlaylist}
              title="Create playlist"
              style={{
                background: 'none',
                border: 'none',
                color: '#b3b3b3',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#b3b3b3';
              }}
            >
              <Plus size={20} />
            </button>
            <button
              title="Expand sidebar"
              style={{
                background: 'none',
                border: 'none',
                color: '#b3b3b3',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#b3b3b3';
              }}
              onClick={() => {
                const newW = sidebarWidth < 400 ? MAX_WIDTH : MIN_WIDTH;
                setSidebarWidth(newW);
                document.documentElement.style.setProperty('--sidebar-width', `${newW}px`);
              }}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div style={{
          padding: '12px 16px 8px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}
        className="no-scrollbar"
        >
          {[
            { key: 'all', label: 'All' },
            { key: 'playlists', label: 'Playlists' },
            { key: 'artists', label: 'Artists' },
            { key: 'albums', label: 'Albums' }
          ].map(f => (
            <FilterChip
              key={f.key}
              label={f.label}
              active={activeFilter === f.key}
              onClick={() => setActiveFilter(activeFilter === f.key ? 'all' : f.key)}
            />
          ))}
        </div>

        {/* Search & Sort Row */}
        <div style={{
          padding: '4px 16px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {searchOpen ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '4px',
                padding: '4px 8px'
              }}>
                <SearchIcon size={16} color="#b3b3b3" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search in Your Library"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    width: '140px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#b3b3b3',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <SearchIcon size={16} />
              </button>
            )}
          </div>

          <button style={{
            background: 'none',
            border: 'none',
            color: '#b3b3b3',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'inherit'
          }}>
            Recents
            <ListFilter size={16} />
          </button>
        </div>

        {/* ─── Scrollable Library List ─── */}
        <div
          className="no-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 8px 8px'
          }}
        >
          {filteredItems.map(item => (
            <LibraryItem
              key={item.id}
              item={item}
              type={item._type || item.type || 'playlist'}
            />
          ))}

          {filteredItems.length === 0 && (
            <div style={{
              padding: '32px 16px',
              textAlign: 'center',
              color: '#a7a7a7',
              fontSize: '14px'
            }}>
              {searchQuery ? 'No results found.' : 'Your library is empty.'}
            </div>
          )}
        </div>
      </div>

      {/* ─── Resize Handle ─── */}
      <div
        onMouseDown={() => setIsResizing(true)}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          cursor: 'col-resize',
          background: isResizing ? 'var(--accent)' : 'transparent',
          transition: 'background 0.2s',
          zIndex: 10
        }}
        onMouseEnter={e => {
          if (!isResizing) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        }}
        onMouseLeave={e => {
          if (!isResizing) e.currentTarget.style.background = 'transparent';
        }}
      />
    </aside>
  );
};

export default Sidebar;
