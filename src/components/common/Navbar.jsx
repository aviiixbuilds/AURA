import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, User, Settings, Wifi, 
  Search as SearchIcon, Home as HomeIcon, Package,
  Bell, Music
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');

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
            <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => {e.target.style.display='none';}} />
            <Music size={20} color="#000" style={{ position: 'absolute', zIndex: -1 }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              background: 'none', border: 'none', color: '#b3b3b3', 
              cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => navigate(1)}
            style={{ 
              background: 'none', border: 'none', color: '#b3b3b3', 
              cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}
          >
            <ChevronRight size={24} />
          </button>
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
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <HomeIcon size={24} />
        </button>

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
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(`/search?q=${searchValue}`);
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
          <button 
            style={{ 
              background: 'none', border: 'none', color: '#b3b3b3', 
              cursor: 'pointer', display: 'flex', alignItems: 'center' 
            }}
            title="Browse"
          >
            <Package size={20} />
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 'fit-content' }}>
        <button style={{ 
          background: 'white', border: 'none', color: 'black', 
          padding: '8px 16px', borderRadius: '20px', fontWeight: 700, 
          cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap'
        }}>
          Explore Premium
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <button style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer' }}>
            <Bell size={20} />
          </button>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', borderRadius: '50%', width: '36px', 
            height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', overflow: 'hidden'
          }}>
            <User size={20} color="#fff" />
          </div>
          <button style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer' }}>
            <Settings size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
