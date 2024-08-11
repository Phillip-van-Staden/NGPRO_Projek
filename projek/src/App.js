import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Samewerking from './Pages/Samewerking';
import LoginSignup from './Pages/Login';
import Taakbestuur from './Pages/Taakbestuur';
import ProjekBestuur from './Pages/Projekbestuur';

function App() {
  return (
   <>
    <Router>
      <Switch>
        <Route path='/' exact Component={LoginSignup}/>
        <Route path='/taakbestuur' Component={Taakbestuur}/>
      </Switch>
    </Router>
    <>
      {/* <Samewerking/> */}
      {/* <ProjekBestuur/> */}
    </>
   </>
  );
}

export default App;
