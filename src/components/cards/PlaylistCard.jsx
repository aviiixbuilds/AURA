import React from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { usePlayer } from '../../context/PlayerContext';

const PlaylistCard = ({ item, type = 'playlist' }) => {
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  const { name, images, description, id, artists } = item;
  const image = images?.[0]?.url || 'https://via.placeholder.com/150';
  const subtext = type === 'artist' ? 'Artist' : (description || artists?.[0]?.name || '');

  const handleClick = () => {
    navigate(`/${type}/${id}`);
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    // If it's a playlist/album, we could fetch tracks and play the first one.
    // For now, if there's no track directly, we'll just navigate.
    if (type === 'track') {
       playTrack(item);
    } else {
       navigate(`/${type}/${id}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="card-hover"
      style={{ 
        background: 'var(--bg-card)', 
        padding: '16px', 
        borderRadius: '8px', 
        cursor: 'pointer',
        width: '100%',
        position: 'relative',
        group: 'true'
      }}
    >
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <img 
          src={image} 
          alt={name} 
          style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 8px 16px rgba(0,0,0,0.5)' }} 
        />
        <div className="play-button" style={{ 
          position: 'absolute', right: '8px', bottom: '8px', 
          background: 'var(--accent)', borderRadius: '50%', width: '48px', height: '48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)', opacity: 0, transform: 'translateY(10px)',
          transition: 'all 0.3s ease'
        }}>
          <Play size={24} className="fill-current" />
        </div>
      </div>
      <h3 style={{ 
        fontSize: '16px', fontWeight: 700, marginBottom: '8px', 
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
      }}>
        {name}
      </h3>
      <p style={{ 
        fontSize: '14px', color: 'var(--text-muted)', 
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {subtext}
      </p>

      <style dangerouslySetInnerHTML={{ __html: `
        .card-hover:hover .play-button {
          opacity: 1;
          transform: translateY(0);
        }
      `}} />
    </div>
  );
};

export default PlaylistCard;
