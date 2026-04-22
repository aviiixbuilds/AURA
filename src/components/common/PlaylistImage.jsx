import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { spotify } from '../../services/spotify';

const RAINBOW_GRADIENT = 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)';

const PlaylistImage = ({ item, size = 64, style = {}, type = 'playlist' }) => {
  const [isBroken, setIsBroken] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState(null);
  
  // High-priority: primary images from item or album
  const primaryUrl = item?.images?.[0]?.url || item?.album?.images?.[0]?.url || item?.images?.[0] || null;
  const imageUrl = !isBroken ? (fallbackUrl || primaryUrl) : null;
  
  // Auto-recovery if image is missing or broken
  useEffect(() => {
    const recoverImage = async () => {
      if ((!primaryUrl || isBroken) && !fallbackUrl && item?.name) {
        const term = type === 'track' 
          ? `${item.name} ${item.artists?.[0]?.name || ''}`
          : item.name;
        
        // Use the global spotify service to fetch a fallback
        const url = await spotify.fetchiTunesImage(term, type);
        if (url) setFallbackUrl(url);
      }
    };
    recoverImage();
  }, [primaryUrl, isBroken, item?.name, type, fallbackUrl]);

  // Extract track covers for the 2x2 grid fallback
  const getGridImages = () => {
    if (type !== 'playlist' && type !== 'liked') return [];
    const trackItems = item?.tracks?.items || item?.tracks || [];
    const images = [];
    for (const trackItem of trackItems) {
      const track = trackItem.track || trackItem;
      const img = track?.album?.images?.[0]?.url || track?.images?.[0]?.url || track?.images?.[0];
      if (img && !images.includes(img)) images.push(img);
      if (images.length === 4) break;
    }
    return images;
  };

  const gridImages = imageUrl ? [] : getGridImages();

  // 1. Primary Image (or Fallback from iTunes)
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={item?.name || 'Art'}
        onError={() => setIsBroken(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          ...style
        }}
      />
    );
  }

  // 2. 2x2 Grid Fallback
  if (gridImages.length === 4) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        width: '100%',
        height: '100%',
        ...style
      }}>
        {gridImages.map((src, i) => (
          <div key={i} style={{ width: '100%', height: '100%', position: 'relative' }}>
            <PlaylistImage item={{ images: [{ url: src }] }} type="track" size={size / 2} />
          </div>
        ))}
      </div>
    );
  }

  // 3. Special case for Liked Songs
  if (type === 'liked') {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #450af5, #c4efd9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}>
        <Heart size={size * 0.4} fill="white" color="white" />
      </div>
    );
  }

  // 4. Final Fallback (Gradient Icon)
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: RAINBOW_GRADIENT,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
      ...style
    }}>
      {type === 'artist' ? (
        <img 
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${item?.name || 'A'}`} 
          alt="" 
          style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
        />
      ) : (
        <div style={{ 
          width: 'calc(100% - 2px)', height: 'calc(100% - 2px)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          background: '#000', 
          border: '1.5px solid white',
          borderRadius: '50%', 
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          ...style
        }}>
          <img src="/logo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      )}
    </div>
  );
};

export default PlaylistImage;
