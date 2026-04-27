<div align="center">

# 🌌 AURA
### *Advanced User Responsive Architecture*

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Status](https://img.shields.io/badge/Status-Alpha-orange?style=for-the-badge)](https://github.com/aviiixbuilds/AURA)

**AURA** is a high-performance, aesthetically driven music platform designed for immersive and cinematic musical discovery. It bridges the gap between deep technical resilience and ethereal, modern beauty.

[View Live Demo](https://aura-eight-pi.vercel.app) • [Report Bug](https://github.com/aviiixbuilds/AURA/issues) • [Request Feature](https://github.com/aviiixbuilds/AURA/issues)

</div>

---

## 🛠 Tech Stack


| Category | Technology |
|---|---|
| **Core** | React 19, Vite 8, JavaScript (ES6+) |
| **Styling** | Modern CSS (Glassmorphism, Dynamic Gradients, Video Backgrounds) |
| **Animation** | Framer Motion (Page Transitions, Cinematic Loaders) |
| **Icons** | Lucide React |
| **Data** | Spotify Web API (via RapidAPI), Wikipedia API, iTunes Search API |
| **Routing** | React Router DOM v7 |

---

## 🧠 Technical Edge: Smart Service Layer

AURA is designed to be "always on." Our `spotify.js` service layer is a masterpiece of resilience:

> [!IMPORTANT]
> **API Key Rotation**: AURA automatically rotates through multiple RapidAPI keys if one hits a rate limit or fails, ensuring uninterrupted service.

> [!TIP]
> **Multi-Tier Fallbacks**: 
> 1. **Live API**: Real-time data from Spotify.
> 2. **Wikipedia Integration**: Dynamically fetches high-resolution artist portraits when standard APIs fall short.
> 3. **iTunes Fallback**: Fetches missing high-res track/album images if assets are empty.
> 4. **Deterministic Mocks**: If the API is completely offline, AURA generates a consistent, deterministic mock UI so the experience never breaks.

---

## ✨ Core Features

AURA is packed with advanced JavaScript features and a custom-built state management system:

### 🎭 Cinematic Aesthetic & UI
*   **Video & Animated Backgrounds**: Global animated GIF layouts and a seamless looping video background for the library sidebar.
*   **Premium Loading Experience**: An engineered, artificial loading delay paired with a glowing 3D globe animation and smooth CSS fade-outs.
*   **Glassmorphism Design**: A premium, modern aesthetic with blurred backgrounds, deep blue gradients, and sleek transitions.
*   **Interactive Profile Dropdown**: A smart, click-away user profile menu featuring simulated live updates.

### 🎵 Immersive Music Player
*   **Persistent Playback**: Music continues seamlessly as you navigate through different pages without layout clipping.
*   **Smart Queue**: Automatically generates queues based on the playlist or album you're listening to.
*   **Playback Controls**: Full support for Shuffle, Repeat (Off/All/One), and Volume control.

### 🔍 Advanced Search
*   **Real-time Discovery**: Instant search results for tracks, albums, artists, and playlists.
*   **Multi-Category Results**: Segmented search views that help you find exactly what you're looking for.

### 💾 Local Storage Persistence
*   **Liked Songs Playlist**: A dedicated, personal collection with a custom gradient cover, saved locally to your browser.
*   **Recently Played Tracking**: A dynamic "Recents" section on the home screen that keeps track of your listening history in real-time.
*   **Volume Memory**: AURA remembers your last volume setting even after you close the tab.

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── common/
│   ├── cards/
│   ├── player/
│   └── sections/
├── context/
│   ├── PlayerContext.jsx
│   ├── LibraryContext.jsx
│   └── ThemeContext.jsx
├── hooks/
│   ├── useSpotify.js
│   └── usePlayer.js
├── pages/
│   ├── Home.jsx
│   ├── Search.jsx
│   ├── LikedSongs.jsx
│   ├── PlaylistDetail.jsx
│   ├── AlbumDetail.jsx
│   └── ArtistPage.jsx
├── services/
│   └── spotify.js
└── assets/
```

---

<div align="center">

Built by **Flashpoint Force**

### Contributors
[**Aviral Dwivedi**](https://github.com/aviiixbuilds) • [**Sunny Pandey**](https://github.com/pandeysunny016-dot) • [**Ansh Jangir**](https://github.com/saamved)

</div>
