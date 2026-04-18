import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, Settings } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="glass-nav" style={{ 
      height: '64px', 
      padding: '0 24px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', 
            borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifySelf: 'center'
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={() => navigate(1)}
          style={{ 
            background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', 
            borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifySelf: 'center'
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button style={{ 
          background: 'white', border: 'none', color: 'black', 
          padding: '8px 20px', borderRadius: '20px', fontWeight: 700, 
          cursor: 'pointer', fontSize: '14px' 
        }}>
          Explore Premium
        </button>
        <div style={{ 
          background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '32px', 
          height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <User size={20} />
        </div>
        <div style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
          <Settings size={20} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
