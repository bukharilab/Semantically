import React, {useState, useEffect} from 'react';
import $ from 'jquery';

import {Button, Dropdown, DropdownButton, Card, Form, Row, Col } from 'react-bootstrap';

import getRecommenderAnnotations from '../hooks/getRecommenderAnnotations';
import getText from '../hooks/getText';
import ManualAnnotationPopUp from './ManualOntologySelector';

const SidebarHeader = ({ updateShowLoader, updateShowAccordion, updateAnnotations, resetAnnotations, updateLoadHighlights }) => {
  const [showManualAnnotation, updateShowManualAnnotation] = useState(false);
  const [manualOntologies, updateManualOntologies] = useState({});

  const showAnnotations = () => {
    updateShowLoader(true);
    resetAnnotations();
    getRecommenderAnnotations(getText(), showManualAnnotation ? Object.keys(manualOntologies) : undefined,
      (formattedAnnotations) => {
        updateAnnotations(formattedAnnotations);
        updateShowAccordion(true);
        updateShowLoader(false);
        updateLoadHighlights(true);
      }
    );
  }

  // all ontologies selected by default
  useEffect(() => {
    $('#all-ontologies').attr('checked', true);
  });

  return (
    <React.Fragment>
      <div id="sidebar-header" className="pt-1">
        <Button variant="outline-dark" onClick={showAnnotations}>Annotate</Button>{'  '}
        <Button variant="outline-dark">Remove annotations</Button>
      </div>
      <Card className="my-2">
        <Card.Body className="d-flex flex-direction-column justify-content-between pb-1">
          <Card.Title>Choose ontologies:</Card.Title>
          <Form.Group as={Row}>
            <Col sm={10} className="text-left">
              <Form.Check onClick={() => updateShowManualAnnotation(false)}
                type="radio"
                label="All"
                name="formHorizontalRadios"
                id="all-ontologies"
              />
              <Form.Check onClick={() => updateShowManualAnnotation(true)}
                type="radio"
                label="Select"
                name="formHorizontalRadios"
                id="select-ontologies"
              />
            </Col>
          </Form.Group>
        </Card.Body>
      </Card>
      {showManualAnnotation ? <ManualAnnotationPopUp manualOntologies={manualOntologies} updateManualOntologies={updateManualOntologies} /> : null}
    </React.Fragment>
  );
}

export default SidebarHeader;
