import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vibrant } from 'node-vibrant/browser';
import { usePlayer } from './PlayerContext';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { currentTrack } = usePlayer();
  const [accentColor, setAccentColor] = useState('#1db954'); // Initial Spotify Green

  useEffect(() => {
    if (currentTrack?.album?.images?.[0]?.url) {
      const imageUrl = currentTrack.album.images[0].url;
      
      // We use a proxy or handle CORS if necessary, 
      // but for Spotify images, Vibrant usually works if no CORS issues
      Vibrant.from(imageUrl).getPalette()
        .then((palette) => {
          const vibrantColor = palette.Vibrant?.hex || palette.LightVibrant?.hex || '#1db954';
          setAccentColor(vibrantColor);
          
          // Apply to CSS Variable
          document.documentElement.style.setProperty('--accent', vibrantColor);
        })
        .catch((err) => {
          console.error('Vibrant color extraction error:', err);
        });
    }
  }, [currentTrack]);

  return (
    <ThemeContext.Provider value={{ accentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
