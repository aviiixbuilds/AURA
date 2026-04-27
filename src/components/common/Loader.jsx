import React from 'react';

const Loader = ({ message = "INITIALIZING AURA...." }) => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '400px',
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '24px',
      background: 'transparent'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes text-pulse-glow {
          0%, 100% { opacity: 0.6; text-shadow: 0 0 10px rgba(112,0,255,0.4); }
          50% { opacity: 1; text-shadow: 0 0 20px rgba(0,242,255,0.8); }
        }

        .video-orb-container {
          position: relative;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: visible;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          box-shadow: 0 0 100px 30px rgba(112, 0, 255, 0.15), 0 0 200px 80px rgba(0, 242, 255, 0.08);
        }

        .video-orb-container::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(0, 242, 255, 0.12), rgba(112, 0, 255, 0.08) 50%, transparent 90%);
          transform: scale(4);
          z-index: -1;
          animation: text-pulse-glow 5s ease-in-out infinite;
        }

        .video-clipper {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-orb {
          width: 250%;
          height: 250%;
          object-fit: cover;
        }

        .orb-text {
          position: absolute;
          z-index: 20;
          color: white;
          font-size: 32px;
          font-weight: 900;
          letter-spacing: 8px;
          text-shadow: 0 0 20px rgba(255,255,255,0.8);
          pointer-events: none;
          margin-left: 8px; /* offset for letter-spacing to keep it centered */
        }
      `}} />
      
      <div className="video-orb-container">
        <span className="orb-text">AURA</span>
        <div className="video-clipper">
          <video 
            className="video-orb" 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/loader-orb.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <span style={{ 
        color: '#fff',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '5px',
        textTransform: 'uppercase',
        animation: 'text-pulse-glow 2.5s ease-in-out infinite'
      }}>
        {message}
      </span>
    </div>
  );
};

export default Loader;
