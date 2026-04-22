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
      <div style={{ display: 'flex', flex: 1, overflow: 'visible', gap: '8px', padding: '0 8px 8px' }}>
        <Sidebar />
        <main className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#121212', borderRadius: '8px' }}>
          {children}
        </main>
        <RightSidebar />
      </div>
      <Player />
      <AmbientMode />
    </div>
  );
};

function App() {
  return (
    <Router>
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
  );
}

export default App;
