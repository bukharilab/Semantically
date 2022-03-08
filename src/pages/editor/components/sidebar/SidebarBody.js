import React, { useEffect } from 'react';
import $ from 'jquery';

import SidebarLoader from './SidebarLoader';
import SidebarAccordion from './SidebarAccordion';

const SidebarBody = sidebarProps => {
  const { annotations, updateAnnotationSelection, showLoader, showAccordion, 
    saveAnnotations, annotationSelection, annotationsLoaded,  updateAnnotationsLoaded} = sidebarProps;
    
  // reset annotation selection
  useEffect(() => {
    if (!annotationsLoaded) {
      const selection = {};
      Object.keys(annotations)
        .forEach(term => selection[term] = 0);
      updateAnnotationSelection(selection);
      console.log('here now');
      console.log(annotations);
      saveAnnotations(annotations);
      updateAnnotationsLoaded(false);
    }
  }, [annotations]);

  return (
    <div className="flex-grow-1">
      {showLoader ? <SidebarLoader /> : null}
      {showAccordion ? <SidebarAccordion {...sidebarProps} /> : null}
    </div>
  );
}

export default SidebarBody;
