import 'trix/dist/trix';
import 'trix/dist/trix.css';

import React, {useEffect, useState} from 'react';
import $ from 'jquery';
import { TrixEditor } from "react-trix";
import RemoveAnnotationsModal from '../sidebar/RemoveAnnotationsModal';

import Highlights from './Highlights';
import {readDocument, editDocument} from '../../hooks/editor/documentAPI';

const DocumentEditor = editorProps => {
  const {documentId, content, updateContent, editor, updateEditor, annotations, resetAnnotations} = editorProps;
  
  const [awaitingContent, updateAwaitingContent] = useState("");
  const trixEditorProps = {
    value: content,
    placeHolder: 'Enter text here...',
    onChange: (html, newContent) => {
      if (!$.isEmptyObject(annotations) && !awaitingContent) {
        console.log(newContent);
        updateAwaitingContent(newContent);
        editor.undo();
        updateShowRemoveAnnotationsModalC(true);
      } else updateContent(newContent);
    },
    onEditorReady: editor => updateEditor(editor) && editor.insertString(content),
    autoFocus: true,
    awaitingContent: awaitingContent
  };
  const [contentRetrived, updateContentRetrieved] = useState(false);
  const [retrievingContent, updateRetrievingContent] = useState(false);
  const [showRemoveAnnotationsModalC, updateShowRemoveAnnotationsModalC] = useState(false);

  // fetch document content
  if (!contentRetrived && !retrievingContent) {
    updateRetrievingContent(true);
    readDocument(documentId,
      content => {
        updateContent(content);
        updateContentRetrieved(true);
      });
  }

  const [timeoutId, updateTimeoutId] = useState(0);
  useEffect(() => {
    if (contentRetrived) {
      clearTimeout(timeoutId);
      updateTimeoutId(setTimeout(() => editDocument(documentId, content), 1000));
    }
  }, [content]);

  useEffect(() => {
    if (!showRemoveAnnotationsModalC) {
      updateAwaitingContent('');
    }
  }, [showRemoveAnnotationsModalC]);
  const removeAnnotationMsg = "Semantically doesn't yet support maintaining annotations on dynamic content. To proceed with edits, all annotations will be removed. This operation is permanent!";

  return (
    <div>
      {contentRetrived ?
        <>
          <TrixEditor {...trixEditorProps} />
          <Highlights {...editorProps} />
        </> : null
      }
      {showRemoveAnnotationsModalC ? <RemoveAnnotationsModal documentId={documentId}
      resetAnnotations={resetAnnotations} 
      updateShowRemoveAnnotationsModal={updateShowRemoveAnnotationsModalC} 
      callback={() => {updateContent(awaitingContent); editor.redo();}}
      removeAnnotationMsg={removeAnnotationMsg} /> : null}
    </div>
  )
};

export default DocumentEditor;
