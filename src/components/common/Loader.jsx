import React from 'react';
import Spline from '@splinetool/react-spline';

const Loader = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '400px',
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '20px',
      background: 'transparent',
      animation: 'fade-in 0.5s ease-out'
    }}>
      <div style={{ width: '400px', height: '400px', position: 'relative' }}>
        <Spline scene="https://prod.spline.design/uTXOHclJiz4D1tnD/scene.splinecode" />
      </div>
      <span style={{ 
        color: 'var(--text-muted)', 
        fontSize: '14px', 
        fontWeight: 600, 
        letterSpacing: '2px',
        textTransform: 'uppercase',
        opacity: 0.8
      }}>
        Syncing with AURA...
      </span>
    </div>
  );
};

export default Loader;
