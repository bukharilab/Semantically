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
  // tree.jumpToClass("http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C63536");

  // initialize tree
//   NCBOTree(document.querySelector("#tree"), {
//     apikey: "89f4c54e-aee8-4af5-95b6-dd7c608f057f",
//     ontology: "NCIT"
//   });
//   const tree = $("#tree").NCBOTree({
//     apikey: "89f4c54e-aee8-4af5-95b6-dd7c608f057f",
//     ontology: "NCIT"
//   });

//   $.getScript("http://bioportal.bioontology.org/widgets/jquery.ncbo.tree-2.0.2.js", function( data, textStatus, jqxhr ) {
//     console.log( data ); // Data returned
//     console.log( textStatus ); // Success
//     console.log( jqxhr.status ); // 200
//     console.log( "Load was performed." );
//     const tree = $("#tree").NCBOTree({
//       apikey: "89f4c54e-aee8-4af5-95b6-dd7c608f057f",
//       ontology: "NCIT"
//     });
//     console.log("tree loaded");
//   });

//   const updateHighlight = (key, selected) => updateHighlights({...highlights, [key]: selected});
  return (
    <div className="App">
      <Sidebar highlights={highlights} updateHighlights={updateHighlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight} />
      <Highlights highlights={highlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight} />
    </div>
  );
}

export default App;
