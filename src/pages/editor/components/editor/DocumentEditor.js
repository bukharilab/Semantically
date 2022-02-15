import 'trix/dist/trix';
import 'trix/dist/trix.css';

import React, {useEffect, useState} from 'react';
import $ from 'jquery';
import { TrixEditor } from "react-trix";
import RemoveAnnotationsModal from '../sidebar/RemoveAnnotationsModal';

import Highlights from './Highlights';
import {readDocument, editDocument} from '../../hooks/editor/documentAPI';
import {
  Card,
  Button,
  Modal,
  Form,
  Col,
  Row,
  Container,
} from "react-bootstrap";

const DocumentEditor = editorProps => {
  const {documentId, content, updateContent, editor, updateEditor, annotations, resetAnnotations} = editorProps;

  console.log("trix word",content.split(' ').length);
//   else if(newContent.split(' ').length > 10){
//     console.log("greter than 10 size");
// }
  const [awaitingContent, updateAwaitingContent] = useState("");
  const trixEditorProps = {
    value: content,
    placeHolder: 'Enter text here...',
    onChange: (html, newContent) => {
      if (!$.isEmptyObject(annotations) && !awaitingContent) {
        console.log("new content",newContent);
        updateAwaitingContent(newContent);
        editor.undo();
        updateShowRemoveAnnotationsModalC(true);
      } 
      else updateContent(newContent);
    },
    onEditorReady: editor => updateEditor(editor) && editor.insertString(content),
    autoFocus: true,
    awaitingContent: awaitingContent
  };
  const [contentRetrived, updateContentRetrieved] = useState(false);
  const [retrievingContent, updateRetrievingContent] = useState(false);
  const [showRemoveAnnotationsModalC, updateShowRemoveAnnotationsModalC] = useState(false);
  const [contentSize, updateContentSize] = useState(false);

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
    if(content.split(' ').length < 100){
    if (contentRetrived) {
      clearTimeout(timeoutId);
      updateTimeoutId(setTimeout(() => editDocument(documentId, content), 1000));
    }}
    else{
      console.log("content length is",content.split(' ').length);
      updateContentSize(true);
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
      {contentSize ? (<CheckContentSize updateContentSize={updateContentSize}/>) : null }
    </div>
  )
}

function CheckContentSize({updateContentSize}){
  const closeModal = () => updateContentSize(false);
  return (
    <>
    <Modal
          show={true}
          onHide={closeModal}
          backdrop="static"
          keyboard={false}
        >
        <Modal.Header closeButton>
        <Modal.Title>Content Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Content Word Size must be less than 100
        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={closeModal}>OK</Button>
        </Modal.Footer>
    </Modal>
    </>

  )
}


export default DocumentEditor;
