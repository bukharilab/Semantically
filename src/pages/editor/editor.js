import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { useParams } from 'react-router-dom';

import Sidebar from './components/sidebar/Sidebar';
import Publish from './components/publish';
import DocumentEditor from './components/editor/DocumentEditor';

const Editor = () => {
  const { documentId } = useParams();
  // const documentId = '2';
  console.log(documentId);

  const [content, updateContent] = useState('');
  const [editor, updateEditor] = useState(null);
  const [annotations, updateAnnotations] = useState({});
  const [definitions, updateDefinitions] = useState({});
  const [highlights, updateHighlights] = useState({});
  const [currentHighlight, setCurrentHighlight] = useState('');
  const [removedHighlights, updateRemovedHighlights] = useState([]);
  const [annotationSelection, updateAnnotationSelection] = useState({});

  const editorProps = {
    content: content, updateContent: updateContent,
    editor: editor, updateEditor: updateEditor,
    annotations: annotations, updateAnnotations: updateAnnotations,
    definitions: definitions, updateDefinitions: updateDefinitions,
    highlights: highlights, updateHighlights: updateHighlights,
    currentHighlight: currentHighlight, setCurrentHighlight: setCurrentHighlight,
    removedHighlights: removedHighlights, updateRemovedHighlights: updateRemovedHighlights,
    annotationSelection: annotationSelection, updateAnnotationSelection: updateAnnotationSelection
  };

  return (
    <div id="editor">
      <Sidebar {...editorProps} />
      <div style={{ width: '100%'}}>
        <Publish {...editorProps} />
        <DocumentEditor {...editorProps} />
      </div>
    </div>
  );
}

export default Editor;
