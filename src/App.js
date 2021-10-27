import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React, { useState, useEffect } from 'react';
import {BrowserRouter, Switch, Route, useParams} from 'react-router-dom';

import $ from 'jquery';

import Sidebar from './components/Sidebar';
import Highlights from './components/Highlights';
import NCBOTree from './hooks/NCBOTree';

import {readDocument} from './hooks/documentAPI';

function App() {
  const [documentId, updateDocumentId] = useState('');

  const [highlights, updateHighlights] = useState({});
  const [currentHighlight, setCurrentHighlight] = useState('');
  const [annotationSelection, updateAnnotationSelection] = useState({});
  const [removedHighlights, updateRemovedHighlights] = useState([]);
  const tree = $("#tree")[0].NCBOTree;
  // tree.on('afterJumpToClass', classId => {
  //   console.log('jumped to class.');
  // });
  // tree.jumpToClass('https://data.bioontology.org/ontologies/NCIT/class…ih.gov%2Fxml%2Fowl%2FEVS%2FThesaurus.owl%23C41204');

  useEffect(() => readDocument('2', updateContent), [documentId]);

  return (
    <div>
      <BrowserRouter><Switch>

        <Route path="/:documentId" component={AppComponents} />
      </Switch></BrowserRouter>
    </div>
  );
}

const AppComponents = () => {
  const [documentId, updateDocumentId] = useState(useParams().documentId);

  const [highlights, updateHighlights] = useState({});
  const [currentHighlight, setCurrentHighlight] = useState('');
  const [annotationSelection, updateAnnotationSelection] = useState({});
  const [removedHighlights, updateRemovedHighlights] = useState([]);
  const tree = $("#tree")[0].NCBOTree;
  // tree.on('afterJumpToClass', classId => {
  //   console.log('jumped to class.');
  // });
  // tree.jumpToClass('https://data.bioontology.org/ontologies/NCIT/class…ih.gov%2Fxml%2Fowl%2FEVS%2FThesaurus.owl%23C41204');

  useEffect(() => readDocument('2', updateContent), [documentId]);

  return (
    <div className="App">
      <Sidebar highlights={highlights} updateHighlights={updateHighlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight}
        removedHighlights={removedHighlights} updateRemovedHighlights={updateRemovedHighlights} annotationSelection={annotationSelection} updateAnnotationSelection ={updateAnnotationSelection} />
      <Highlights highlights={highlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight}
        removedHighlights={removedHighlights} annotationSelection={annotationSelection} />
    </div>
  );
}

function updateContent(content) {
  document.querySelector("trix-editor").innerText = content;
};


export default App;
