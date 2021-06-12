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
  const [removedHighlights, updateRemovedHighlights] = useState([]);
  const tree = $("#tree")[0].NCBOTree;
  // tree.on('afterJumpToClass', classId => {
  //   console.log('jumped to class.');
  // });
  // tree.jumpToClass('https://data.bioontology.org/ontologies/NCIT/class…ih.gov%2Fxml%2Fowl%2FEVS%2FThesaurus.owl%23C41204');

  console.log(tree);

  return (
    <div className="App">
      <Sidebar highlights={highlights} updateHighlights={updateHighlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight}
        removedHighlights={removedHighlights} updateRemovedHighlights={updateRemovedHighlights} />
      <Highlights highlights={highlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight}
        removedHighlights={removedHighlights} />
    </div>
  );
}

export default App;
