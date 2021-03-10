import React, {useState, useEffect} from 'react';
import {Accordion, Card, Button, Modal} from 'react-bootstrap';
import $ from 'jquery';

import sortKeys from '../hooks/sortKeys';
import getText from '../hooks/getText';
import getDefinition from '../hooks/getDefinition';

const getTermStr = term => {
  const divider = term.indexOf('-');
  const from = Number(term.substring(0, divider))-1;
  const to = Number(term.substring(divider+1, term.length));
  return getText().substring(from, to);
}



const SidebarAccordion = ({ annotations, updateAnnotations, definitions, updateDefinitions, updateHighlights, loadHighlights, highlights, udpateLoadHighlights }) => {
  const [ontologyModal, updateOntologyModal] = useState('');
  const annotatedTerms = sortKeys(Object.keys(annotations));
  console.log('refresh');

  const setDefinition = url => {
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
  
  useEffect(() => {
    for (const term in annotatedTerms) {
      $(`toggle-${term}`).click(() => setDefinition(annotations[term][0].annotatedClass.links.self));
    }
  });
  
  return (
    <Accordion defaultActiveKey={annotatedTerms[0]} id="sidebar-accordion">
      {annotatedTerms.map(term => {
        const termStr = getTermStr(term);

        return (
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey={term} className={`accordion-toggle toggle-${term} term-toggle`} onClick={() => {}}>
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
                      {'With supporting text below as a natural lead-in to additional content.'}
                    </Card.Text>
                    { annotations[term].length > 1 ? <Button variant="primary" className="w-100" onClick={() => updateOntologyModal(term)}>Other Ontologies</Button> : null }
                  </Card.Body>
                </Card>


            </Accordion.Collapse>
          </Card>
        )
      })}
      
      {ontologyModal ? <OntologyModal term={ontologyModal} updateOntologyModal={updateOntologyModal} annotations={annotations} definitions={definitions} setDefinition={setDefinition} /> : null}
    </Accordion>
  );
}

const OntologyModal = ({term, updateOntologyModal, annotations, definitions, setDefinition }) => {
  const closeModal = () => updateOntologyModal('');
  const getDef = url => {
    if (!(url in definitions)) setDefinition(url);
    return definitions[url] ? definitions[url] : 'loading...';
  }
  
  return (
    <Modal
      show={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onHide={closeModal}>
        <Modal.Title id="contained-modal-title-vcenter">
          {getTermStr(term)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Accordion defaultActiveKey={`${term}-modal-0`} id="sidebar-accordion">
          {annotations[term].slice().splice(1).map((ontology, idx) => 
                                          
                                          
                                          
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey={`${term}-modal-${idx}`} onClick={() => {}} className="d-flex justify-content-between">
              <span>{ontology.acronym}</span>
              <Button variant="outline-primary" size="sm">select</Button>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={`${term}-modal-${idx}`} className={`p-2 p-0 accordion-card`}>
              <Card>
                <Card.Body>
                  <Card.Text>
                    {getDef(ontology.annotatedClass.links.self)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Accordion.Collapse>
          </Card>
                                           )}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeModal}>Close</Button>
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