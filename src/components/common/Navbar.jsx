import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, User, Settings, Wifi, 
  Search as SearchIcon, Home as HomeIcon, Package,
  Bell, Music, ExternalLink
} from 'lucide-react';
import Tooltip from './Tooltip';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Sync input value with URL when navigating
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q !== null) {
      setSearchValue(q);
    } else {
      setSearchValue('');
    }
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { label: 'Account', external: true },
    { label: 'Profile' },
    { label: 'Recents' },
    { label: 'Support', external: true },
    { label: 'Download', external: true },
    { label: 'Settings' },
    { label: 'Log out' },
  ];

  return (
    <nav className="glass-nav" style={{ 
      height: '64px', 
      padding: '0 24px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: '20px'
    }}>
      {/* Left: Logo and Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '120px' }}>
        <div 
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '50%', background: '#fff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => {e.target.style.display='none';}} />
            <Music size={20} color="#000" style={{ position: 'absolute', zIndex: -1 }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tooltip content="Go back" direction="bottom">
            <button 
              onClick={() => navigate(-1)}
              style={{ 
                background: 'none', border: 'none', color: '#b3b3b3', 
                cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
              className="control-button"
            >
              <ChevronLeft size={24} />
            </button>
          </Tooltip>
          <Tooltip content="Go forward" direction="bottom">
            <button 
              onClick={() => navigate(1)}
              style={{ 
                background: 'none', border: 'none', color: '#b3b3b3', 
                cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
              className="control-button"
            >
              <ChevronRight size={24} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Center: Home & Search */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        flex: 1, 
        maxWidth: '500px',
        justifyContent: 'center'
      }}>
        {/* Home Button */}
        <Tooltip content="Home" direction="bottom">
          <button 
            onClick={() => navigate('/')}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              border: 'none', 
              color: location.pathname === '/' ? '#fff' : '#b3b3b3', 
              borderRadius: '50%', 
              width: '48px', 
              height: '48px', 
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'transform 0.2s'
            }}
            className="control-button"
          >
            <HomeIcon size={24} />
          </button>
        </Tooltip>

        {/* Search Bar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '0 16px',
          height: '48px',
          flex: 1,
          gap: '12px',
          transition: 'background 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <SearchIcon size={20} color="#b3b3b3" />
          <input 
            type="text" 
            placeholder="What do you want to play?"
            value={searchValue}
            onChange={(e) => {
              const val = e.target.value;
              setSearchValue(val);
              // Navigate to search page immediately as the user types
              navigate(`/search?q=${encodeURIComponent(val)}`, { replace: true });
            }}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#fff', 
              fontSize: '14px', 
              outline: 'none',
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }} />
          <Tooltip content="Browse" direction="bottom">
            <button 
              style={{ 
                background: 'none', border: 'none', color: '#b3b3b3', 
                cursor: 'pointer', display: 'flex', alignItems: 'center' 
              }}
              className="control-button"
            >
              <Package size={20} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 'fit-content' }}>
        <div className="tooltip-container">
          <button style={{ 
            background: 'white', border: 'none', color: 'black', 
            padding: '8px 16px', borderRadius: '20px', fontWeight: 700, 
            cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap'
          }}
          className="control-button"
          >
            Explore Premium
          </button>
          <span className="tooltip tooltip-bottom">Upgrade to Premium</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="tooltip-container">
            <button style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer' }} className="control-button">
              <Bell size={20} />
            </button>
            <span className="tooltip tooltip-bottom">What's New</span>
          </div>

          <div style={{ position: 'relative' }} ref={profileRef}>
            <div className="tooltip-container">
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{ 
                  background: 'rgba(255,255,255,0.1)', borderRadius: '50%', width: '36px', 
                  height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', overflow: 'hidden',
                  border: isProfileOpen ? '2px solid white' : 'none',
                  boxSizing: 'border-box'
                }}
                className="control-button"
              >
                <User size={20} color="#fff" />
              </div>
              {!isProfileOpen && <span className="tooltip tooltip-bottom">Profile</span>}
            </div>

            {isProfileOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                background: '#282828',
                borderRadius: '6px',
                boxShadow: '0 16px 24px rgba(0,0,0,0.5)',
                padding: '4px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 500,
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>{item.label}</span>
                    {item.external && <ExternalLink size={18} color="#b3b3b3" />}
                  </button>
                ))}
                
                <div style={{ margin: '8px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                
                <div style={{ padding: '12px 16px 8px 16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 16px 0', color: 'white' }}>
                    Your Updates
                  </h3>
                  <div style={{ fontSize: '13px', color: '#b3b3b3', paddingBottom: '8px' }}>
                    No new updates to show
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="tooltip-container">
            <button style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer' }} className="control-button">
              <Settings size={20} />
            </button>
            <span className="tooltip tooltip-bottom">Settings</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
