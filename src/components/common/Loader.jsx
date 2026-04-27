import React from 'react';

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
      gap: '40px',
      background: 'transparent',
      perspective: '1000px'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes orbit {
          0% { transform: rotateX(45deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(45deg) rotateY(360deg) rotateZ(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; filter: blur(2px); }
          50% { transform: scale(1.2); opacity: 1; filter: blur(0px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .aura-loader-container {
          position: relative;
          width: 120px;
          height: 120px;
          transform-style: preserve-3d;
          animation: orbit 4s linear infinite, float 3s ease-in-out infinite;
        }

        .aura-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-radius: 50%;
          box-sizing: border-box;
        }

        .ring-1 {
          border-top-color: #00f2ff;
          border-bottom-color: #00f2ff;
          box-shadow: 0 0 20px #00f2ff, inset 0 0 20px #00f2ff;
          animation: orbit 2s linear infinite reverse;
        }

        .ring-2 {
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          border-left-color: #7000ff;
          border-right-color: #7000ff;
          box-shadow: 0 0 20px #7000ff, inset 0 0 20px #7000ff;
          animation: orbit 3s linear infinite;
        }

        .ring-3 {
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          border-top-color: #00ffaa;
          border-bottom-color: #00ffaa;
          box-shadow: 0 0 20px #00ffaa, inset 0 0 20px #00ffaa;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .aura-glow-core {
          position: absolute;
          top: 45%;
          left: 45%;
          width: 10%;
          height: 10%;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 30px 10px #00f2ff, 0 0 60px 20px rgba(0, 242, 255, 0.3);
          animation: pulse 1s ease-in-out infinite;
        }
      `}} />
      
      <div className="aura-loader-container">
        <div className="aura-ring ring-1"></div>
        <div className="aura-ring ring-2"></div>
        <div className="aura-ring ring-3"></div>
        <div className="aura-glow-core"></div>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '8px' 
      }}>
        <span style={{ 
          color: '#fff', 
          fontSize: '14px', 
          fontWeight: 800, 
          letterSpacing: '4px',
          textTransform: 'uppercase',
          background: 'linear-gradient(90deg, #00f2ff, #7000ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          AURA INITIALIZING
        </span>
        <div style={{ 
          width: '40px', 
          height: '2px', 
          background: 'linear-gradient(90deg, transparent, #00f2ff, transparent)' 
        }}></div>
      </div>
    </div>
  );
};

export default Loader;
