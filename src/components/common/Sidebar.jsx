import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Library, Heart, Plus, 
  ArrowRight, ArrowLeft, Search as SearchIcon, ListFilter,
  Music
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';
import PlaylistImage from './PlaylistImage';

/* ─── Small Navigation Links (Home) ─── */
const NavItem = ({ icon: Icon, label, to, isCollapsed }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: isCollapsed ? 'center' : 'flex-start',
      padding: isCollapsed ? '12px 0' : '12px 16px',
      borderRadius: '8px',
      color: isActive ? '#fff' : '#b3b3b3',
      fontWeight: 700,
      fontSize: '15px',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    })}
  >
    <div style={{ flexShrink: 0, display: 'flex' }}>
      <Icon size={24} />
    </div>
    <span style={{ 
      marginLeft: isCollapsed ? '0' : '20px',
      opacity: isCollapsed ? 0 : 1,
      width: isCollapsed ? 0 : 'auto',
      transition: 'all 0.3s ease',
      display: 'block'
    }}>
      {label}
    </span>
  </NavLink>
);

/* ─── Playlist Row/Grid Item ─── */
const LibraryItem = ({ item, type = 'playlist', isCollapsed, isGrid }) => {
  const navigate = useNavigate();
  const subtitle = type === 'liked'
    ? `Playlist • ${item.count || 0} songs`
    : `${item.type || 'Playlist'} • ${item.owner?.display_name || ''}`;

  if (isGrid) {
    return (
      <div
        onClick={() => {
          if (type === 'liked') return navigate('/liked');
          navigate(`/${item.type || 'playlist'}/${item.id}`);
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '16px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.02)',
          cursor: 'pointer',
          transition: 'background 0.2s',
          width: '100%',
          boxSizing: 'border-box'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      >
        <div style={{
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: type === 'artist' ? '50%' : '6px',
          background: type === 'liked'
            ? 'linear-gradient(135deg, #450af5, #c4efd9)'
            : '#282828',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
        }}>
          <PlaylistImage item={item} type={type} size={80} />
        </div>
        <div style={{ width: '100%' }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 700,
            color: type === 'liked' ? '#fff' : '#fff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '4px'
          }}>
            {item.name}
          </div>
          <div style={{
            fontSize: '13px',
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
  }

  // Normal List Item
  return (
    <div
      onClick={() => {
        if (type === 'liked') return navigate('/liked');
        navigate(`/${item.type || 'playlist'}/${item.id}`);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '12px',
        padding: '8px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
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
        <PlaylistImage item={item} type={type} size={48} />
      </div>

      {!isCollapsed && (
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
      )}
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

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [sidebarWidth, setSidebarWidth] = useState(72);
  const [isResizing, setIsResizing] = useState(false);
  
  const sidebarRef = useRef(null);
  const searchInputRef = useRef(null);

  const MIN_COLLAPSED = 72;
  const MIN_EXPANDED = 280;
  const MAX_EXPANDED = 650; // New massive grid width

  const isCollapsed = sidebarWidth < 120;
  const isGrid = sidebarWidth > 450; // Switches to grid view when wide enough

  // Initialize CSS var on mount
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
  }, [sidebarWidth]);

  // Fetch library items on mount
  useEffect(() => {
    if (fetchLibrary) fetchLibrary();
  }, []);

  // Resize handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      
      if (newWidth < 160) {
        newWidth = MIN_COLLAPSED;
      } else if (newWidth >= 160 && newWidth < MIN_EXPANDED) {
        newWidth = MIN_EXPANDED;
      } else if (newWidth > MAX_EXPANDED) {
        newWidth = MAX_EXPANDED;
      }
      
      setSidebarWidth(newWidth);
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
    if (searchOpen && searchInputRef.current && !isCollapsed) {
      searchInputRef.current.focus();
    }
  }, [searchOpen, isCollapsed]);

  const toggleSidebar = () => {
    const newWidth = isCollapsed ? MIN_EXPANDED : MIN_COLLAPSED;
    setSidebarWidth(newWidth);
  };

  const toggleGrid = () => {
    const newWidth = isGrid ? MIN_EXPANDED : MAX_EXPANDED;
    setSidebarWidth(newWidth);
  };

  // Build the library list
  const allItems = [];

  allItems.push({
    _type: 'liked',
    id: 'liked-songs',
    name: 'Liked Songs',
    count: likedSongs.length,
    images: [],
    pinned: true
  });

  if (libraryItems) {
    libraryItems.forEach(item => {
      allItems.push(item);
    });
  }

  if (userPlaylists) {
    userPlaylists.forEach(p => {
      if (!allItems.find(x => x.id === p.id)) {
        allItems.push({ ...p, type: 'playlist' });
      }
    });
  }

  const filteredItems = allItems.filter(item => {
    if (activeFilter === 'playlists' && item.type !== 'playlist' && item._type !== 'liked') return false;
    if (activeFilter === 'artists' && item.type !== 'artist') return false;
    if (activeFilter === 'albums' && item.type !== 'album') return false;
    if (searchQuery && !isCollapsed) {
      return item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleCreatePlaylist = (e) => {
    e.stopPropagation();
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
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('aura-playlists') || '[]');
      existing.push(newPlaylist);
      localStorage.setItem('aura-playlists', JSON.stringify(existing));
      window.location.reload(); 
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
        position: 'relative',
        flexShrink: 0,
        transition: isResizing ? 'none' : 'width 0.3s ease',
        background: '#121212', // Unified single background
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <div style={{
        padding: isCollapsed ? '16px 8px 0' : '16px 16px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div 
          style={{ 
            padding: isCollapsed ? '8px 0' : '8px 12px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }} 
          onClick={() => navigate('/')}
        >
          <div style={{ 
            width: '28px', height: '28px', flexShrink: 0, borderRadius: '50%', background: '#fff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
             {/* If logo.png exists, use it. Otherwise placeholder */}
            <img src="/logo.png" alt="AURA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} onError={(e) => {e.target.style.display='none';}} />
            <Music size={16} color="#000" style={{ position: 'absolute', zIndex: -1 }} />
          </div>
          <span style={{ 
            fontWeight: 700, fontSize: '18px', color: '#fff', letterSpacing: '-0.5px',
            marginLeft: isCollapsed ? '0' : '16px',
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : 'auto',
            transition: 'all 0.3s ease',
            display: 'block'
          }}>AURA</span>
        </div>
        <NavItem icon={Home} label="Home" to="/" isCollapsed={isCollapsed} />
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginTop: '0px', // Tight gap! 
        overflow: 'hidden'
      }}>
        {/* Library Header */}
        <div style={{
          padding: isCollapsed ? '12px 4px 0' : '12px 16px 0',
          display: 'flex',
          flexDirection: isCollapsed ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}>
          <button
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand Your Library" : "Collapse Your Library"}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              padding: isCollapsed ? '12px 0' : '8px 12px',
              color: '#b3b3b3',
              fontWeight: 700,
              fontSize: '15px',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#b3b3b3'}
          >
            <div style={{ flexShrink: 0, display: 'flex' }}>
              <Library size={24} />
            </div>
            <span style={{ 
              marginLeft: isCollapsed ? '0' : '20px',
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
              transition: 'all 0.3s ease',
              display: 'block'
            }}>Your Library</span>
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            opacity: isCollapsed ? 0 : 1,
            pointerEvents: isCollapsed ? 'none' : 'auto',
            transition: 'opacity 0.3s ease'
          }}>
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
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#b3b3b3'; }}
            >
              <Plus size={20} />
            </button>
            <button
              title="Expand library grid"
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
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#b3b3b3'; }}
              onClick={toggleGrid}
            >
              {isGrid ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </button>
          </div>
        </div>

        {/* Filter Chips - Hidden when collapsed */}
        {!isCollapsed && (
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
        )}

        {/* Search & Sort Row - Hidden when collapsed */}
        {!isCollapsed && (
          <div style={{
            padding: '8px 16px',
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
                      width: isGrid ? '200px' : '140px',
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
        )}

        {/* ─── Scrollable Library List / Grid ─── */}
        <div
          className="no-scrollbar library-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: isCollapsed ? '8px' : '0 8px 8px',
            marginTop: '8px',
            display: isGrid ? 'grid' : 'flex',
            flexDirection: 'column',
            gridTemplateColumns: isGrid ? 'repeat(auto-fill, minmax(160px, 1fr))' : 'none',
            gap: isGrid ? '16px' : '0',
            alignContent: 'start'
          }}
        >
          {filteredItems.map(item => (
            <LibraryItem
              key={item.id}
              item={item}
              type={item._type || item.type || 'playlist'}
              isCollapsed={isCollapsed}
              isGrid={isGrid}
            />
          ))}

          {filteredItems.length === 0 && !isCollapsed && (
            <div style={{
              padding: '32px 16px',
              textAlign: 'center',
              color: '#a7a7a7',
              fontSize: '14px',
              gridColumn: '1 / -1'
            }}>
              {searchQuery ? 'No results found.' : 'Your library is empty.'}
            </div>
          )}
        </div>
      </div>

      {/* ─── Resize Handle ─── */}
      <div
        onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '5px',
          cursor: 'col-resize',
          background: isResizing ? 'rgba(255,255,255,0.2)' : 'transparent',
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
