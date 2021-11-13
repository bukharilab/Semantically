import 'trix/dist/trix';
import 'trix/dist/trix.css';

import React, {useEffect, useState} from 'react';
import $ from 'jquery';
import { TrixEditor } from "react-trix";

import Highlights from './Highlights';

const DocumentEditor = ({ highlights, currentHighlight, setCurrentHighlight, annotationSelection, content, updateContent, editor, updateEditor }) => {


  const trixEditorProps = {
    value: content,
    placeHolder: 'Enter text here...',
    onChange: (html, content) => updateContent(content),
    onEditorReady: editor => updateEditor(editor),
    autoFocus: true
  };

  // useEffect(() => updateEditor(document.querySelector("trix-editor").editor), []);
  return (
    <div>
      <TrixEditor {...trixEditorProps} />
      <Highlights highlights={highlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight}
       annotationSelection={annotationSelection} editor={editor} />
    </div>
  )
};

export default DocumentEditor;
