<div align="center">

# AURA
### *Advanced User Responsive Architecture*

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Status](https://img.shields.io/badge/Status-Alpha-orange?style=for-the-badge)](https://github.com/aviiixbuilds/AURA)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**AURA** is a high-performance, aesthetically driven React foundation designed for building immersive and cinematic digital experiences. 
It bridges the gap between raw power and ethereal beauty.

[Explore Documentation](https://github.com/aviiixbuilds/AURA#getting-started) • [View Demo](https://github.com/aviiixbuilds/AURA) • [Report Bug](https://github.com/aviiixbuilds/AURA/issues)

</div>

---

## Overview

AURA is a React-based web application inspired by Spotify. It replicates the core Spotify experience — browsing, searching, and playing music — while layering on visual effects inspired by Spicetify (a popular Spotify client customizer known for dynamic theming, animations, and immersive now-playing experiences).

The goal is a fully functional, visually impressive multi-page music app that uses the official Spotify Web API for real data.

---

## ✨ Vision
AURA was born from a desire to create web interfaces that don't just function but *feel* alive. Inspired by the soft glow of neon and the fluidity of light, AURA provides a premium starting point for developers who prioritize UI/UX excellence without compromising on performance.

## 🚀 Features
- **💎 Luminous UI Components**: Pre-styled components with a focus on glassmorphism and soft light effects.
- **⚡ Next-Gen Performance**: Built on Vite 8 and React 19 for instantaneous feedback and blazing speeds.
- **🎨 Atmospheric Design**: Integrated support for dynamic themes and fluid CSS animations.
- **🛠 Developer First**: Fully type-safe and optimized for a seamless development experience.
- **📱 Responsive by Nature**: Pixel-perfect layouts across all devices.

---

## 🏗 Scope

**In scope**
- Full Spotify clone (home, search, library, playlist/album/artist pages)
- Working music player with 30-second previews
- Dynamic color theming from album art (Spicetify-inspired)
- Lyrics view
- Ambient/immersive now-playing mode
- Mood-based discovery rooms
- Liked songs and library (localStorage)
- Session stats

**Out of scope**
- Full song playback (requires Spotify Premium + SDK)
- User login / OAuth (we use Client Credentials flow for public data)
- Backend / database
- Mobile app

---

## 🗺 Pages & Routes

| Page | Route | Description |
|---|---|---|
| Home | `/` | Featured playlists, new releases, mood rooms |
| Search | `/search` | Live search — songs, albums, artists |
| Library | `/library` | Saved playlists, liked songs, recently played |
| Playlist | `/playlist/:id` | Full tracklist + playlist info |
| Album | `/album/:id` | Album tracks + artist info |
| Artist | `/artist/:id` | Top tracks, albums, related artists |
| Liked Songs | `/liked` | All liked tracks |

---

## 🛠 Feature Breakdown

### 1. Music Player (persistent bottom bar)
- Current track info (name, artist, cover art)
- Play / pause / previous / next controls
- Seek bar with current time and duration
- Volume control
- 30-second audio preview via `preview_url` from Spotify API
- Queue drawer (slide in from right)
- Click album art → expand to full ambient mode

### 2. Dynamic Color Theming (Spicetify-inspired)
- On every track or page change, extract dominant color from album art
- Library: `node-vibrant`
- Apply color as a soft gradient background across the current page
- Smooth CSS transition between colors (`transition: background 0.7s ease`)
- Player bar glass effect reflects current color

### 3. Search
- Controlled input with `onChange`
- Debounced API call (300ms) using `useEffect`
- Results split into: Songs / Artists / Albums sections
- Skeleton loading cards while fetching

### 4. Mood Rooms
- Curated static playlists per mood category
- Moods: Focused / Late Night / Energy / Melancholic / Feel Good
- Displayed as large clickable cards on the home page

### 5. Lyrics View
- Fetched from Lyrics.ovh API using current track name + artist
- Displayed in a clean scrollable panel next to the player
- Shown/hidden via toggle button in the player bar

### 6. Ambient Mode
- Triggered by clicking the album art in the player bar
- Full-screen overlay: album art blurred and stretched as background
- Song info and controls centered on top
- Controls fade in on hover, fade out on idle
- Exit with Escape key or close button

### 7. Library & Liked Songs
- Like button on every track row and card
- State stored as array of track objects in `useState`
- Persisted to `localStorage` via `useEffect`
- Library page renders liked songs and saved playlists

### 8. Session Stats
- Track minutes listened (increment on `timeupdate` event)
- Count plays per track
- Show top genre, most played, total minutes in a stats card
- All in-memory, reset on page refresh

---

## 📂 Component Structure

```bash
src/
├── components/
│   ├── common/
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   └── Loader.jsx
│   ├── cards/
│   │   ├── PlaylistCard.jsx
│   │   ├── AlbumCard.jsx
│   │   ├── ArtistCard.jsx
│   │   └── TrackRow.jsx
│   ├── player/
│   │   ├── Player.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── VolumeControl.jsx
│   │   ├── Queue.jsx
│   │   └── AmbientMode.jsx
│   └── sections/
│       ├── FeaturedBanner.jsx
│       ├── MoodRooms.jsx
│       ├── HorizontalRow.jsx
│       └── LyricsView.jsx
├── pages/
│   ├── Home.jsx
│   ├── Search.jsx
│   ├── Library.jsx
│   ├── PlaylistDetail.jsx
│   ├── AlbumDetail.jsx
│   ├── ArtistPage.jsx
│   └── LikedSongs.jsx
├── context/
│   ├── PlayerContext.jsx      ← current track, queue, playing state
│   └── ThemeContext.jsx       ← dynamic color state
├── hooks/
│   ├── useSpotify.js          ← API fetch wrapper
│   ├── usePlayer.js           ← audio element logic
│   ├── useLyrics.js           ← lyrics fetch
│   └── useVibrant.js          ← color extraction
├── services/
│   ├── spotify.js             ← all Spotify API calls
│   └── lyrics.js              ← Lyrics.ovh calls
└── utils/
    ├── formatTime.js
    ├── colorExtract.js
    └── storage.js
```

---

## 🌐 API Plan

### Spotify Web API

**Auth method:** Client Credentials (no user login needed)  
Gets you access to all public Spotify data.

**Endpoints we use:**

| Data | Endpoint |
|---|---|
| New releases | `GET /browse/new-releases` |
| Featured playlists | `GET /browse/featured-playlists` |
| Genre categories | `GET /browse/categories` |
| Category playlists | `GET /browse/categories/:id/playlists` |
| Search | `GET /search?q=&type=track,artist,album` |
| Playlist tracks | `GET /playlists/:id/tracks` |
| Album detail | `GET /albums/:id` |
| Artist detail | `GET /artists/:id` |
| Artist top tracks | `GET /artists/:id/top-tracks` |
| Artist albums | `GET /artists/:id/albums` |
| Related artists | `GET /artists/:id/related-artists` |

**30-second preview:** Every track object includes a `preview_url` field — a direct MP3 link. Feed this into an HTML `<audio>` element.

---

## 🎨 Design Direction (Spicetify-inspired)

- **Base:** Deep dark background (`#0a0a0a`)
- **Accent:** Dynamic — pulled from album art per session
- **Glass effect:** `backdrop-filter: blur(20px)` on player bar and modals
- **Typography:** Clean, minimal — `DM Sans` or `Geist` for body, `Bricolage Grotesque` for headings
- **Transitions:** All page changes animated via Framer Motion
- **Hover states:** Cards scale up slightly (`scale(1.04)`), smooth ease
- **Scrollbars:** Hidden on all horizontal scroll containers
- **Ambient mode:** Full bleed, blurred album art, dark overlay, centered controls

---

## ⚙️ State Management Summary

| State | Type | Hook | Storage |
|---|---|---|---|
| Current track | Object | `useState` | — |
| Is playing | Boolean | `useState` | — |
| Queue | Array of objects | `useState` | — |
| Volume | Number | `useState` | `localStorage` |
| Liked songs | Array of objects | `useState` | `localStorage` |
| Saved playlists | Array of objects | `useState` | `localStorage` |
| Search query | String | `useState` | — |
| Search results | Object | `useState` | — |
| Dynamic color | String (hex) | `useState` | — |
| Session stats | Object | `useState` | — |
| API token | String | `useEffect` | memory |

---

## 🚥 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- npm or yarn

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/aviiixbuilds/AURA.git
   ```
2. Navigate to the project directory
   ```bash
   cd AURA
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Start the development server
   ```bash
   npm run dev
   ```

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
Built with ❤️ by [aviiixbuilds](https://github.com/aviiixbuilds)
</div>
