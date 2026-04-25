import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import RightSidebar from './components/common/RightSidebar';
import Player from './components/player/Player';
import AmbientMode from './components/player/AmbientMode';

// Page Components
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import AlbumDetail from './pages/AlbumDetail';
import ArtistPage from './pages/ArtistPage';
import LikedSongs from './pages/LikedSongs';

const MainLayout = ({ children }) => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#000' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', gap: '8px', padding: '0 8px 8px', minHeight: 0 }}>
        <Sidebar />
        <main className="no-scrollbar" style={{ 
          flex: 1, 
          overflowY: 'auto', 
          background: '#121212', 
          borderRadius: '8px',
          minHeight: 0,
          position: 'relative', // Ensure sticky children position correctly
          containerType: 'inline-size' // Enable container queries (cqi)
        }}>
          {children}
        </main>
        <RightSidebar />
      </div>
      <Player />
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
      <Router basename="/AURA">
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
