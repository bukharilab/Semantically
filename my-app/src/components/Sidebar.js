import React, { useState } from 'react';

import SidebarHeader from './SidebarHeader';
import SidebarBody from './SidebarBody';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ highlights, updateHighlights, currentHighlight, setCurrentHighlight, removedHighlights, updateRemovedHighlights }) => {
  const [showLoader, updateShowLoader] = useState(false);
  const [showAccordion, updateShowAccordion] = useState(false);
  const [annotations, updateAnnotations] = useState({});
  const [definitions, updateDefinitions] = useState({});
  const [loadHighlights, updateLoadHighlights] = useState(false);

  const resetAnnotations = () => {
    updateAnnotations({});
    updateHighlights({});
    setCurrentHighlight('');
    updateDefinitions({});
  }

  return (
    <div id="sidebar">
      <SidebarHeader updateShowLoader={updateShowLoader} updateShowAccordion={updateShowAccordion}
        updateAnnotations={updateAnnotations} resetAnnotations={resetAnnotations} updateLoadHighlights={updateLoadHighlights} />
      <SidebarBody showLoader={showLoader} showAccordion={showAccordion} annotations={annotations}
        updateAnnotations={updateAnnotations} definitions={definitions} updateDefinitions={updateDefinitions}
        highlights={highlights} updateHighlights={updateHighlights} loadHighlights={loadHighlights}
        updateLoadHighlights={updateLoadHighlights} currentHighlight={currentHighlight}
        setCurrentHighlight={setCurrentHighlight} removedHighlights={removedHighlights}
        updateRemovedHighlights={updateRemovedHighlights} />
      <SidebarFooter />
    </div>
  );
}

export default Sidebar;
