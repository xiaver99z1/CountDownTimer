
import './App.css';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Stopwatch from './components/Stopwatch';

function App() {
  return (
    <Router>
      <Switch>
          <Route exact path='/' component={Stopwatch} />
      </Switch>
    </Router>
  );
}

export default App;
