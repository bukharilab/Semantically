import React, {useState, useEffect} from 'react';
import {Accordion, Card, Button, Modal} from 'react-bootstrap';
import $ from 'jquery';

import sortKeys from '../hooks/sortKeys';
import getText from '../hooks/getText';
import getTermStr from '../hooks/getTermString';
import getDefinition from '../hooks/getDefinition';
import getRemovedHighlights from '../hooks/getRemovedHighlights';



const setGetDefinitionListeners = (annotations, setDefinition) => {
  for (const annotation of Object.values(annotations)) {
    for (const {from, to, acronym, annotatedClass} of annotation) {
      const toggle = `${from}-${to}-${acronym}`;
      const url = annotatedClass.links.self;
      console.log(toggle);
      $(`.${toggle}`).click(() => {setDefinition(url); console.log(toggle);});
    }
  }
}

const removeHighlight = (currentHighlight, setCurrentHighlight, highlights, updateHighlights) => {
  delete highlights[currentHighlight];
  updateHighlights({...highlights});
  setCurrentHighlight('');
}

// show in NCBOTree
const showInTree = text => {
  while (document.querySelector('#tree > .root > span') !== null) setTimeout(() => {}, 100);
  const listItem = [...document.querySelectorAll('#tree li')].filter(li => li.innerText.toLowerCase() === text.toLowerCase());
  if (listItem.length > 0) listItem[0].scrollIntoView();
  console.log(listItem);
}

const SidebarAccordion = ({ annotations, updateAnnotations, definitions, updateDefinitions,
  updateHighlights, loadHighlights, highlights, updateLoadHighlights, currentHighlight,
  setCurrentHighlight, annotationSelection, updateAnnotationSelection }) => {

  const [openOntologyModal, updateOpenOntologyModal] = useState(false);
  const [setDefinitionListeners, updateSetDefinitionListeners] = useState(false);
  const [ontologyIdx, updateOntologyIdx] = useState(0);
  // console.log(currentHighlight)
  const annotatedTerms = sortKeys(Object.keys(annotations));
  const removedHighlights = getRemovedHighlights(annotationSelection);
//   console.log(annotations);
  console.log('refresh');

  const setDefinition = url => {
    if (!(url in definitions)) {
      getDefinition(url).then(def => updateDefinitions({...definitions, [url]: def}));
      return 'Loading...';
    } else {
      return definitions[url];
    }
  }

  if (!setDefinitionListeners) {
    console.log("here");
    setGetDefinitionListeners(annotations, setDefinition);
    updateSetDefinitionListeners(true);
  }

  if (loadHighlights) {
    const newHighlights = {};
    for (const term of annotatedTerms) {
      newHighlights[term] = -1;
    }
    updateHighlights(newHighlights);
    updateLoadHighlights(false);
  }

//   useEffect(() => {
//     for (const term in annotatedTerms) {
//       $(`toggle-${term}`).click(() => setDefinition(annotations[term][0].annotatedClass.links.self));
//     }
//   });

  // Switch annotations
  useEffect(() => {
    updateOntologyIdx(0);
  }, [currentHighlight]);

  // Switch annotations or change ontology
  useEffect(() => {
    // if (currentHighlight) {
    //   const tree = $("#tree")[0].NCBOTree;
    //   const ontology = annotations[currentHighlight][ontologyIdx];
    //   console.log(ontology.annotatedClass['@id']);
    //   showInTree(annotations[currentHighlight][ontologyIdx].text);
    //   tree.jumpToClass(ontology.annotatedClass['@id']);
      // change NCBO tree

  }, [currentHighlight, ontologyIdx]);

  if (!currentHighlight) return null;

  return (
    <React.Fragment>
    {removedHighlights.includes(currentHighlight) ?
      <Card className="p-4 text-center"><Button variant="outline-success" size="sm" style={{width: 'fit-content'}} className="mx-auto"
        onClick={() => updateAnnotationSelection({...annotationSelection, [currentHighlight]: 0})}>reannotate</Button></Card> :
      <Card>
        <Card.Header className="d-flex justify-content-between">
          <span>{annotations[currentHighlight][annotationSelection[currentHighlight]].acronym}</span>
          <div>
            { annotations[currentHighlight].length > 1 ?
              <Button variant="outline-info" size="sm" onClick={() => updateOpenOntologyModal(true)}>change</Button> : null }{' '}
            <Button variant="outline-danger" size="sm" onClick={() => updateAnnotationSelection({...annotationSelection, [currentHighlight]: -1})}>{'delete'}</Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            {setDefinition(annotations[currentHighlight][annotationSelection[currentHighlight]].annotatedClass.links.self)}
          </Card.Text>
        </Card.Body>
        {openOntologyModal ? <OntologyModal term={currentHighlight} updateOpenOntologyModal={updateOpenOntologyModal} annotations={annotations} definitions={definitions} setDefinition={setDefinition} annotationSelection={annotationSelection} updateAnnotationSelection={updateAnnotationSelection} /> : null}
      </Card>
    }
    </React.Fragment>
  );
}

const OntologyModal = ({term, updateOpenOntologyModal, annotations, definitions, setDefinition, ontologyIdx, annotationSelection, updateAnnotationSelection }) => {
  const closeModal = () => updateOpenOntologyModal(false);
  const getDef = url => {
    return definitions[url] ? definitions[url] : 'loading...';
  }

  useEffect(() => {
    for (const ontology of annotations[term]) {
      $(`.modal-toggle-${ontology.acronym}`).click(() => setDefinition(ontology.annotatedClass.links.self));
    }
  });

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
          {annotations[term].map((ontology, idx) =>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey={`${term}-modal-${idx}`} className={`d-flex justify-content-between ${ontology.from}-${ontology.to}-${ontology.acronym} modal-toggle-${ontology.acronym}`}>
              <span>{ontology.acronym}</span>
              {ontologyIdx != idx ?
                <Button variant="outline-primary" size="sm" onClick={() => {
                    updateAnnotationSelection({...annotationSelection, [term]: idx});
                    updateOpenOntologyModal(false);
                }}>select</Button>
                : null}
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
