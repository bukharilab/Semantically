import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React, { useState } from 'react';

import Sidebar from './components/Sidebar';
import Highlights from './components/Highlights';

function App() {
  const [highlights, updateHighlights] = useState({});
//   const updateHighlight = (key, selected) => updateHighlights({...highlights, [key]: selected});
  return (
    <div className="App">
      <Sidebar highlights={highlights} updateHighlights={updateHighlights} />
      <Highlights highlights={highlights} />
    </div>
  );
}

export default App;
