import './App.css';

import Sidebar from './components/Sidebar';
import Home from './pages/Home';

function App() {
  return (
    <div id="app">
      <Sidebar />
      <div id="body"><Home /></div>
    </div>
  );
}

export default App;
