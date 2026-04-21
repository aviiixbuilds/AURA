import React from 'react';
import { Music, Heart } from 'lucide-react';

const PlaylistImage = ({ item, size = 64, style = {}, type = 'playlist' }) => {
  const imageUrl = item?.images?.[0]?.url;
  
  // Extract track covers for the 2x2 grid fallback
  const getGridImages = () => {
    if (type !== 'playlist') return [];
    
    const trackItems = item?.tracks?.items || item?.tracks || [];
    const images = [];
    
    for (const trackItem of trackItems) {
      const track = trackItem.track || trackItem;
      const img = track?.album?.images?.[0]?.url || track?.images?.[0]?.url;
      if (img && !images.includes(img)) {
        images.push(img);
      }
      if (images.length === 4) break;
    }
    
    return images;
  };

  const gridImages = imageUrl ? [] : getGridImages();

  // 1. Primary Image
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={item.name}
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
          <img
            key={i}
            src={src}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
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

  // 4. Final Fallback (Icon)
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#282828',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}>
      <Music size={size * 0.4} color="#b3b3b3" />
    </div>
  );
};

export default PlaylistImage;
