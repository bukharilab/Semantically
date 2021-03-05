import React, { useState } from 'react';

import SidebarHeader from './SidebarHeader';
import SidebarBody from './SidebarBody';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ highlights, updateHighlights }) => {
  const [showLoader, updateShowLoader] = useState(false);
  const [showAccordion, updateShowAccordion] = useState(false);
  const [annotations, updateAnnotations] = useState({});
  const [definitions, updateDefinitions] = useState({});

  return (
    <div id="sidebar">
      <SidebarHeader updateShowLoader={updateShowLoader} updateShowAccordion={updateShowAccordion} updateAnnotations={updateAnnotations} />
      <SidebarBody showLoader={showLoader} showAccordion={showAccordion} annotations={annotations} updateAnnotations={updateAnnotations} definitions={definitions} updateDefinitions={updateDefinitions} highlights={highlights} updateHighlights={updateHighlights} />
      <SidebarFooter />
    </div>
  );
}

export default Sidebar;
