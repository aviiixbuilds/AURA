/**
 * Spotify API Service via RapidAPI (spotify23.p.rapidapi.com)
 * Fetches real Spotify data using the RapidAPI proxy.
 * Includes in-memory caching, key rotation, and full mock data fallback.
 */

const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST || 'spotify23.p.rapidapi.com';
const API_KEYS = [
  import.meta.env.VITE_RAPIDAPI_KEY,
  import.meta.env.VITE_RAPIDAPI_KEY_2,
  import.meta.env.VITE_RAPIDAPI_KEY_3,
].filter(Boolean);

let currentKeyIndex = 0;
const BASE_URL = `https://${API_HOST}`;

// --- In-Memory Cache (5 min TTL) ---
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

// --- Playlist Metadata Cache ---
// Stores basic info (name, image, description) for any playlist seen in search/home results.
// Used as fallback so each playlist shows its real cover art even when the detail API fails.
const playlistMetaCache = new Map();

function cachePlaylistMeta(playlist) {
  if (playlist?.id) playlistMetaCache.set(playlist.id, playlist);
}

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// --- Core Fetch Helper with Key Rotation ---
async function apiFetch(endpoint, retryCount = 0) {
  const cacheKey = endpoint;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  if (API_KEYS.length === 0) throw new Error('No API keys configured.');

  const activeKey = API_KEYS[currentKeyIndex];

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': activeKey,
        'x-rapidapi-host': API_HOST,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if ((response.status === 429 || response.status === 401 || response.status === 403) && retryCount < API_KEYS.length - 1) {
        console.warn(`API Key ${currentKeyIndex + 1} failed (${response.status}). Rotating...`);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        return apiFetch(endpoint, retryCount + 1);
      }
      throw new Error(`API Error ${response.status}`);
    }

    const data = await response.json();

    // RapidAPI wraps errors inside a 200 OK JSON body
    if (data?.status === 'success' && data?.error) {
      const errStatus = data.error.status;
      if ([400, 401, 403, 429].includes(errStatus) && retryCount < API_KEYS.length - 1) {
        console.warn(`API Key ${currentKeyIndex + 1} inner error (${errStatus}). Rotating...`);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        return apiFetch(endpoint, retryCount + 1);
      }
      throw new Error(`API Inner Error ${errStatus}: ${data.error.message}`);
    }

    // Also handle {"message": "You are not subscribed to this API."}
    if (data?.message && typeof data.message === 'string' && data.message.toLowerCase().includes('subscri')) {
      if (retryCount < API_KEYS.length - 1) {
        console.warn(`API Key ${currentKeyIndex + 1} not subscribed. Rotating...`);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        return apiFetch(endpoint, retryCount + 1);
      }
      throw new Error('All API keys exhausted or not subscribed.');
    }

    setCache(cacheKey, data);
    return data;

  } catch (error) {
    if ((error.name === 'TypeError' || error.message === 'Load failed') && retryCount < API_KEYS.length - 1) {
      console.warn(`API Key ${currentKeyIndex + 1} network block. Rotating...`);
      currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
      return apiFetch(endpoint, retryCount + 1);
    }
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA FALLBACK
// Used when all API keys are exhausted or rate-limited.
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_TRACKS = [
  { id: 'mt1', name: 'Blinding Lights', artists: [{ id: 'ma1', name: 'The Weeknd' }], album: { name: 'After Hours', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36' }] }, duration_ms: 200040, preview_url: null },
  { id: 'mt2', name: 'As It Was', artists: [{ id: 'ma2', name: 'Harry Styles' }], album: { name: "Harry's House", images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14' }] }, duration_ms: 167303, preview_url: null },
  { id: 'mt3', name: 'Stay', artists: [{ id: 'ma3', name: 'The Kid LAROI' }, { id: 'ma4', name: 'Justin Bieber' }], album: { name: 'F*CK LOVE 3', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25' }] }, duration_ms: 141806, preview_url: null },
  { id: 'mt4', name: 'Heat Waves', artists: [{ id: 'ma5', name: 'Glass Animals' }], album: { name: 'Dreamland', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273712701c5e263efc8726b1464' }] }, duration_ms: 238805, preview_url: null },
  { id: 'mt5', name: 'Bad Habit', artists: [{ id: 'ma6', name: 'Steve Lacy' }], album: { name: 'Gemini Rights', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2732905a7c5d0f31b65e5c60c9a' }] }, duration_ms: 231041, preview_url: null },
  { id: 'mt6', name: 'Anti-Hero', artists: [{ id: 'ma7', name: 'Taylor Swift' }], album: { name: 'Midnights', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' }] }, duration_ms: 200690, preview_url: null },
  { id: 'mt7', name: 'Levitating', artists: [{ id: 'ma8', name: 'Dua Lipa' }], album: { name: 'Future Nostalgia', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f' }] }, duration_ms: 203806, preview_url: null },
  { id: 'mt8', name: 'Watermelon Sugar', artists: [{ id: 'ma2', name: 'Harry Styles' }], album: { name: 'Fine Line', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0' }] }, duration_ms: 174273, preview_url: null },
  { id: 'mt9', name: 'good 4 u', artists: [{ id: 'ma9', name: 'Olivia Rodrigo' }], album: { name: 'SOUR', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a' }] }, duration_ms: 178147, preview_url: null },
  { id: 'mt10', name: 'Peaches', artists: [{ id: 'ma4', name: 'Justin Bieber' }], album: { name: 'Justice', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2735ef878a782c987d664963d5d' }] }, duration_ms: 198061, preview_url: null },
  { id: 'mt11', name: 'Flowers', artists: [{ id: 'ma11', name: 'Miley Cyrus' }], album: { name: 'Endless Summer Vacation', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273f421f15391a62d46e3a63b0a' }] }, duration_ms: 200442, preview_url: null },
  { id: 'mt12', name: 'Cruel Summer', artists: [{ id: 'ma7', name: 'Taylor Swift' }], album: { name: 'Lover', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647' }] }, duration_ms: 178426, preview_url: null },
  { id: 'mt13', name: 'Vampire', artists: [{ id: 'ma9', name: 'Olivia Rodrigo' }], album: { name: 'GUTS', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273e9599540b79316d84d728639' }] }, duration_ms: 219724, preview_url: null },
  { id: 'mt14', name: 'Kill Bill', artists: [{ id: 'ma14', name: 'SZA' }], album: { name: 'SOS', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b27370dbc9f47669d120ad874813' }] }, duration_ms: 153946, preview_url: null },
  { id: 'mt15', name: 'Starboy', artists: [{ id: 'ma1', name: 'The Weeknd' }], album: { name: 'Starboy', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258eb7bc552' }] }, duration_ms: 230453, preview_url: null },
  { id: 'mt16', name: 'About Damn Time', artists: [{ id: 'ma16', name: 'Lizzo' }], album: { name: 'Special', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273e92823610214a1f6305a413d' }] }, duration_ms: 191852, preview_url: null },
  { id: 'mt17', name: 'Paint The Town Red', artists: [{ id: 'ma17', name: 'Doja Cat' }], album: { name: 'Scarlet', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273e9599540b79316d84d728639' }] }, duration_ms: 231750, preview_url: null },
  { id: 'mt18', name: 'Seven', artists: [{ id: 'ma18', name: 'Jung Kook' }], album: { name: 'Golden', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b27387d7b05537548773c3820980' }] }, duration_ms: 184444, preview_url: null },
  { id: 'mt19', name: 'Rich Flex', artists: [{ id: 'ma19', name: 'Drake' }, { id: 'ma20', name: '21 Savage' }], album: { name: 'Her Loss', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273007077a944208a0d249f0556' }] }, duration_ms: 239359, preview_url: null },
  { id: 'mt20', name: 'Unholy', artists: [{ id: 'ma21', name: 'Sam Smith' }, { id: 'ma22', name: 'Kim Petras' }], album: { name: 'Gloria', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273007077a944208a0d249f0556' }] }, duration_ms: 156943, preview_url: null },
];

const MOCK_PLAYLISTS = [
  {
    id: 'mp1', name: 'Today\'s Top Hits', type: 'playlist',
    description: 'Jung Kook is on top of the world!',
    images: [{ url: 'https://i.scdn.co/image/ab67706f00000003bd0e19e810bb4b55ab164a95' }],
    owner: { display_name: 'Spotify' },
    tracks: { total: 50, items: MOCK_TRACKS.slice(0, 15).map(t => ({ track: t })) },
    followers: { total: 35000000 }
  },
  {
    id: 'mp2', name: 'RapCaviar', type: 'playlist',
    description: 'Music that defines what\'s happening in hip-hop.',
    images: [{ url: 'https://i.scdn.co/image/ab67706f00000003652d0ab2f88d7d63dc8553d8' }],
    owner: { display_name: 'Spotify' },
    tracks: { total: 50, items: MOCK_TRACKS.filter(t => ['Drake', '21 Savage', 'SZA'].some(a => t.artists[0].name.includes(a))).map(t => ({ track: t })) },
    followers: { total: 14000000 }
  },
  {
    id: 'mp3', name: 'Viva Latino', type: 'playlist',
    description: 'Pegate! The most lit Latin music right now.',
    images: [{ url: 'https://i.scdn.co/image/ab67706f00000003c3af4c0a1d91a17c04cf5fe8' }],
    owner: { display_name: 'Spotify' },
    tracks: { total: 50, items: MOCK_TRACKS.slice(5, 12).map(t => ({ track: t })) },
    followers: { total: 11000000 }
  },
  {
    id: 'mp4', name: 'Mood Booster', type: 'playlist',
    description: 'Get happy with today\'s feel-good hits',
    images: [{ url: 'https://i.scdn.co/image/ab67706f00000003ad43e8946843c738657f9c09' }],
    owner: { display_name: 'Spotify' },
    tracks: { total: 50, items: MOCK_TRACKS.filter(t => ['Harry Styles', 'Lizzo', 'Dua Lipa'].some(a => t.artists[0].name.includes(a))).map(t => ({ track: t })) },
    followers: { total: 8000000 }
  },
  {
    id: 'mp5', name: 'Chill Hits', type: 'playlist',
    description: 'Kick back to the best new and recent chill hits.',
    images: [],
    owner: { display_name: 'Spotify' },
    tracks: { total: 50, items: MOCK_TRACKS.slice(10, 20).map(t => ({ track: t })) },
    followers: { total: 6000000 }
  },
  {
    id: 'mp6', name: 'Hot Country', type: 'playlist',
    description: 'Country\'s hottest songs right now.',
    images: [],
    owner: { display_name: 'Spotify' },
    tracks: { total: 50, items: MOCK_TRACKS.slice(0, 8).map(t => ({ track: t })) },
    followers: { total: 5000000 }
  },
];

const MOCK_ALBUMS = [
  { id: 'ma1', name: 'After Hours', type: 'album', artists: [{ id: 'art1', name: 'The Weeknd' }], images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36' }], release_date: '2020-03-20', total_tracks: 14, tracks: { items: MOCK_TRACKS.slice(0, 6) } },
  { id: 'ma2', name: "Harry's House", type: 'album', artists: [{ id: 'art2', name: 'Harry Styles' }], images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14' }], release_date: '2022-05-20', total_tracks: 13, tracks: { items: MOCK_TRACKS.slice(1, 7) } },
  { id: 'ma3', name: 'Midnights', type: 'album', artists: [{ id: 'art3', name: 'Taylor Swift' }], images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' }], release_date: '2022-10-21', total_tracks: 23, tracks: { items: MOCK_TRACKS.slice(2, 8) } },
  { id: 'ma4', name: 'Future Nostalgia', type: 'album', artists: [{ id: 'art4', name: 'Dua Lipa' }], images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f' }], release_date: '2020-03-27', total_tracks: 11, tracks: { items: MOCK_TRACKS.slice(3, 9) } },
];

const MOCK_ARTISTS = [
  { id: 'art1', name: 'The Weeknd', type: 'artist', images: [{ url: 'https://i.scdn.co/image/ab6761610000e5ebb99584e3e9e3c4e5f0a4c4b8' }], followers: { total: 90000000 }, genres: ['canadian pop', 'r&b'] },
  { id: 'art2', name: 'Harry Styles', type: 'artist', images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb8865f5b4be4e87bdc2e43a31' }], followers: { total: 48000000 }, genres: ['pop'] },
  { id: 'art3', name: 'Taylor Swift', type: 'artist', images: [{ url: 'https://i.scdn.co/image/ab6761610000e5ebb59e13da85833f1fedb5983b' }], followers: { total: 100000000 }, genres: ['pop', 'country pop'] },
  { id: 'art4', name: 'Dua Lipa', type: 'artist', images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb30c1a4c074e019a68b59b3a4' }], followers: { total: 75000000 }, genres: ['pop', 'dance pop'] },
];

const mockSearchResults = {
  tracks: { items: MOCK_TRACKS },
  albums: { items: MOCK_ALBUMS },
  artists: { items: MOCK_ARTISTS },
  playlists: { items: MOCK_PLAYLISTS },
};

// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZERS
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Deeply searches for image sources in a raw Spotify object.
 * Checks multiple possible nested structures used by different RapidAPI endpoints.
 */
function findImages(raw) {
  if (!raw) return [];
  
  // Possible sources (in priority order)
  const sources = [
    raw.visuals?.avatarImage?.sources,
    raw.visuals?.headerImage?.sources,
    raw.coverArt?.sources,
    raw.albumOfTrack?.coverArt?.sources,
    raw.album?.images,
    raw.images?.items,
    raw.images,
    raw.data?.visuals?.avatarImage?.sources,
    raw.data?.albumOfTrack?.coverArt?.sources,
    raw.item?.album?.images,
    raw.track?.album?.images
  ];

  for (const src of sources) {
    if (Array.isArray(src) && src.length > 0) {
      return src.map(s => {
        if (typeof s === 'string') return { url: s };
        return { url: s.url || s.sources?.[0]?.url || s.uri || '' };
      }).filter(s => s.url);
    }
  }

  return [];
}

/**
 * Normalizes a track object from any Spotify API response format.
 */
function normalizeTrack(item) {
  if (!item) return null;
  const raw = item.data || item.track || item;
  const images = findImages(raw);
  
  const track = {
    id: raw.id || raw.uri?.split(':').pop() || '',
    name: raw.name || raw.title || '',
    artists: (raw.artists?.items || raw.artists || []).map(a => ({
      id: a.uri?.split(':').pop() || a.id || '',
      name: a.profile?.name || a.name || ''
    })),
    album: {
      name: raw.albumOfTrack?.name || raw.album?.name || '',
      images: images.length > 0 ? images : []
    },
    duration_ms: raw.duration?.totalMilliseconds || raw.duration_ms || raw.duration?.total_ms || 180000,
    preview_url: raw.preview_url || raw.audio?.items?.[0]?.url || null,
    playCount: raw.playCount || 0
  };

  // If still no image and it's a mock/failed result, we'll try to find one via iTunes later
  // but for now we return what we have.
  return track;
}

/**
 * Normalizes an album object.
 */
function normalizeAlbum(item) {
  if (!item) return null;
  const raw = item.data || item;
  const images = findImages(raw);
  
  return {
    id: raw.id || raw.uri?.split(':').pop() || '',
    name: raw.name || '',
    artists: (raw.artists?.items || raw.artists || []).map(a => ({
      id: a.uri?.split(':').pop() || a.id || '',
      name: a.profile?.name || a.name || ''
    })),
    images: images,
    release_date: raw.date?.isoString || raw.release_date || raw.year || '',
    total_tracks: raw.tracks?.totalCount || raw.total_tracks || 0,
    tracks: { items: (raw.tracks?.items || []).map(t => normalizeTrack(t)) },
    type: 'album'
  };
}

/**
 * Normalizes a playlist object.
 */
function normalizePlaylist(item) {
  if (!item) return null;
  const raw = item.data || item;
  const images = findImages(raw);
  
  return {
    id: raw.id || raw.uri?.split(':').pop() || '',
    name: raw.name || '',
    description: raw.description || '',
    images: images,
    owner: { display_name: raw.owner?.name || raw.owner?.display_name || 'Spotify' },
    tracks: { total: raw.tracks?.totalCount || raw.tracks?.total || 0, items: [] },
    followers: { total: raw.followers?.total || 0 },
    type: 'playlist'
  };
}

/**
 * Normalizes an artist object.
 */
function normalizeArtist(item) {
  if (!item) return null;
  const raw = item.data || item;
  const images = findImages(raw);
  
  return {
    id: raw.id || raw.uri?.split(':').pop() || '',
    name: raw.profile?.name || raw.name || '',
    images: images,
    followers: { total: raw.stats?.monthlyListeners || raw.followers?.total || 0 },
    genres: raw.profile?.genres || raw.genres || [],
    type: 'artist'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EXTERNAL FALLBACKS (iTunes API)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches a high-quality cover art URL from iTunes Search API.
 * This is used as a public, key-less fallback when Spotify quota is hit.
 */
async function fetchiTunesImage(term, type = 'song') {
  try {
    const entity = type === 'artist' ? 'musicArtist' : (type === 'album' ? 'album' : 'song');
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=${entity}&limit=1`);
    if (!response.ok) return null;
    const data = await response.json();
    const result = data.results?.[0];
    if (!result) return null;
    
    // iTunes provides artworkUrl100, artworkUrl60, etc. 
    // We can get a larger one by replacing the dimensions.
    const url = result.artworkUrl100 || result.artworkUrl60;
    return url ? url.replace('100x100bb.jpg', '600x600bb.jpg') : null;
  } catch {
    return null;
  }
}

/**
 * Background loop to enhance search results with real images if they are missing.
 */
async function enhanceWithImages(result) {
  if (!result) return result;

  const enhanceItem = async (item, type) => {
    // If it already has an image, skip
    const hasImage = item.images?.length > 0 || item.album?.images?.length > 0;
    if (hasImage) return;

    const term = type === 'track' 
      ? `${item.name} ${item.artists?.[0]?.name}`
      : item.name;
    
    const imageUrl = await fetchiTunesImage(term, type);
    if (imageUrl) {
      const imgObj = { url: imageUrl };
      if (type === 'track') {
        if (!item.album) item.album = { name: '', images: [] };
        item.album.images = [imgObj];
      } else {
        item.images = [imgObj];
      }
    }
  };

  // Enhance first few items of each category to keep it fast
  const promises = [
    ...(result.tracks?.items?.slice(0, 5).map(i => enhanceItem(i, 'track')) || []),
    ...(result.albums?.items?.slice(0, 4).map(i => enhanceItem(i, 'album')) || []),
    ...(result.artists?.items?.slice(0, 4).map(i => enhanceItem(i, 'artist')) || []),
    ...(result.playlists?.items?.slice(0, 4).map(i => enhanceItem(i, 'playlist')) || [])
  ];

  await Promise.all(promises);
  return result;
}

class SpotifyService {

  // Expose the iTunes fallback for use by components
  async fetchiTunesImage(term, type = 'song') {
    return await fetchiTunesImage(term, type);
  }

  async getHomeData() {
    // We let search handle its own fallbacks, which now include deterministic variety
    const [featured, newReleases] = await Promise.all([
      this.search('trending hits', 'multi'),
      this.search('new releases', 'multi')
    ]);
    return { 
      featured: featured || mockSearchResults, 
      newReleases: newReleases || { ...mockSearchResults, tracks: { items: MOCK_TRACKS.slice(5, 15) } }
    };
  }

  async search(query, type = 'multi') {
    if (!query) return null;
    try {
      const data = await apiFetch(
        `/search/?q=${encodeURIComponent(query)}&type=${type}&offset=0&limit=10&numberOfTopResults=5`
      );
      const result = {
        tracks: { items: [] }, albums: { items: [] },
        artists: { items: [] }, playlists: { items: [] }
      };
      if (data.tracks?.items) result.tracks.items = data.tracks.items.map(normalizeTrack).filter(Boolean);
      if (data.albums?.items) result.albums.items = data.albums.items.map(normalizeAlbum).filter(Boolean);
      if (data.artists?.items) result.artists.items = data.artists.items.map(normalizeArtist).filter(Boolean);
      if (data.playlists?.items) {
        result.playlists.items = data.playlists.items.map(normalizePlaylist).filter(Boolean);
        // Cache metadata for each playlist so detail page can use it as fallback
        result.playlists.items.forEach(cachePlaylistMeta);
      }
      if (data.topResults?.items) {
        data.topResults.items.forEach(item => {
          if (item.__typename === 'Track' || item.data?.__typename === 'Track') {
            const t = normalizeTrack(item);
            if (t && !result.tracks.items.find(x => x.id === t.id)) result.tracks.items.unshift(t);
          }
        });
      }
      return await enhanceWithImages(result);
    } catch {
      console.warn('Search API failed. Returning mock results.');
      const q = query.toLowerCase();
      const idHash = query.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      
      const filteredPlaylists = MOCK_PLAYLISTS.filter(p => p.name.toLowerCase().includes(q));
      const playlists = filteredPlaylists.length ? filteredPlaylists : MOCK_PLAYLISTS;
      playlists.forEach(cachePlaylistMeta);
      
      // Filter tracks by query, but if none match, provide a deterministic subset
      let tracks = MOCK_TRACKS.filter(t => t.name.toLowerCase().includes(q) || t.artists[0]?.name.toLowerCase().includes(q));
      if (tracks.length === 0) {
        tracks = [...MOCK_TRACKS]
          .sort((a, b) => {
            const hashA = (a.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * (idHash + 1)) % 100;
            const hashB = (b.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * (idHash + 1)) % 100;
            return hashA - hashB;
          })
          .slice(0, 10);
      }

      const finalMock = {
        tracks: { items: tracks.slice(0, 10) },
        albums: { items: MOCK_ALBUMS.filter(a => a.name.toLowerCase().includes(q)).length ? MOCK_ALBUMS.filter(a => a.name.toLowerCase().includes(q)).slice(0, 6) : MOCK_ALBUMS },
        artists: { items: MOCK_ARTISTS.filter(a => a.name.toLowerCase().includes(q)).length ? MOCK_ARTISTS.filter(a => a.name.toLowerCase().includes(q)).slice(0, 6) : MOCK_ARTISTS },
        playlists: { items: playlists },
      };
      
      return await enhanceWithImages(finalMock);
    }
  }

  async getPlaylist(id) {
    // Check if it's a user-created local playlist first
    try {
      const localPlaylists = JSON.parse(localStorage.getItem('aura-playlists') || '[]');
      const localMatch = localPlaylists.find(p => p.id === id);
      if (localMatch) return localMatch;
    } catch {}

    // Check mock playlist
    const mockMatch = MOCK_PLAYLISTS.find(p => p.id === id);
    if (mockMatch) return mockMatch;

    // Try live API
    try {
      // Some versions of the API use /playlist/ some use /playlist_details/
      let data;
      try {
        data = await apiFetch(`/playlist/?id=${id}`);
      } catch {
        data = await apiFetch(`/playlist_metadata/?id=${id}`);
      }
      
      let tracks = [];
      if (data.tracks?.items) {
        tracks = data.tracks.items.map(item => ({
          track: normalizeTrack(item.track || item)
        }));
      } else {
        // Try fetching tracks separately if they are missing
        try {
          const trackData = await apiFetch(`/playlist_tracks/?id=${id}&offset=0&limit=100`);
          tracks = (trackData.items || trackData.tracks?.items || []).map(item => ({
            track: normalizeTrack(item.track || item)
          }));
        } catch (e) {
          console.warn("Could not fetch separate tracks for playlist", id);
        }
      }

      const finalPlaylist = {
        id: data.id || id,
        name: data.name || data.title || '',
        description: data.description || '',
        images: (data.images || data.coverArt?.sources || []).map(img => ({ url: img.url || '' })),
        owner: { display_name: data.owner?.display_name || data.owner?.name || 'Spotify' },
        tracks: {
          total: data.tracks?.totalCount || data.tracks?.total || tracks.length,
          items: tracks
        },
        followers: { total: data.followers?.total || 0 }
      };

      if (!finalPlaylist.images?.length) {
        const imageUrl = await fetchiTunesImage(finalPlaylist.name, 'album');
        if (imageUrl) finalPlaylist.images = [{ url: imageUrl }];
      }

      return finalPlaylist;
    } catch {
      console.warn(`Playlist ${id} API failed. Using cached metadata or mock fallback.`);
      const cached = playlistMetaCache.get(id);
      
      // Generate a unique set of tracks for this ID so they don't look identical
      const idHash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const trackCount = 8 + (Math.abs(idHash) % 8); // 8 to 15 tracks
      const shuffledTracks = [...MOCK_TRACKS]
        .sort((a, b) => {
          const hashA = (a.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * (idHash + 1)) % 100;
          const hashB = (b.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * (idHash + 1)) % 100;
          return hashA - hashB;
        })
        .slice(0, trackCount);

      if (cached) {
        const result = {
          ...cached,
          tracks: {
            total: shuffledTracks.length,
            items: shuffledTracks.map(t => ({ track: t }))
          }
        };
        return await enhanceWithImages(result);
      }
      // Last resort: Deterministic mock from our list
      const mockIndex = Math.abs(idHash) % MOCK_PLAYLISTS.length;
      const baseMock = MOCK_PLAYLISTS[mockIndex];
      const result = { 
        ...baseMock, 
        id,
        tracks: {
          total: shuffledTracks.length,
          items: shuffledTracks.map(t => ({ track: t }))
        }
      };
      return await enhanceWithImages(result);
    }
  }

  async getAlbum(id) {
    const mockMatch = MOCK_ALBUMS.find(a => a.id === id);
    if (mockMatch) return mockMatch;
    try {
      const data = await apiFetch(`/albums/?ids=${id}`);
      const album = data.albums?.[0] || data;
      const tracks = (album.tracks?.items || []).map(t => normalizeTrack(t));
      return {
        id: album.id || id,
        name: album.name || '',
        artists: (album.artists || []).map(a => ({ id: a.id || '', name: a.name || '' })),
        images: (album.images || []).map(img => ({ url: img.url })),
        release_date: album.release_date || '',
        total_tracks: album.total_tracks || tracks.length,
        tracks: { items: tracks }
      };
    } catch {
      console.warn(`Album ${id} API failed. Returning mock album.`);
      const idHash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const mockIndex = Math.abs(idHash) % MOCK_ALBUMS.length;
      const result = { ...MOCK_ALBUMS[mockIndex], id };
      return await enhanceWithImages(result);
    }
  }

  async getArtist(id) {
    const mockMatch = MOCK_ARTISTS.find(a => a.id === id);
    if (mockMatch) return mockMatch;
    try {
      const data = await apiFetch(`/artist_overview/?id=${id}`);
      const artist = data.data?.artist || data.artist || data;
      const images = artist.visuals?.avatarImage?.sources || artist.visuals?.headerImage?.sources || artist.images || [];
      return {
        id: artist.id || id,
        name: artist.profile?.name || artist.name || '',
        images: images.map(s => ({ url: s.url })),
        followers: { total: artist.stats?.monthlyListeners || artist.stats?.followers || artist.followers?.total || 0 },
        genres: artist.profile?.genres?.items?.map(g => g.name) || artist.genres || []
      };
    } catch {
      console.warn(`Artist ${id} API failed. Returning mock artist.`);
      return { ...MOCK_ARTISTS[0], id };
    }
  }

  async getArtistTopTracks(id) {
    try {
      const data = await apiFetch(`/artist_overview/?id=${id}`);
      const artist = data.data?.artist || data.artist || data;
      const topTracks = artist.discography?.topTracks?.items || artist.discography?.popularReleases?.items || [];
      const tracks = topTracks.map(item => normalizeTrack(item.track || item)).filter(Boolean);
      return { tracks };
    } catch {
      console.warn(`Artist top tracks API failed. Returning mock tracks.`);
      const idHash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const shuffledTracks = [...MOCK_TRACKS]
        .sort((a, b) => {
          const hashA = (a.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * (idHash + 1)) % 100;
          const hashB = (b.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * (idHash + 1)) % 100;
          return hashA - hashB;
        })
        .slice(0, 5);
      return { tracks: shuffledTracks };
    }
  }
}

export const spotify = new SpotifyService();
