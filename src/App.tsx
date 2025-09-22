import { Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import ArtistProfile from './pages/ArtistProfile';
import ArtistEdit from './pages/ArtistEdit';
import ArtistDashboard from './pages/ArtistDashboard';
import UserDashboard from './pages/UserDashboard';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import Messages from './pages/Messages';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/artist/:username' element={<ArtistProfile />} />
        <Route path='/artist/:username/edit' element={<ArtistEdit />} />
        <Route
          path='/artist/:username/dashboard'
          element={<ArtistDashboard />}
        />
        <Route path='/user/dashboard' element={<UserDashboard />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
