/**
 * Spotify API Service via RapidAPI (spotify23.p.rapidapi.com)
 * Fetches real Spotify data using the RapidAPI proxy.
 * Includes in-memory caching to minimize API calls.
 */

const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST || 'spotify23.p.rapidapi.com';
const API_KEYS = [
  import.meta.env.VITE_RAPIDAPI_KEY,
  import.meta.env.VITE_RAPIDAPI_KEY_2,
  import.meta.env.VITE_RAPIDAPI_KEY_3,
].filter(Boolean); // Filter out any empty/undefined keys

let currentKeyIndex = 0;
const BASE_URL = `https://${API_HOST}`;

// --- In-Memory Cache (5 min TTL) ---
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// --- Core Fetch Helper ---
async function apiFetch(endpoint, retryCount = 0) {
  const cacheKey = endpoint;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  if (API_KEYS.length === 0) {
    throw new Error('No API keys configured.');
  }

  const activeKey = API_KEYS[currentKeyIndex];

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': activeKey,
        'x-rapidapi-host': API_HOST,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if ((response.status === 429 || response.status === 401 || response.status === 403) && retryCount < API_KEYS.length - 1) {
        console.warn(`API Key ${currentKeyIndex + 1} failed (${response.status}). Rotating to next key...`);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        return apiFetch(endpoint, retryCount + 1);
      }
      throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // RapidAPI sometimes returns a 200 HTTP OK but wraps a 429/401 error inside the JSON payload.
    if (data && data.status === 'success' && data.error && (data.error.status === 429 || data.error.status === 401 || data.error.status === 400 || data.error.status === 403)) {
      if (retryCount < API_KEYS.length - 1) {
        console.warn(`API Key ${currentKeyIndex + 1} nested failure (${data.error.status}: ${data.error.message}). Rotating to next key...`);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        return apiFetch(endpoint, retryCount + 1);
      }
      throw new Error(`API Inner Error ${data.error.status}: ${data.error.message}`);
    }

    setCache(cacheKey, data);
    return data;

  } catch (error) {
    // If there's a hard network/CORS error, it might be due to a blocked key (401 disguised as CORS). Try rotation.
    if ((error.name === 'TypeError' || error.message === 'Load failed') && retryCount < API_KEYS.length - 1) {
      console.warn(`API Key ${currentKeyIndex + 1} network block. Rotating to next key...`);
      currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
      return apiFetch(endpoint, retryCount + 1);
    }
    throw error;
  }
}

// --- Normalizers ---
// These transform the RapidAPI response shapes into the format our components expect.

function normalizeTrack(item) {
  if (!item) return null;
  // Handle the search response wrapper { data: { ... } }
  const raw = item.data || item;
  const albumArt = raw.albumOfTrack?.coverArt?.sources
    || raw.album?.images
    || [];
  const imageUrl = albumArt[0]?.url || albumArt[0]?.url || '';

  return {
    id: raw.id || raw.uri?.split(':').pop() || '',
    name: raw.name || raw.title || '',
    artists: (raw.artists?.items || raw.artists || []).map(a => ({
      id: a.uri?.split(':').pop() || a.id || '',
      name: a.profile?.name || a.name || ''
    })),
    album: {
      name: raw.albumOfTrack?.name || raw.album?.name || '',
      images: albumArt.map(s => ({ url: s.url }))
    },
    duration_ms: raw.duration?.totalMilliseconds || raw.duration_ms || raw.contentRating?.duration || 180000,
    preview_url: raw.preview_url || null
  };
}

function normalizeAlbum(item) {
  if (!item) return null;
  const raw = item.data || item;
  const images = raw.coverArt?.sources || raw.images || [];

  return {
    id: raw.id || raw.uri?.split(':').pop() || '',
    name: raw.name || '',
    artists: (raw.artists?.items || raw.artists || []).map(a => ({
      id: a.uri?.split(':').pop() || a.id || '',
      name: a.profile?.name || a.name || ''
    })),
    images: images.map(s => ({ url: s.url })),
    release_date: raw.date?.isoString || raw.release_date || raw.year || '',
    total_tracks: raw.tracks?.totalCount || raw.total_tracks || 0,
    tracks: {
      items: (raw.tracks?.items || []).map(t => normalizeTrack(t.track || t))
    },
    type: 'album'
  };
}

function normalizePlaylist(item) {
  if (!item) return null;
  const raw = item.data || item;
  const images = raw.images?.items || raw.images || [];

  return {
    id: raw.id || raw.uri?.split(':').pop() || '',
    name: raw.name || '',
    description: raw.description || '',
    images: images.map(s => ({ url: s.sources?.[0]?.url || s.url || '' })),
    owner: { display_name: raw.owner?.name || raw.owner?.display_name || 'Spotify' },
    tracks: {
      total: raw.tracks?.totalCount || raw.tracks?.total || 0,
      items: []
    },
    followers: { total: raw.followers?.total || 0 },
    type: 'playlist'
  };
}

function normalizeArtist(item) {
  if (!item) return null;
  const raw = item.data || item;
  const images = raw.visuals?.avatarImage?.sources || raw.images || [];

  return {
    id: raw.id || raw.uri?.split(':').pop() || '',
    name: raw.profile?.name || raw.name || '',
    images: images.map(s => ({ url: s.url })),
    followers: { total: raw.stats?.monthlyListeners || raw.followers?.total || 0 },
    genres: raw.profile?.genres || raw.genres || [],
    type: 'artist'
  };
}

// --- Public API Methods ---

class SpotifyService {

  /**
   * Fetch home page data: trending playlists + new releases
   * Uses search queries to get diverse content.
   */
  async getHomeData() {
    const [trending, newMusic] = await Promise.all([
      this.search('trending hits 2025', 'multi'),
      this.search('new releases 2025', 'multi')
    ]);

    return {
      featured: trending,
      newReleases: newMusic
    };
  }

  /**
   * Search for tracks, artists, albums, playlists
   */
  async search(query, type = 'multi') {
    if (!query) return null;

    const data = await apiFetch(
      `/search/?q=${encodeURIComponent(query)}&type=${type}&offset=0&limit=10&numberOfTopResults=5`
    );

    // Normalize the response
    const result = {
      tracks: { items: [] },
      albums: { items: [] },
      artists: { items: [] },
      playlists: { items: [] }
    };

    // Tracks
    if (data.tracks?.items) {
      result.tracks.items = data.tracks.items
        .map(t => normalizeTrack(t))
        .filter(Boolean);
    }

    // Albums
    if (data.albums?.items) {
      result.albums.items = data.albums.items
        .map(a => normalizeAlbum(a))
        .filter(Boolean);
    }

    // Artists
    if (data.artists?.items) {
      result.artists.items = data.artists.items
        .map(a => normalizeArtist(a))
        .filter(Boolean);
    }

    // Playlists
    if (data.playlists?.items) {
      result.playlists.items = data.playlists.items
        .map(p => normalizePlaylist(p))
        .filter(Boolean);
    }

    // Also check topResults for additional data
    if (data.topResults?.items) {
      data.topResults.items.forEach(item => {
        if (item.__typename === 'Track' || item.data?.__typename === 'Track') {
          const t = normalizeTrack(item);
          if (t && !result.tracks.items.find(x => x.id === t.id)) {
            result.tracks.items.unshift(t);
          }
        }
      });
    }

    return result;
  }

  /**
   * Get playlist details by ID
   */
  async getPlaylist(id) {
    const data = await apiFetch(`/playlist/?id=${id}`);

    const tracks = (data.tracks?.items || []).map(item => {
      const t = normalizeTrack(item.track || item);
      return { track: t };
    });

    return {
      id: data.id || id,
      name: data.name || '',
      description: data.description || '',
      images: (data.images || []).map(img => ({ url: img.url || '' })),
      owner: { display_name: data.owner?.display_name || data.owner?.name || 'Spotify' },
      tracks: {
        total: data.tracks?.totalCount || data.tracks?.total || tracks.length,
        items: tracks
      },
      followers: { total: data.followers?.total || 0 }
    };
  }

  /**
   * Get album details by ID
   */
  async getAlbum(id) {
    const data = await apiFetch(`/albums/?ids=${id}`);
    const album = data.albums?.[0] || data;

    const tracks = (album.tracks?.items || []).map(t => normalizeTrack(t));

    return {
      id: album.id || id,
      name: album.name || '',
      artists: (album.artists || []).map(a => ({
        id: a.id || '',
        name: a.name || ''
      })),
      images: (album.images || []).map(img => ({ url: img.url })),
      release_date: album.release_date || '',
      total_tracks: album.total_tracks || tracks.length,
      tracks: { items: tracks }
    };
  }

  /**
   * Get artist details by ID
   */
  async getArtist(id) {
    const data = await apiFetch(`/artist_overview/?id=${id}`);
    const artist = data.data?.artist || data.artist || data;

    const images = artist.visuals?.avatarImage?.sources
      || artist.visuals?.headerImage?.sources
      || artist.images
      || [];

    return {
      id: artist.id || id,
      name: artist.profile?.name || artist.name || '',
      images: images.map(s => ({ url: s.url })),
      followers: {
        total: artist.stats?.monthlyListeners || artist.stats?.followers || artist.followers?.total || 0
      },
      genres: artist.profile?.genres?.items?.map(g => g.name) || artist.genres || []
    };
  }

  /**
   * Get artist's top tracks by ID
   */
  async getArtistTopTracks(id) {
    // The artist_overview endpoint often includes top tracks
    const data = await apiFetch(`/artist_overview/?id=${id}`);
    const artist = data.data?.artist || data.artist || data;
    const topTracks = artist.discography?.topTracks?.items
      || artist.discography?.popularReleases?.items
      || [];

    const tracks = topTracks.map(item => {
      const t = item.track || item;
      return normalizeTrack(t);
    }).filter(Boolean);

    return { tracks };
  }
}

export const spotify = new SpotifyService();
