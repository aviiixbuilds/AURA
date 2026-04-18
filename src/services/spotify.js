/**
 * Spotify API Service using Client Credentials Flow
 * Note: For a production app, the token exchange should happen on a backend
 * to keep the Client Secret secure.
 */

const BASE_URL = 'https://api.spotify.com/v1';

class SpotifyService {
  constructor() {
    this.token = null;
    this.expiresAt = null;
  }

  async getAccessToken() {
    // Check if we already have a valid token
    if (this.token && this.expiresAt && Date.now() < this.expiresAt) {
      return this.token;
    }

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Spotify credentials missing from .env');
      return null;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
        },
        body: 'grant_type=client_credentials'
      });

      const data = await response.json();
      this.token = data.access_token;
      // Expires in 3600 seconds, setting buffer of 60 seconds
      this.expiresAt = Date.now() + (data.expires_in - 60) * 1000;
      
      return this.token;
    } catch (error) {
      console.error('Failed to fetch Spotify token:', error);
      return null;
    }
  }

  async fetchFromSpotify(endpoint) {
    const token = await this.getAccessToken();
    if (!token) return null;

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from Spotify (${endpoint}):`, error);
      return null;
    }
  }

  // --- Convenience Methods ---

  async getFeaturedPlaylists() {
    return this.fetchFromSpotify('/browse/featured-playlists?limit=10');
  }

  async getNewReleases() {
    return this.fetchFromSpotify('/browse/new-releases?limit=10');
  }

  async getCategories() {
    return this.fetchFromSpotify('/browse/categories?limit=5');
  }

  async search(query, types = 'track,artist,album') {
    return this.fetchFromSpotify(`/search?q=${encodeURIComponent(query)}&type=${types}&limit=20`);
  }

  async getPlaylist(id) {
    return this.fetchFromSpotify(`/playlists/${id}`);
  }

  async getAlbum(id) {
    return this.fetchFromSpotify(`/albums/${id}`);
  }

  async getArtist(id) {
    return this.fetchFromSpotify(`/artists/${id}`);
  }

  async getArtistTopTracks(id) {
    return this.fetchFromSpotify(`/artists/${id}/top-tracks?market=US`);
  }
}

export const spotify = new SpotifyService();
