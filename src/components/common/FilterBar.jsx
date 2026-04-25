import React, { useState, useEffect } from 'react';

const FilterBar = ({ filters, activeFilter, onFilterChange }) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollAmount, setScrollAmount] = useState(0);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    const handleScroll = () => {
      const top = mainElement.scrollTop;
      setScrolled(top > 10);
      // Fade out over a slightly longer distance for smoothness
      setScrollAmount(Math.min(top / 150, 1));
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
      margin: '0', 
      pointerEvents: 'none',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* 
        The "HUGE" Gradient Background 
      */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '300px', 
        background: `linear-gradient(to bottom, rgba(7, 133, 121, ${0.95 * (1 - scrollAmount)}) 0%, rgba(7, 133, 121, ${0.3 * (1 - scrollAmount)}) 50%, transparent 100%)`,
        zIndex: -1,
        transition: 'opacity 0.3s ease',
      }} />

      {/* 
        The Actual Content Bar 
      */}
      <div style={{
        display: 'flex', 
        alignItems: 'center',
        gap: '12px', 
        padding: '24px 24px 16px 24px', 
        backgroundColor: `rgba(18, 18, 18, ${scrollAmount})`,
        backdropFilter: scrollAmount > 0.2 ? 'blur(40px)' : 'none',
        borderBottom: `1px solid rgba(255, 255, 255, ${scrolled ? 0.1 : 0})`,
        transition: 'background-color 0.4s ease, border-bottom 0.3s ease',
        pointerEvents: 'auto',
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



