import React, { useState } from 'react';

const Editor = ({documentId}) => {
  const [content, updateContent] = useState('');
  const editor = document.querySelector("trix-editor").editor;

};

export default Editor;
