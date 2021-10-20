import './App.css';

import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Post from './pages/Post';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

function App() {
  return (
    <div id="app">
      <Sidebar />
      <div id="body">
        <BrowserRouter><Switch>
          <Route path="/post" component={Post} />
          <Route path="/" component={Home} />
        </Switch></BrowserRouter>
      </div>
    </div>
  );
}

export default App;
