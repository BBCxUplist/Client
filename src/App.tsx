import { Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import ArtistProfile from './pages/ArtistProfile';
import ArtistEdit from './pages/ArtistEdit';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Messages from './pages/Messages';
import { QueryProvider } from './providers/QueryProvider';

function App() {
  return (
    <QueryProvider>
      <div>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/artist/:username' element={<ArtistProfile />} />
          <Route path='/artist/:username/edit' element={<ArtistEdit />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </div>
    </QueryProvider>
  );
}

export default App;
