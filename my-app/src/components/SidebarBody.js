import SidebarLoader from './SidebarLoader';
import SidebarAccordion from './SidebarAccordion';

import React, { useState } from 'react';

const SidebarBody = ({ showLoader, showAccordion, annotations, updateAnnotations,
  definitions, highlights, updateHighlights, updateDefinitions, currentHighlight,
  setCurrentHighlight, loadHighlights, updateLoadHighlights, removedHighlights,
  updateRemovedHighlights }) => {

  return (
    <div className="flex-grow-1">
      {showLoader ? <SidebarLoader /> : null}
      {showAccordion ? <SidebarAccordion annotations={annotations} updateAnnotations={updateAnnotations}
      definitions={definitions} updateDefinitions={updateDefinitions} updateHighlights={updateHighlights}
      loadHighlights={loadHighlights} highlights={highlights} updateLoadHighlights={updateLoadHighlights}
      currentHighlight={currentHighlight} setCurrentHighlight={setCurrentHighlight}
      removedHighlights={removedHighlights} updateRemovedHighlights={updateRemovedHighlights} /> : null}
    </div>
  );
}

export default SidebarBody;
