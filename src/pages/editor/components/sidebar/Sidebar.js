import React, { useState } from 'react';
import $ from 'jquery';

import SidebarHeader from './SidebarHeader';
import SidebarBody from './SidebarBody';
import Logo from '../../../../logo.png';

const Sidebar = editorProps => {
  const [showLoader, updateShowLoader] = useState(false);
  const [showAccordion, updateShowAccordion] = useState(false);
  const [loadHighlights, updateLoadHighlights] = useState(false);

  const resetAnnotations = () => {
    editorProps.updateAnnotations({});
    editorProps.updateHighlights({});
    editorProps.setCurrentHighlight('');
    editorProps.updateDefinitions({});
  }

  const sidebarProps = {
    ...editorProps,
    showLoader: showLoader, updateShowLoader: updateShowLoader,
    showAccordion: showAccordion, updateShowAccordion: updateShowAccordion,
    loadHighlights: loadHighlights, updateLoadHighlights: updateLoadHighlights,
    resetAnnotations: resetAnnotations
  }

  return (
    <div id="sidebar-container">
      <div id="sidebar">
        <SidebarHeader {...sidebarProps} />
        <SidebarBody {...sidebarProps} />
      </div>
      <div id="sidebar-logo" className="text-center">
        <img alt="Add-on logo" className="d-inline-block" src={Logo} width="60%" />
      </div>
    </div>
  );
}

export default Sidebar;
