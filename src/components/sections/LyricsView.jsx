import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const LyricsView = ({ isOpen, onClose }) => {
  const { currentTrack } = usePlayer();
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentTrack) {
      const fetchLyrics = async () => {
        setLoading(true);
        setLyrics('');
        try {
          const artist = currentTrack.artists[0].name;
          const title = currentTrack.name;
          const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
          const data = await response.json();
          setLyrics(data.lyrics || 'Lyrics not found for this track.');
        } catch (error) {
          console.error('Lyrics fetch error:', error);
          setLyrics('Could not load lyrics at this time.');
        } finally {
          setLoading(false);
        }
      };

      fetchLyrics();
    }
  }, [isOpen, currentTrack]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ 
          position: 'fixed', right: 0, top: 0, bottom: 'var(--player-height)',
          width: 'min(400px, 100%)', background: 'var(--bg-card)', 
          zIndex: 150, padding: '32px', display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.5)', borderLeft: '1px solid var(--glass-border)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Music size={24} color="var(--accent)" /> Lyrics
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ color: 'var(--text-muted)' }}>Searching for the words...</div>
          ) : (
            <pre style={{ 
              whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '18px', 
              lineHeight: '1.6', color: '#e0e0e0', fontWeight: 600 
            }}>
              {lyrics}
            </pre>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LyricsView;
