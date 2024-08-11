import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Samewerking from './Pages/Samewerking';
import LoginSignup from './Pages/Login';
import Taakbestuur from './Pages/Taakbestuur';
import Kalender from './Pages/Kalender';
import Vordering from './Pages/Vordering';
import ProjekBestuur from './Pages/Projekbestuur';

function App() {
  return (
   <>
    <Router>
      <Routes>
        <Route path='/' element={<LoginSignup/>}/>
        <Route path='/taakbestuur' element={<Kalender/>}/>
      </Routes>
    </Router>
    <>
      {/* <Samewerking/> */}
      {/* <ProjekBestuur/> */}
    </>
   </>
  );
}

export default App;
