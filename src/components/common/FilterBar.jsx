import React, { useState, useEffect } from 'react';

const FilterBar = ({ filters, activeFilter, onFilterChange }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    const handleScroll = () => {
      const top = mainElement.scrollTop;
      setScrolled(top > 10);
    };

    mainElement.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      margin: '0'
    }}>
      <div style={{
        display: 'flex', 
        alignItems: 'center',
        gap: '12px', 
        padding: '24px 24px 16px 24px', 
        backgroundColor: scrolled ? 'rgba(0, 0, 220, 0.95)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
        transition: 'background-color 0.3s ease, border-bottom 0.3s ease',
      }}>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            style={{
              padding: '8px 20px',
              borderRadius: '32px',
              border: 'none',
              backgroundColor: activeFilter === filter ? '#fff' : 'rgba(255,255,255,0.08)',
              color: activeFilter === filter ? '#000' : '#fff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0
            }}
            onMouseEnter={e => {
              if (activeFilter !== filter) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={e => {
              if (activeFilter !== filter) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
