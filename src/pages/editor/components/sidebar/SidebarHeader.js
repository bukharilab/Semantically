import React, {useState, useEffect} from 'react';
import $ from 'jquery';

import {Button, Card, Form, Col, Row } from 'react-bootstrap';

import getRecommenderAnnotations from '../../hooks/sidebar/getRecommenderAnnotations';
import ManualAnnotationPopUp from './ManualOntologySelector';
import RemoveAnnotationsModal from './RemoveAnnotationsModal';

const SidebarHeader = sidebarProps => {
  const [showManualAnnotation, updateShowManualAnnotation] = useState(false);
  const [showRemoveAnnotationsModalA, updateShowRemoveAnnotationsModalA] = useState(false);
  const [showRemoveAnnotationsModalB, updateShowRemoveAnnotationsModalB] = useState(false);
  const [manualOntologies, updateManualOntologies] = useState({});

  const {
    updateShowLoader,
    updateShowAccordion,
    annotations,
    updateAnnotations,
    updateLoadHighlights,
    resetAnnotations,
    content } = sidebarProps;

  const showAnnotations = () => {
    updateShowLoader(true);
    resetAnnotations();
    getRecommenderAnnotations(content, showManualAnnotation ? Object.keys(manualOntologies) : undefined,
      (formattedAnnotations) => {
        updateAnnotations(formattedAnnotations);
        console.log(formattedAnnotations);
        updateShowAccordion(true);
        updateShowLoader(false);
        updateLoadHighlights(true);
      }
    );
  }

  const annotate = () => {
    if ($.isEmptyObject(annotations)) showAnnotations();
    else updateShowRemoveAnnotationsModalA(true);
  }

  const removeAnnotations = () => {
    if (!$.isEmptyObject(annotations)) updateShowRemoveAnnotationsModalB(true);
  }

  // all ontologies selected by default
  useEffect(() => {
    $('#all-ontologies').attr('checked', true);
  });

  const removeAnnotationMsg = "Are you sure? This operation is permanent!";

  return (
    <React.Fragment>
      <div id="sidebar-header" className="pt-1">
        <Button variant="outline-dark" onClick={annotate}>Annotate</Button>{'  '}
        <Button variant="outline-dark" onClick={removeAnnotations}>Remove annotations</Button>
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
      {showRemoveAnnotationsModalA ? <RemoveAnnotationsModal resetAnnotations={resetAnnotations} updateShowRemoveAnnotationsModal={updateShowRemoveAnnotationsModalA} callback={showAnnotations} removeAnnotationMsg={removeAnnotationMsg} /> : null}
      {showRemoveAnnotationsModalB ? <RemoveAnnotationsModal resetAnnotations={resetAnnotations} updateShowRemoveAnnotationsModal={updateShowRemoveAnnotationsModalB} callback={() => {}} removeAnnotationMsg={removeAnnotationMsg} /> : null}
    </React.Fragment>
  );
}

export default SidebarHeader;
