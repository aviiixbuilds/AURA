import React from 'react';

const FilterBar = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      position: 'sticky', 
      top: '-24px', // Sticks at the very top of the scrollable area, offsetting the parent's padding
      zIndex: 20, 
      backgroundColor: 'rgba(18, 18, 18, 0.8)', // Semi-transparent black
      backdropFilter: 'blur(10px)',
      margin: '0 -24px 16px -24px',
      padding: '16px 24px',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          onMouseEnter={e => {
            if (activeFilter !== filter) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={e => {
            if (activeFilter !== filter) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '32px',
            border: 'none',
            backgroundColor: activeFilter === filter ? '#fff' : 'rgba(255,255,255,0.1)',
            color: activeFilter === filter ? '#000' : '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
