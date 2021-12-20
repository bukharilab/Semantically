import 'trix/dist/trix';
import 'trix/dist/trix.css';

import React, {useEffect, useState} from 'react';
import $ from 'jquery';
import { TrixEditor } from "react-trix";

import Highlights from './Highlights';
import {readDocument, editDocument} from '../../hooks/editor/documentAPI';

const DocumentEditor = editorProps => {
  const {documentId, content, updateContent, editor, updateEditor} = editorProps;
  const trixEditorProps = {
    value: content,
    placeHolder: 'Enter text here...',
    onChange: (html, content) => updateContent(content),
    onEditorReady: editor => updateEditor(editor) && editor.insertString(content),
    autoFocus: true
  };
  const [contentRetrived, updateContentRetrieved] = useState(false);

  // fetch document content
  if (!contentRetrived) {
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

  return (
    <div>
      {contentRetrived ?
        <>
          <TrixEditor {...trixEditorProps} />
          <Highlights {...editorProps} />
        </> : null
      }
    </div>
  )
};

export default DocumentEditor;
