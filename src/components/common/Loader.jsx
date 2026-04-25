import React from 'react';
import Spline from '@splinetool/react-spline';

const Loader = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '300px',
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '0px',
      background: 'transparent',
      animation: 'fade-in 0.5s ease-out'
    }}>
      <div style={{ 
        width: '300px', 
        height: '300px', 
        position: 'relative',
        overflow: 'hidden',
        // Filter to change white to cyan/teal and hide the grey background
        // brightness(1.2) + contrast(1.2) + hue-rotate(140deg) for cyan tint
        filter: 'hue-rotate(145deg) saturate(2) brightness(1.1)',
        // mix-blend-mode: screen hides the dark grey background and keeps light elements
        mixBlendMode: 'screen',
        transform: 'scale(0.75)'
      }}>
        <style dangerouslySetInnerHTML={{ __html: `
          /* Attempt to hide Spline badge if it's an HTML element */
          canvas + a, .spline-watermark, #spline-logo { display: none !important; pointer-events: none !important; opacity: 0 !important; }
        `}} />
        <Spline scene="https://prod.spline.design/uTXOHclJiz4D1tnD/scene.splinecode" />
      </div>
      <span style={{ 
        color: 'var(--accent)', 
        fontSize: '12px', 
        fontWeight: 700, 
        letterSpacing: '3px',
        textTransform: 'uppercase',
        opacity: 0.8,
        marginTop: '-40px'
      }}>
        AURA Sync...
      </span>
    </div>
  );
};

export default Loader;
