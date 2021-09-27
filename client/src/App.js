
import './App.css';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Stopwatch from './components/Stopwatch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
      <CssBaseline />
        <Router>
          <Switch>
              <Route exact path='/' component={Stopwatch} />
          </Switch>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
