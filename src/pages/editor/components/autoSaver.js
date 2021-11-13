import React, { useState, useEffect } from 'react';
import { editDocument } from '../hooks/documentAPIs';

const AutoSavor = ({ editor, documentId }) => {
  const [timerId, updateTimerId] => useState('');

  useEffect(() => {
    // set content change listener
    new MutationObserver(() => {
      const content = editor.innerText;
      clearTimeout(timerId);
      updateTimerId(
        setTimeout(() => editDocument(documentId, content), 1000));
    }).observe(editor, {characterData: true, subtree: true});
  }, []);

  return null;
}

export default AutoSavor;
