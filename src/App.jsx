import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import RightSidebar from './components/common/RightSidebar';
import Player from './components/player/Player';
import AmbientMode from './components/player/AmbientMode';
import MobileNav from './components/common/MobileNav';

// Page Components
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import AlbumDetail from './pages/AlbumDetail';
import ArtistPage from './pages/ArtistPage';
import LikedSongs from './pages/LikedSongs';

import lematWorksGif from './assets/LEMAT WORKS.gif';

const MainLayout = ({ children }) => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#000' }}>
      <Navbar />
      <div className="mobile-wrapper" style={{ display: 'flex', flex: 1, overflow: 'visible', gap: '8px', padding: '0 8px 8px', minHeight: 0 }}>
        <div className="mobile-hidden" style={{ display: 'flex', height: '100%' }}>
          <Sidebar />
        </div>
        
        {/* Center Section Wrapper */}
        <div className="center-wrapper-mobile" style={{ 
          flex: 1, 
          position: 'relative', 
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a', // Darker base for better contrast with the GIF
          minHeight: 0
        }}>
          {/* Looping GIF Background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${lematWorksGif}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3, // Subtle opacity to not overpower the UI
            pointerEvents: 'none',
            zIndex: 0
          }} />
          
          <main className="no-scrollbar" style={{ 
            position: 'absolute',
            inset: 0,
            overflowY: 'auto', 
            zIndex: 1,
            containerType: 'inline-size' // Enable container queries (cqi)
          }}>
            {children}
          </main>
        </div>

        <div className="mobile-hidden" style={{ display: 'flex', height: '100%' }}>
          <RightSidebar />
        </div>
      </div>
      <Player />
      <MobileNav />
      <AmbientMode />
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
    this.setState({ info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'white', padding: '50px', background: 'red', minHeight: '100vh' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router basename={window.location.hostname.endsWith('github.io') ? '/AURA' : ''}>
        <MainLayout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/playlist/:id" element={<PlaylistDetail />} />
              <Route path="/album/:id" element={<AlbumDetail />} />
              <Route path="/artist/:id" element={<ArtistPage />} />
              <Route path="/liked" element={<LikedSongs />} />
            </Routes>
          </AnimatePresence>
        </MainLayout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
