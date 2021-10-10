import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Gradebook from './components/Gradebook';
import Assignment from './components/Assignment';
import Login from './components/Login';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <AppBar position="static" color="default">
        <Toolbar>
           <Typography variant="h6" color="inherit">
            Gradebook
           </Typography>
        </Toolbar>
      </AppBar>
      <BrowserRouter>
       <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/assignment' component={Assignment} />
        <Route path='/gradebook/:assignmentId' component={Gradebook} />
       </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
