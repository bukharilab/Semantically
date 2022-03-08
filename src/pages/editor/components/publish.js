import React from 'react';
import { Dropdown } from 'react-bootstrap';

import {saveAsHTML, saveAsJSON} from '../hooks/downloadAnnotations';

const Publish = ({ annotations, annotationSelection, definitions, updateDefinitions, content }) => {
  const downloadHTML = () => saveAsHTML(content, annotations, annotationSelection, definitions, updateDefinitions, false);
  const downloadHTMLHighlight = () => saveAsHTML(content, annotations, annotationSelection, definitions, updateDefinitions, true);
  const downloadJSON = () => saveAsJSON(content, annotations, annotationSelection, definitions, updateDefinitions);

  return (
    <Dropdown id="publish-dropdown" className="dropdown d-flex flex-row-reverse">
      <Dropdown.Toggle variant="outline-dark">
        Publish
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={downloadHTML}>Download as HTML</Dropdown.Item>
        <Dropdown.Item onClick={downloadHTMLHighlight}>Download as HTML (highlighted)</Dropdown.Item>
        <Dropdown.Item onClick={downloadJSON}>Download as JSON</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

  );
}

export default Publish;
