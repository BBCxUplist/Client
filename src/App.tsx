import { Routes, Route } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Explore from './pages/Explore'
import ArtistProfile from './pages/ArtistProfile'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/artist/:username" element={<ArtistProfile />} />
      </Routes>
    </div>
  )
}

export default App
