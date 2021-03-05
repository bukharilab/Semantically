import React, {useState} from 'react';
import {Accordion, Card, Button, Modal} from 'react-bootstrap';

import sortKeys from '../hooks/sortKeys';
import getText from '../hooks/getText';
import getDefinition from '../hooks/getDefinition';

const SidebarAccordion = ({ annotations, updateAnnotations, definitions, updateDefinitions, updateHighlights, loadHighlights, highlights, udpateLoadHighlights }) => {
  const [ontologyModal, updateOntologyModal] = useState('');
  const annotatedTerms = sortKeys(Object.keys(annotations));
  
  const getTermStr = term => {
    const divider = term.indexOf('-');
    const from = Number(term.substring(0, divider))-1;
    const to = Number(term.substring(divider+1, term.length));
    return getText().substring(from, to);
  }
  
  const setDefinition = url => {
    console.log(url);
    return !(url in definitions) ? getDefinition(url).then(def => updateDefinitions({...definitions, [url]: def})) : null;
  }
  
  if (loadHighlights) {
    const newHighlights = {};
    for (const term of annotatedTerms) {
      newHighlights[term] = -1;
    }
    updateHighlights(newHighlights);
    udpateLoadHighlights(false);
  }
  
  return (
    <Accordion defaultActiveKey={annotatedTerms[0]} id="sidebar-accordion">
      {annotatedTerms.map(term => {
        const termStr = getTermStr(term);

        return (
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey={term} className={`accordion-toggle toggle-${term} term-toggle`} onClick={setDefinition(annotations[term][0].annotatedClass.links.self)}>
              {termStr}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={term} className={`p-2 p-0 accordion-card`}>

                <Card>
                  <Card.Header className="d-flex justify-content-between">
                    <span>{annotations[term][0].acronym}</span>
                    <div>
                      <Button variant="outline-info" size="sm">edit</Button>{' '}
                      <Button variant="outline-danger" size="sm">delete</Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>
                      With supporting text below as a natural lead-in to additional content.
                    </Card.Text>
                    { annotations[term].length > 1 ? <Button variant="primary" className="w-100" onClick={() => updateOntologyModal(term)}>Other Ontologies</Button> : null }
                  </Card.Body>
                </Card>


            </Accordion.Collapse>
          </Card>
        )
      })}
      
      {ontologyModal ? <OntologyModal term={ontologyModal} annotations={annotations} definitions={definitions} setDefinition={setDefinition} /> : null}
    </Accordion>
  );
}

const OntologyModal = ({term, updateOntologyModal, annotations, definitions, setDefinitions }) => {
  
  return (
    <Modal
      show={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => updateOntologyModal('')}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SidebarAccordion;

//                 {
//                   annotations[term].map(({acronym, annotatedClass}, key) => {
//                   const url = annotatedClass.links.self;
//                   return (
//                     <Card>
//                       <Accordion.Toggle as={Card.Header} eventKey={`${term}-${key}`} className="accordion-toggle d-flex justify-content-between" onClick={() => 
//                         !(url in definitions) ? getDefinition(url).then(def => updateDefinitions({...definitions, [url]: def})) : null
//                       }>
//                         <span>{termStr + " [ " + acronym + " ]"}</span>
//                         {
//                           highlights[term] === key ? <span>selected</span> : <Button variant="outline-dark" size="sm" onClick={() => updateHighlights({...highlights, [term]: key})}>select</Button>
//                         }
//                       </Accordion.Toggle>
//                       <Accordion.Collapse eventKey={`${term}-${key}`}>
//                         <Card.Body>
//                           { url in definitions ? definitions[url].substring(0, definitions[url].indexOf('.')+1) : 'Loading...' }
//                         </Card.Body>
//                       </Accordion.Collapse>
//                     </Card>
//                   )
//                 })}