import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Samewerking from './Pages/Samewerking';
import LoginSignup from './Pages/Login';
import Taakbestuur from './Pages/Taakbestuur';
import LeerOplaai from './Pages/LeerOplaai';
import Kalender from './Pages/Kalender';
import Vordering from './Pages/Vordering';
import ProjekBestuur from './Pages/Projekbestuur';

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
        <Route path='/vordering' element={<Vordering/>}/>
        <Route path='/projekbestuur' element={<ProjekBestuur/>}/>

      </Routes>
    </Router>
   </>
  );
}

export default App;
