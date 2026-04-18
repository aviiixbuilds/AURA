import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PlayerProvider } from './context/PlayerContext'
import { ThemeProvider } from './context/ThemeContext'
import { LibraryProvider } from './context/LibraryContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LibraryProvider>
      <PlayerProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PlayerProvider>
    </LibraryProvider>
  </StrictMode>,
)
