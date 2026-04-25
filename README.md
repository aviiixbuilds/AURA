<div align="center">

# 🌌 AURA
### *Advanced User Responsive Architecture*

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Status](https://img.shields.io/badge/Status-Alpha-orange?style=for-the-badge)](https://github.com/aviiixbuilds/AURA)

**AURA** is a high-performance, aesthetically driven Spotify clone designed for immersive and cinematic musical discovery. It bridges the gap between deep technical resilience and ethereal, modern beauty.

[View Demo](https://aviiixbuilds.github.io/AURA) • [Report Bug](https://github.com/aviiixbuilds/AURA/issues) • [Request Feature](https://github.com/aviiixbuilds/AURA/issues)

</div>

---

## 🛠 Tech Stack


| Category | Technology |
|---|---|
| **Core** | React 19, Vite 8, JavaScript (ES6+) |
| **Styling** | Modern CSS (Glassmorphism, Dynamic Gradients) |
| **Animation** | Framer Motion (Page Transitions, Hover Effects) |
| **Icons** | Lucide React |
| **Data** | Spotify Web API (via RapidAPI), iTunes Search API |
| **Routing** | React Router DOM v7 |

---

## 🧠 Technical Edge: Smart Service Layer

AURA is designed to be "always on." Our `spotify.js` service layer is a masterpiece of resilience:

> [!IMPORTANT]
> **API Key Rotation**: AURA automatically rotates through multiple RapidAPI keys if one hits a rate limit or fails, ensuring uninterrupted service.

> [!TIP]
> **Multi-Tier Fallbacks**: 
> 1. **Live API**: Real-time data from Spotify.
> 2. **iTunes Fallback**: Fetches missing high-res images if Spotify returns empty assets.
> 3. **Deterministic Mocks**: If the API is completely offline, AURA generates a consistent, deterministic mock UI based on ID hashes so the experience never breaks.

---

## ✨ Core Features

AURA is packed with advanced JavaScript features and a custom-built state management system:

### 🎵 Immersive Music Player
*   **Persistent Playback**: Music continues seamlessly as you navigate through different pages.
*   **Smart Queue**: Automatically generates queues based on the playlist or album you're listening to.
*   **Playback Controls**: Full support for Shuffle, Repeat (Off/All/One), and Volume control.

### 🔍 Advanced Search
*   **Real-time Discovery**: Instant search results for tracks, albums, artists, and playlists.
*   **Multi-Category Results**: Segmented search views that help you find exactly what you're looking for.

### 💾 Local Storage Persistence
*   **Liked Songs Playlist**: A dedicated, personal collection that is saved locally to your browser. No login required.
*   **Recently Played Tracking**: A dynamic "Recents" section on the home screen that keeps track of your listening history in real-time.
*   **Volume Memory**: AURA remembers your last volume setting even after you close the tab.

### 🎨 AURA Dynamic UI
*   **Glassmorphism Design**: A premium, modern aesthetic with blurred backgrounds and sleek transitions.
*   **Ambient Mode**: A distraction-free listening experience with beautiful, animated backgrounds that respond to the music.
*   **Responsive Layout**: Optimized for all screen sizes using CSS Container Queries and modern Flexbox/Grid.

---

## 📂 Project Structure

AURA follows a modular, feature-first architecture to ensure scalability and clean separation of concerns:

### 📦 `src/context/` (State Management)
*   **`PlayerContext.jsx`**: The brain of the application. Handles audio playback, queue management, simulation logic, and global player state.
*   **`LibraryContext.jsx`**: Manages user-specific data like Liked Songs, custom playlists, and Recently Played history with Local Storage persistence.
*   **`ThemeContext.jsx`**: Controls the visual atmosphere and global styling variables.

### 🪝 `src/hooks/` (Custom Hooks)
*   **`useSpotify.js`**: A custom hook for fetching data with automatic rotation between multiple API keys and fallback to mock data.
*   **`usePlayer.js`**: Shortcut for accessing the global player state and controls.

### 🧩 `src/components/` (UI Components)
*   **`common/`**: Core layout elements like **`Navbar`**, **`Sidebar`**, and the Portal-based **`Tooltip`** system.
*   **`player/`**: The **`Player`** controls, volume bar, and the high-performance **`AmbientMode`** visualizer.
*   **`cards/`**: Reusable display components like **`PlaylistCard`** and **`TrackRow`**.

### 📄 `src/pages/` (Views)
*   **`Home.jsx`**: The dynamic landing page with recent activity grids and personalized sections.
*   **`LikedSongs.jsx`**: A dedicated view for the user's locally-saved song collection.
*   **`Search.jsx`**: The multi-category search interface.
*   **`PlaylistDetail.jsx`** / **`AlbumDetail.jsx`** / **`ArtistPage.jsx`**: Contextual detail views for different Spotify entities.

### ⚙️ `src/services/` (API & Logic)
*   **`spotify.js`**: The core service layer that handles communication with the Spotify API, iTunes fallback, and error handling.

---

<div align="center">

Built by **Flashpoint Force**

### Contributors
[**Aviral Dwivedi**](https://github.com/aviiixbuilds) • [**Sunny Pandey**](https://github.com/pandeysunny016-dot) • [**Ansh Jangir**](https://github.com/saamved)

</div>
