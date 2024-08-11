import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Samewerking from './Pages/Samewerking';
import LoginSignup from './Pages/Login';
import Taakbestuur from './Pages/Taakbestuur';
import LeerOplaai from './Pages/LeerOplaai';
import Kalender from './Pages/Kalender';
import Vordering from './Pages/VorderingVolg';
import ProjekBestuur from './Pages/Projekbestuur';
import Dashboard from './Pages/Dashboard';
function App() {
  return (
   <>
    <Router>
      <Routes>
        <Route path='/' element={<LoginSignup/>}/>
        <Route path='/taakbestuur' element={<Taakbestuur/>}/>
        <Route path='/samewerking' element={<Samewerking/>}/>
        <Route path='/leeroplaai' element={<LeerOplaai/>}/>
        <Route path='/kalender' element={<Kalender/>}/>
        <Route path='/vorderingVolg' element={<Vordering/>}/>
        <Route path='/projekbestuur' element={<ProjekBestuur/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </Router>
   </>
  );
}

export default App;
