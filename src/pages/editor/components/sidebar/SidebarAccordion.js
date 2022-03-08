import React, {useState, useEffect} from 'react';
import {Accordion, Card, Button, Modal} from 'react-bootstrap';
import $ from 'jquery';

import sortKeys from '../../hooks/sidebar/sortKeys';
import getTermStr from '../../hooks/sidebar/getTermString';
import getDefinition from '../../hooks/sidebar/getDefinition';
import getRemovedHighlights from '../../hooks/editor/getRemovedHighlights';

import LookUp from '../LookUp';
import AskQuestion from '../AskQuestion';

const setGetDefinitionListeners = (annotations, setDefinition) => {
  for (const annotation of Object.values(annotations)) {
    for (const {from, to, acronym, link} of annotation) {
      const toggle = `${from}-${to}-${acronym}`;
      console.log(toggle);
      $(`.${toggle}`).click(() => {setDefinition(link); console.log(toggle);});
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
  setCurrentHighlight, annotationSelection, updateAnnotationSelection, content }) => {

  const [openOntologyModal, updateOpenOntologyModal] = useState(false);
  const [openLookUpModal, updateOpenLookUpModal] = useState(false);
  const [openPostModal, updateOpenPostModal] = useState(false);


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
//       $(`toggle-${term}`).click(() => setDefinition(annotations[term][0].annotatedClass.link));
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
    //   console.log(ontology['id']);
    //   showInTree(annotations[currentHighlight][ontologyIdx].text);
    //   tree.jumpToClass(ontology['id']);
      // change NCBO tree

  }, [currentHighlight, ontologyIdx]);

  if (!currentHighlight) return null;

  return (
    <React.Fragment>
    {removedHighlights.includes(currentHighlight) ?
      <Card className="p-4 text-center"><Button variant="outline-success" size="sm" style={{width: 'fit-content'}} className="mx-auto"
        onClick={() => updateAnnotationSelection({...annotationSelection, [currentHighlight]: 0})}>reannotate</Button></Card> :
      <div><Card>
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
            {setDefinition(annotations[currentHighlight][annotationSelection[currentHighlight]].link)}
          </Card.Text>
        </Card.Body>
        {openOntologyModal ? <OntologyModal term={currentHighlight} updateOpenOntologyModal={updateOpenOntologyModal} annotations={annotations} definitions={definitions} setDefinition={setDefinition} annotationSelection={annotationSelection} updateAnnotationSelection={updateAnnotationSelection} content={content} /> : null}
        {openLookUpModal ? <LookUp word={getTermStr(currentHighlight, content)} ontology={annotations[currentHighlight][annotationSelection[currentHighlight]]} updateOpenPostModal={updateOpenPostModal} updateOpenLookUpModal={updateOpenLookUpModal}/> : null}
        {openPostModal ? <AskQuestion word={getTermStr(currentHighlight, content)} ontology={annotations[currentHighlight][annotationSelection[currentHighlight]]} updateOpenPostModal={updateOpenPostModal} updateOpenLookUpModal={updateOpenLookUpModal} currentHighlight={currentHighlight} annotationSelection={annotationSelection} annotations={annotations} /> : null}
      </Card>
      <div className="text-right"><Button variant="link" style={{'box-shadow': 'none'}} onClick={() => updateOpenLookUpModal(true)}>Need Help?</Button></div></div>
    }
    </React.Fragment>
  );
}

const OntologyModal = ({term, updateOpenOntologyModal, annotations, definitions, setDefinition, ontologyIdx, annotationSelection, updateAnnotationSelection, content }) => {
  const closeModal = () => updateOpenOntologyModal(false);
  const getDef = url => {
    return definitions[url] ? definitions[url] : 'loading...';
  }

  useEffect(() => {
    for (const ontology of annotations[term]) {
      $(`.modal-toggle-${ontology.acronym}`).click(() => setDefinition(ontology.link));
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
          {getTermStr(term, content)}
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
                    {getDef(ontology.link)}
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
