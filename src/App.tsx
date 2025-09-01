import { Routes, Route } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Explore from './pages/Explore'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </div>
  )
}

export default App
