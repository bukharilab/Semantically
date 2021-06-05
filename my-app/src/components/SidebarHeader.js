import React, {useState} from 'react';

import {Button, Dropdown, ButtonGroup } from 'react-bootstrap';

import getRecommenderAnnotations from '../hooks/getRecommenderAnnotations';
import getText from '../hooks/getText';
import ManualAnnotationPopUp from './ManualOntologySelector';
import loadScript from '../hooks/loadScript';

const SidebarHeader = ({ updateShowLoader, updateShowAccordion, updateAnnotations }) => {
  const [showManualAnnotation, updateShowManualAnnotation] = useState(false);
  const [manualAcronyms, updateManualAcronyms] = useState([]);

  const showAnnotations = () => {
    updateShowLoader(true);
    getRecommenderAnnotations(getText(), (formattedAnnotations) => {
      updateAnnotations(formattedAnnotations);
      updateShowAccordion(true);
      updateShowLoader(false);
    }, );
  }

  return (
    <React.Fragment>
      <div id="sidebar-header" className="pt-1">
        <Dropdown as={ButtonGroup}>
          <Button variant="outline-dark" onClick={showAnnotations}>Annotate</Button>
          <Dropdown.Toggle split variant="outline-dark" id="dropdown-split-basic" />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => updateShowManualAnnotation(true)}>Manual</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>{'  '}
        <Button variant="outline-dark">Remove annotations</Button>
      </div>
      {showManualAnnotation ? <ManualAnnotationPopUp updateManualAcronyms={updateManualAcronyms} manualAcronyms={manualAcronyms}/> : null}
    </React.Fragment>
  );
}

export default SidebarHeader;
