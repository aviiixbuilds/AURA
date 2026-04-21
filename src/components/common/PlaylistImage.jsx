import React from 'react';
import { Music, Heart, Disc } from 'lucide-react';

const getGradient = (str) => {
  const gradients = [
    ['#FF4E50', '#F9D423'],
    ['#e96443', '#904e95'],
    ['#00c6ff', '#0072ff'],
    ['#7028e4', '#e207b1'],
    ['#00b09b', '#96c93d'],
    ['#f83600', '#f9d423'],
    ['#6a11cb', '#2575fc'],
    ['#ff0844', '#ffb199']
  ];
  let hash = 0;
  const s = str || 'default';
  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  }
  const pair = gradients[Math.abs(hash) % gradients.length];
  return `linear-gradient(45deg, ${pair[0]}, ${pair[1]})`;
};

const PlaylistImage = ({ item, size = 64, style = {}, type = 'playlist' }) => {
  const [isBroken, setIsBroken] = React.useState(false);
  const imageUrl = !isBroken ? (item?.images?.[0]?.url || item?.album?.images?.[0]?.url) : null;
  
  // Extract track covers for the 2x2 grid fallback
  const getGridImages = () => {
    if (type !== 'playlist' && type !== 'liked') return [];
    
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

  // 4. Final Fallback (Gradient Icon)
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: getGradient(item?.name),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
      ...style
    }}>
      {type === 'artist' ? (
        <img 
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${item?.name || 'A'}`} 
          alt="" 
          style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
        />
      ) : (
        <Disc size={size * 0.4} color="white" style={{ opacity: 0.8 }} />
      )}
    </div>
  );
};

export default PlaylistImage;
