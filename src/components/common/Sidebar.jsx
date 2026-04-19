import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, PlusSquare } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-4 px-4 py-3 rounded-lg transition-smooth ${
        isActive ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white hover:bg-white/5'
      }`
    }
    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', borderRadius: '8px', transition: 'var(--transition-smooth)' }}
  >
    <Icon size={24} />
    <span style={{ fontWeight: 600 }}>{label}</span>
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="glass" style={{ 
      width: 'var(--sidebar-width)', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '24px 12px',
      gap: '24px'
    }}>
      <div style={{ padding: '0 12px', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '32px' }}>🌌</span> AURA
        </h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <SidebarItem icon={Home} label="Home" to="/" />
        <SidebarItem icon={Search} label="Search" to="/search" />
        <SidebarItem icon={Library} label="Your Library" to="/library" />
      </nav>

      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button className="hover:bg-white/5" style={{ 
          background: 'none', border: 'none', color: 'var(--text-muted)', 
          display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', 
          width: '100%', cursor: 'pointer', textAlign: 'left', borderRadius: '8px',
          fontFamily: 'inherit', fontWeight: 600
        }}>
          <PlusSquare size={24} />
          <span>Create Playlist</span>
        </button>
        <SidebarItem icon={Heart} label="Liked Songs" to="/liked" />
      </div>

      <div style={{ 
        marginTop: 'auto', 
        padding: '16px', 
        background: 'var(--bg-card)', 
        borderRadius: '12px',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        <p>Powered by AURA — discover music from the cosmos. ✨</p>
      </div>
    </aside>
  );
};

export default Sidebar;
