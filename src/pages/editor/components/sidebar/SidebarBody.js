import React, { useEffect } from 'react';

import SidebarLoader from './SidebarLoader';
import SidebarAccordion from './SidebarAccordion';

const SidebarBody = sidebarProps => {
  const { annotations, updateAnnotationSelection,
    showLoader, showAccordion } = sidebarProps;
    
  // reset annotation selection
  useEffect(() => {
    const selection = {};
    Object.keys(annotations)
      .forEach(term => selection[term] = 0);
    updateAnnotationSelection(selection);
  }, [annotations])

  return (
    <div className="flex-grow-1">
      {showLoader ? <SidebarLoader /> : null}
      {showAccordion ? <SidebarAccordion {...sidebarProps} /> : null}
    </div>
  );
}

export default SidebarBody;
