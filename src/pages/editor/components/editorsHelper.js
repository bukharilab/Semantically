import React, {useState, useEffect} from 'react';
import $ from 'jquery';

import Sidebar from './sidebar/Sidebar';
import Publish from './publish';
import DocumentEditor from './editor/DocumentEditor';

import { storeAnnotations, getAnnotations, changeOntologySelection, changeDeleteAnnotation} from '../hooks/editor/documentAPI';

import getTermStr from '../hooks/sidebar/getTermString';
import getAnnotationSelection from '../hooks/editor/getAnnotationSelection';

const EditorHelper = editorProps => {

  const {documentId, editor, content, annotations, updateAnnotations, 
    updateHighlights, setCurrentHighlight, annotationSelection, updateAnnotationSelection, currentHighlight,
    updateDefinitions, updateShowAccordion, updateLoadHighlights } = editorProps;

  const [annotationsLoaded, updateAnnotationsLoaded] = useState(false);

  const resetAnnotations = () => {
    updateAnnotations({});
    updateHighlights({});
    setCurrentHighlight('');
    updateAnnotationSelection({});
    updateDefinitions({});
  }

  const saveAnnotations = (annotations) => {
    if (!$.isEmptyObject(annotations)) {
      const storedAnnotations = {};
      for (const term in annotations) {
        storedAnnotations[term] = {};
        const divider = term.indexOf('-');
        const from = Number(term.substring(0, divider))-1;
        const to = Number(term.substring(divider+1, term.length));

        storedAnnotations[term].from = from;
        storedAnnotations[term].to = to;
        storedAnnotations[term].text = getTermStr(term, content);
        storedAnnotations[term].onto_id = annotations[term][0].id;
        storedAnnotations[term].ontologies = annotations[term];
      }
      console.log("Store annotation",storedAnnotations);
      storeAnnotations(documentId, JSON.stringify(storedAnnotations));
    }
  };

  // save ontology change
  useEffect(() => {
    if (currentHighlight) {
      if (annotationSelection[currentHighlight] != -1) {
        const annotation = annotations[currentHighlight][annotationSelection[currentHighlight]];
        changeOntologySelection(documentId, annotation.annotation_id, annotation.ontologyId);
        changeDeleteAnnotation(documentId, annotation.annotation_id, -1);
      } else {
        const annotation = annotations[currentHighlight][0];
        changeDeleteAnnotation(documentId, annotation.annotation_id, 1);
      }
    }
  }, [annotationSelection]);

  // retrieve annotations
  useEffect(() => {
    if (editor && content) {
      console.log("editor update");
      getAnnotations(documentId, (annotations, ontologySelection, annotationDeletion) => {
        console.log("annotations",annotations, ontologySelection, annotationDeletion);
        if (!$.isEmptyObject(annotations)) {
          updateAnnotationsLoaded(true);
          updateAnnotations(annotations);
          updateAnnotationSelection(getAnnotationSelection(ontologySelection, annotationDeletion, annotations));
          updateShowAccordion(true);
          updateLoadHighlights(true);
        }
      });
    }
  }, [editor]);

  const editorHelperProps = {
    ...editorProps,
    annotationsLoaded: annotationsLoaded, updateAnnotationsLoaded: updateAnnotationsLoaded,
    resetAnnotations: resetAnnotations, saveAnnotations: saveAnnotations
  };
	
  return (
    <div id="editor">
      <Sidebar {...editorHelperProps} />
      <div style={{ width: '100%'}}>
        <Publish {...editorHelperProps} />
        <DocumentEditor {...editorHelperProps} />
      </div>
    </div>
  );
};

export default EditorHelper;
