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

## 📂 Project Structure

```bash
src/
├── components/
│   ├── common/      # FilterBar, Navbar, Sidebar
│   ├── cards/       # PlaylistCard, TrackRow, MoodCard
│   ├── player/      # MusicPlayer, AmbientMode
│   └── sections/    # Contextual UI sections
├── context/         # Player, Theme, and Library state
├── hooks/           # useSpotify, usePlayer, etc.
├── pages/           # Home, Search, Library, Detail views
├── services/        # Core API logic and fallbacks
└── assets/          # Brand assets and styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- A RapidAPI Key (Optional, mocks work by default)

### Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/aviiixbuilds/AURA.git
   cd AURA
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment (Optional)**
   Create a `.env` file in the root:
   ```env
   VITE_RAPIDAPI_KEY=your_key_here
   VITE_RAPIDAPI_KEY_2=another_key_here
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

Built with ❤️ by **[aviiixbuilds](https://github.com/aviiixbuilds)**

### Contributors
[**Sunny Pandey**](https://github.com/pandeysunny016-dot)

</div>
