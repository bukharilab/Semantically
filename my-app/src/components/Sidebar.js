import React, { useState } from 'react';

import SidebarHeader from './SidebarHeader';
import SidebarBody from './SidebarBody';
import SidebarFooter from './SidebarFooter';

const Sidebar = () => {
  const [showLoader, updateShowLoader] = useState(false);
  const [showAccordion, updateShowAccordion] = useState(false);
  const [annotations, updateAnnotations] = useState({});

  return (
    <div id="sidebar">
      <SidebarHeader updateShowLoader={updateShowLoader} updateShowAccordion={updateShowAccordion} updateAnnotations={updateAnnotations} />
      <SidebarBody showLoader={showLoader} showAccordion={showAccordion} annotations={annotations} updateAnnotations={updateAnnotations} />
      <SidebarFooter />
    </div>
  );
}

export default Sidebar;
