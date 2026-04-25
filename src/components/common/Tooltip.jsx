import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ children, content, direction = 'top' }) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      if (direction === 'top') {
        top = rect.top - 12;
        left = rect.left + rect.width / 2;
      } else if (direction === 'bottom') {
        top = rect.bottom + 12;
        left = rect.left + rect.width / 2;
      } else if (direction === 'right') {
        top = rect.top + rect.height / 2;
        left = rect.right + 12;
      } else if (direction === 'left') {
        top = rect.top + rect.height / 2;
        left = rect.left - 12;
      }

      setCoords({ top, left });
    }
  };

  useEffect(() => {
    if (show) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [show]);

  const getTransform = () => {
    if (direction === 'top') return 'translate(-50%, -100%)';
    if (direction === 'bottom') return 'translate(-50%, 0)';
    if (direction === 'right') return 'translate(0, -50%)';
    if (direction === 'left') return 'translate(-100%, -50%)';
    return 'translate(-50%, -50%)';
  };

  return (
    <div 
      ref={triggerRef} 
      onMouseEnter={() => setShow(true)} 
      onMouseLeave={() => setShow(false)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {children}
      {show && createPortal(
        <div style={{
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          transform: getTransform(),
          background: '#282828',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          zIndex: 999999,
          pointerEvents: 'none',
          boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
          animation: 'tooltipFadeIn 0.2s ease-out forwards'
        }}>
          {content}
        </div>,
        document.body
      )}
    </div>
  );
};

export default Tooltip;
