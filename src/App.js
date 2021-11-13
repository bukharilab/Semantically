import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React, { useState, useEffect } from 'react';
import {BrowserRouter, Switch, Route, useParams} from 'react-router-dom';

import $ from 'jquery';

// import Sidebar from './components/Sidebar';
// import Highlights from './components/Highlights';
// import NCBOTree from './hooks/NCBOTree';
// import Post from './pages/Post';

// import {readDocument, editDocument} from './hooks/documentAPI';

import Editor from './pages/editor/editor';

function App() {
  // const [documentId, updateDocumentId] = useState('');
  //
  // const [highlights, updateHighlights] = useState({});
  // const [currentHighlight, setCurrentHighlight] = useState('');
  // const [annotationSelection, updateAnnotationSelection] = useState({});
  // const [removedHighlights, updateRemovedHighlights] = useState([]);
  // const tree = $("#tree")[0].NCBOTree;
  // tree.on('afterJumpToClass', classId => {
  //   console.log('jumped to class.');
  // });
  // tree.jumpToClass('https://data.bioontology.org/ontologies/NCIT/class…ih.gov%2Fxml%2Fowl%2FEVS%2FThesaurus.owl%23C41204');



  return (
    <BrowserRouter><Switch>
      <Route path="/document/:documentId" component={Editor} />
    </Switch></BrowserRouter>
  );
}

// const AppComponents = () => {
//   const documentId = useParams().documentId;
//
//   const [highlights, updateHighlights] = useState({});
//   const [currentHighlight, setCurrentHighlight] = useState('');
//   const [annotationSelection, updateAnnotationSelection] = useState({});
//   const [removedHighlights, updateRemovedHighlights] = useState([]);
//   const tree = $("#tree")[0].NCBOTree;
//   const editor = document.querySelector("trix-editor");
//   // tree.on('afterJumpToClass', classId => {
//   //   console.log('jumped to class.');
//   // });
//   // tree.jumpToClass('https://data.bioontology.org/ontologies/NCIT/class…ih.gov%2Fxml%2Fowl%2FEVS%2FThesaurus.owl%23C41204');
//
//   let saveTimerId = '';
//   useEffect(() => {
//     // fetch document content
//     readDocument(documentId, updateContent);
//
//     // set content change listener
//     new MutationObserver(() => {
//       const content = editor.innerText;
//       clearTimeout(saveTimerId);
//       saveTimerId = setTimeout(() => editDocument(documentId, content), 1000);
//     }).observe(editor, {characterData: true, subtree: true});
//   }, []);
//
//
//
//   return (
//     <div className="App">
//       <Sidebar highlights={highlights} updateHighlights={updateHighlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight}
//         removedHighlights={removedHighlights} updateRemovedHighlights={updateRemovedHighlights} annotationSelection={annotationSelection} updateAnnotationSelection ={updateAnnotationSelection} />
//       <Highlights highlights={highlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight}
//         removedHighlights={removedHighlights} annotationSelection={annotationSelection} />
//     </div>
//   );
// }
//
// function updateContent(content) {
//   document.querySelector("trix-editor").innerText = content;
// };


export default App;
