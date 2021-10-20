import React from 'react';
import Sidebar from '../components/Sidebar';
import Highlights from '../components/Highlights';

const DocumentEditor = ({highlights, updateHighlights, currentHighlight, setCurrentHighlight, removedHighlights, updateRemovedHighlights, annotationSelection, updateAnnotationSelection}) => {
  return (
    <>
    <Sidebar highlights={highlights} updateHighlights={updateHighlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight}
      removedHighlights={removedHighlights} updateRemovedHighlights={updateRemovedHighlights} annotationSelection={annotationSelection} updateAnnotationSelection ={updateAnnotationSelection} />
    <Highlights highlights={highlights} currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight}
      removedHighlights={removedHighlights} annotationSelection={annotationSelection} />
    </>
  )
}

export default DocumentEditor;
