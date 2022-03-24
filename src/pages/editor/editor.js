import "./editor.css";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import EditorSidebar from "./components/EditorSidebar";
import EditorHelper from "./components/editorsHelper";

const Editor = () => {
  const { documentId } = useParams();
  // const documentId = '2';
  console.log(documentId);

  const [content, updateContent] = useState(""); // CONTENT IN THE EDITOR
  const [editor, updateEditor] = useState(null); // THE TRIX EDITOR COMPONENT
  const [annotations, updateAnnotations] = useState({}); // INFORMATION ABOUT ONTOLOGIES AND THEIR MATCHES WITH TERMINOLOGIES
  const [definitions, updateDefinitions] = useState({}); // ALREADY RETRIEVED DEFINITIONS FOR VISITED ONTOLOGIES
  const [highlights, updateHighlights] = useState({});
  const [currentHighlight, setCurrentHighlight] = useState(""); // WHICH TERMINOLOGY IS SELECTED
  const [removedHighlights, updateRemovedHighlights] = useState([]); // ANNOTATIONS THAT HAVE BEEN DELETED
  const [annotationSelection, updateAnnotationSelection] = useState({}); // WHICH ONTOLOGY HAS BEEN SELECTED FOR EACH TERM BY INDEX

  const [showAccordion, updateShowAccordion] = useState(false);
  const [loadHighlights, updateLoadHighlights] = useState(false);

  ///////////////// asim
  //const [record, updateRecord] =  useState(false);

  const editorProps = {
    documentId: documentId,
    content: content,
    updateContent: updateContent,
    editor: editor,
    updateEditor: updateEditor,
    annotations: annotations,
    updateAnnotations: updateAnnotations,
    definitions: definitions,
    updateDefinitions: updateDefinitions,
    highlights: highlights,
    updateHighlights: updateHighlights,
    currentHighlight: currentHighlight,
    setCurrentHighlight: setCurrentHighlight,
    removedHighlights: removedHighlights,
    updateRemovedHighlights: updateRemovedHighlights,
    annotationSelection: annotationSelection,
    updateAnnotationSelection: updateAnnotationSelection,
    showAccordion: showAccordion,
    updateShowAccordion: updateShowAccordion,
    loadHighlights: loadHighlights,
    updateLoadHighlights: updateLoadHighlights,
    // record:record,
    // updateRecord:updateRecord,
  };

  return (
    <div className="d-flex flex-row">
      <EditorSidebar />
      <EditorHelper {...editorProps} />
    </div>
  );
};

export default Editor;
