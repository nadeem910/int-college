import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/login/Login'
import SecretNavBar from './components/SecretNavBar';
import LecturerApp from './components/lecturerComp/LecturerApp'
import StudentApp from './components/studentComp/StudentApp'
function App() {
  return (
    <div className="App">
       <Router>
        <SecretNavBar />
        <Switch>
          <Route exact path="/"><Redirect to="/login"/></Route>
          <Route path='/login' component={() => <Login />} />
          <Route path='/lecturer' component={() => <LecturerApp />} />
          <Route path='/student' component={() => <StudentApp />} />
        </Switch>
      </Router>
        {/* <Login/> */}
    </div>
  );
}

export default App;
