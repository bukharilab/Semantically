import 'trix/dist/trix';
import 'trix/dist/trix.css';

import React, {useEffect, useState} from 'react';
import $ from 'jquery';
import { TrixEditor } from "react-trix";

import Highlights from './Highlights';

const DocumentEditor = editorProps => {
  const {content, updateContent, updateEditor} = editorProps;

  const trixEditorProps = {
    value: content,
    placeHolder: 'Enter text here...',
    onChange: (html, content) => updateContent(content),
    onEditorReady: editor => updateEditor(editor),
    autoFocus: true
  };

  return (
    <div>
      <TrixEditor {...trixEditorProps} />
      <Highlights {...editorProps} />
    </div>
  )
};

export default DocumentEditor;
