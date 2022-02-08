import "./editor.css";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import EditorSidebar from "./components/EditorSidebar";
import EditorHelper from "./components/editorsHelper";

const Editor = () => {
  const { documentId } = useParams();
  // const documentId = '2';
  console.log(documentId);

  const [content, updateContent] = useState("");
  const [editor, updateEditor] = useState(null);
  const [annotations, updateAnnotations] = useState({});
  const [definitions, updateDefinitions] = useState({});
  const [highlights, updateHighlights] = useState({});
  const [currentHighlight, setCurrentHighlight] = useState("");
  const [removedHighlights, updateRemovedHighlights] = useState([]);
  const [annotationSelection, updateAnnotationSelection] = useState({});

  const [showAccordion, updateShowAccordion] = useState(false);
  const [loadHighlights, updateLoadHighlights] = useState(false);

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
  };

  return (
    <div className="d-flex flex-row">
      <EditorSidebar />
      <EditorHelper {...editorProps} />
    </div>
  );
};

export default Editor;
