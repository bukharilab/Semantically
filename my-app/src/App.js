import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React, { useState } from 'react';

import $ from 'jquery';

import Sidebar from './components/Sidebar';
import Highlights from './components/Highlights';
import NCBOTree from './hooks/NCBOTree';

function App() {
  const [highlights, updateHighlights] = useState({});
  const [currentHighlight, setCurrentHighlight] = useState('');
  const tree = $("#tree")[0].NCBOTree;
  console.log(tree);

  return (
    <div className="App">
      <Sidebar highlights={highlights} updateHighlights={updateHighlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight} />
      <Highlights highlights={highlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight} />
    </div>
  );
}

export default App;
