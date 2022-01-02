import './editor.css';

import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import EditorSidebar from './components/EditorSidebar';
import Sidebar from './components/sidebar/Sidebar';
import Publish from './components/publish';
import DocumentEditor from './components/editor/DocumentEditor';

import { storeAnnotations, getAnnotations } from './hooks/editor/documentAPI';

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

  const [showAccordion, updateShowAccordion] = useState(false);
  const [loadHighlights, updateLoadHighlights] = useState(false);
  const resetAnnotations = () => {
    updateAnnotations({});
    updateHighlights({});
    setCurrentHighlight('');
    updateDefinitions({});
  }

  const editorProps = {
    documentId: documentId,
    content: content, updateContent: updateContent,
    editor: editor, updateEditor: updateEditor,
    annotations: annotations, updateAnnotations: updateAnnotations,
    definitions: definitions, updateDefinitions: updateDefinitions,
    highlights: highlights, updateHighlights: updateHighlights,
    currentHighlight: currentHighlight, setCurrentHighlight: setCurrentHighlight,
    removedHighlights: removedHighlights, updateRemovedHighlights: updateRemovedHighlights,
    annotationSelection: annotationSelection, updateAnnotationSelection: updateAnnotationSelection,
    showAccordion: showAccordion, updateShowAccordion: updateShowAccordion,
    loadHighlights: loadHighlights, updateLoadHighlights: updateLoadHighlights,
    resetAnnotations: resetAnnotations
  };

  // // persist annotations
  // const [cookies, setCookie] = useCookies([documentId]);
  // const [annotationsLoaded, updateAnnotationsLoaded] = useState(false);
  // const [currSaveAnnotations, updateCurrSaveAnnotations] = useState('');
  // const [nextSaveAnnotations, updateNextSaveAnnotations] = useState('');


  // // store next set of annotations
  // const saveAnnotations = () => {
  //   if (!nextSaveAnnotations || currSaveAnnotations) return;
  //   console.log(nextSaveAnnotations);
  //   updateCurrSaveAnnotations(nextSaveAnnotations);
  //   // console.log(nextSaveAnnotations);
  //   updateNextSaveAnnotations('');
  //   storeAnnotations(documentId, nextSaveAnnotations, () => {
  //     updateCurrSaveAnnotations('');
  //     saveAnnotations();
  //   });
  // };

  // useEffect(() => {
  //   saveAnnotations();
  // }, [nextSaveAnnotations])

  // // signal store annotations when change occures
  // useEffect(() => {
  //   if (annotationsLoaded) {
  //     const annotationsCookie = {
  //       content: content,
  //       annotations: annotations,
  //       definitions: definitions,
  //       highlights: highlights,
  //       currentHighlight: currentHighlight,
  //       removedHighlights, removedHighlights,
  //       annotationSelection: annotationSelection
  //     };
  //     // only store if no ongoing storing attempt
  //     // if (currSaveAnnotations) 
  //       updateNextSaveAnnotations(encodeURIComponent(JSON.stringify(annotationsCookie)));
  //     // else {
  //     //   saveAnnotations(encodeURIComponent(JSON.stringify(annotationsCookie)));
  //     // }
  //   }
  // }, [annotations, definitions, highlights, currentHighlight, removedHighlights, annotationSelection]);

  // useEffect(() => {
  //   if (content && !annotationsLoaded) {
  //     const callback = annos => {
  //       if (!annos) {
  //         updateAnnotationsLoaded(true);
  //         return;
  //       }
  //       const savedAnnotations = JSON.parse(decodeURIComponent(annos));
  //       console.log(savedAnnotations);
  //       if (savedAnnotations.content === content) {
  //         if (savedAnnotations.annotations) 
  //           updateAnnotations(savedAnnotations.annotations);
  //         if (savedAnnotations.definitions) 
  //           updateDefinitions(savedAnnotations.definitions);
  //         if (savedAnnotations.highlights) 
  //           updateHighlights(savedAnnotations.highlights);
  //         if (savedAnnotations.currentHighlight) 
  //           setCurrentHighlight(savedAnnotations.currentHighlight);
  //         if (savedAnnotations.removedHighlights) 
  //           updateRemovedHighlights(savedAnnotations.removedHighlights);
  //         if (savedAnnotations.annotationSelection) 
  //           updateAnnotationSelection(savedAnnotations.annotationSelection);
  //         updateShowAccordion(true);
  //         updateLoadHighlights(true);
  //       }
  //       updateAnnotationsLoaded(true);
  //     };
  //     getAnnotations(documentId, callback);
  //   }
  // }, [content])

  return (
    <div className="d-flex flex-row">
      <EditorSidebar />
      <div id="editor">
        <Sidebar {...editorProps} />
        <div style={{ width: '100%'}}>
          <Publish {...editorProps} />
          <DocumentEditor {...editorProps} />
        </div>
      </div>
    </div>
  );
}

export default Editor;
