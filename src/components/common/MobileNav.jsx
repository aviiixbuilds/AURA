import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library } from 'lucide-react';

const MobileNav = () => {
  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Search', icon: Search, path: '/search' },
    { label: 'Library', icon: Library, path: '/library' },
  ];

  return (
    <div 
      className="desktop-hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 300,
        paddingBottom: 'safe-area-inset-bottom'
      }}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: isActive ? '#fff' : '#b3b3b3',
            textDecoration: 'none',
            fontSize: '10px',
            fontWeight: 500,
            width: '64px'
          })}
        >
          <item.icon size={24} />
          {item.label}
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNav;
