import React, { useState, useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import {
  Accordion,
  Card,
  Button,
  Modal,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import $ from "jquery";
import Personalize from "../Personalize"
import sortKeys from "../../hooks/sidebar/sortKeys";
import getTermStr from "../../hooks/sidebar/getTermString";
import getDefinition from "../../hooks/sidebar/getDefinition";
import getRemovedHighlights from "../../hooks/editor/getRemovedHighlights";
import { checkRecommendation } from "../../hooks/editor/documentAPI";
import { apiAddresses } from "../../../../appInfo";
import LookUp from "../LookUp";
import AskQuestion from "../AskQuestion";
import PopupRecommendation from "../PopupRecommendation";
const setGetDefinitionListeners = (annotations, setDefinition) => {
  for (const annotation of Object.values(annotations)) {
    for (const { from, to, acronym, link } of annotation) {
      const toggle = `${from}-${to}-${acronym}`;
      console.log("toogle-1",toggle, link);
      $(`.${toggle}`).click(() => {
        setDefinition(link);
        console.log("toggle-2",toggle);
      });
    }
  }
};

const removeHighlight = (
  currentHighlight,
  setCurrentHighlight,
  highlights,
  updateHighlights
) => {
  delete highlights[currentHighlight];
  updateHighlights({ ...highlights });
  setCurrentHighlight("");
};

// show in NCBOTree
const showInTree = (text) => {
  while (document.querySelector("#tree > .root > span") !== null)
    setTimeout(() => {}, 100);
  const listItem = [...document.querySelectorAll("#tree li")].filter(
    (li) => li.innerText.toLowerCase() === text.toLowerCase()
  );
  if (listItem.length > 0) listItem[0].scrollIntoView();
  console.log(listItem);
};

const SidebarAccordion = ({
  annotations,
  updateAnnotations,
  definitions,
  updateDefinitions,
  updateHighlights,
  loadHighlights,
  highlights,
  updateLoadHighlights,
  currentHighlight,
  setCurrentHighlight,
  annotationSelection,
  updateAnnotationSelection,
  content,
  editor
}) => {
  const [openOntologyModal, updateOpenOntologyModal] = useState(false);
  const [openLookUpModal, updateOpenLookUpModal] = useState(false);
  const [openPostModal, updateOpenPostModal] = useState(false);
  
  const [setDefinitionListeners, updateSetDefinitionListeners] =
    useState(false);
  const [ontologyIdx, updateOntologyIdx] = useState(0);
  // console.log(currentHighlight)
  const annotatedTerms = sortKeys(Object.keys(annotations));
  const removedHighlights = getRemovedHighlights(annotationSelection);
  //   console.log(annotations);
  console.log("refresh is",currentHighlight);

  const [menu, setMenu] = useState(false);
  const [personalize, updatePersonalize] = useState(false);
  const [expert, updateShowExpert] = useState(["20"])
  const [showExpert, updateExpert] = useState(false)
  const [ID, updateID] = useState(23)
  //Displays Menu for choosing type of post
  ////Sebastian Chalarca
  //----------------------------------------------------------------//
  const openAskQuestionModal = () => {
    updateOpenPostModal(!openPostModal)
    updateExpert(false)
  }
  
  //Get Current user's ID for calculating personalized recommendations.
    $.post({
       url: apiAddresses.getUser_ID,
       success: (data) => {
          console.log(data["data"][0]['user_id'])
          updateID(data["data"][0]['user_id'])
          
          
       }
       
       
          
         
      });
    
  const openPersonalizeModal = () => {
   
   updatePersonalize(!personalize)
  }
  
  
  const ShowMenu = () => {
    
    
    return(
     <div>
        <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Select post type
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick = {openAskQuestionModal}> Social Technical </Dropdown.Item>
        <Dropdown.Item onClick = {openPersonalizeModal}> Personalized Recommendation </Dropdown.Item>
        
      </Dropdown.Menu>
    </Dropdown>
     </div>
    )
  }
  
  //---------------------------------------------------------------//
  const setDefinition = (url) => {
    if (!(url in definitions)) {
      getDefinition(url).then((def) =>
        updateDefinitions({ ...definitions, [url]: def })
      );
      return "Loading...";
    } else {
      return definitions[url];
    }
  };

  if (!setDefinitionListeners) {
    console.log("here setdef");
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

  // Switch annotations
  useEffect(() => {
    updateOntologyIdx(0);
  }, [currentHighlight]);

  // Switch annotations or change ontology
  useEffect(() => {
    // change NCBO tree
  }, [currentHighlight, ontologyIdx]);

  ///////Asim
  //// Asim
  const [timeoutId, updateTimeoutId] = useState(0);
  const [reply, setReply] = useState([]);
  const [check, setCheck] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  //const[word, setWord] = useState("");

  useEffect(() => {
    updateOntologyIdx(0);
    if (currentHighlight) {
      setCheck([]);
      let current_word = getTermStr(currentHighlight, content);
      clearTimeout(timeoutId);
      updateTimeoutId(
        setTimeout(() => checkRecommendation(current_word, setCheck), 1000)
      );
    }
  }, [currentHighlight]);

  const fetch_reply = () => {
    setReply(check);
    updateOpenLookUpModal(true);
  };

  if (!currentHighlight) return null;
  return (
    <React.Fragment>
      {removedHighlights.includes(currentHighlight) ? (
        <Card className="p-4 text-center">
          <Button
            variant="outline-success"
            size="sm"
            style={{ width: "fit-content" }}
            className="mx-auto"
            onClick={() =>
              updateAnnotationSelection({
                ...annotationSelection,
                [currentHighlight]: 0,
              })
            }
          >
            reannotate
          </Button>
        </Card>
      ) : (
        <div>
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <span>
                {
                  annotations[currentHighlight][
                    annotationSelection[currentHighlight]
                  ].acronym
                }
              </span>
              <div>
                {annotations[currentHighlight].length > 1 ? (
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => updateOpenOntologyModal(true)}
                  >
                    change
                  </Button>
                ) : null}{" "}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() =>
                    updateAnnotationSelection({
                      ...annotationSelection,
                      [currentHighlight]: -1,
                    })
                  }
                >
                  {"delete"}
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                {setDefinition(
                  annotations[currentHighlight][
                    annotationSelection[currentHighlight]
                  ].link
                )}
              </Card.Text>
            </Card.Body>
            {openOntologyModal ? (
              <OntologyModal
                term={currentHighlight}
                updateOpenOntologyModal={updateOpenOntologyModal}
                annotations={annotations}
                definitions={definitions}
                setDefinition={setDefinition}
                annotationSelection={annotationSelection}
                updateAnnotationSelection={updateAnnotationSelection}
                content={content}
              />
            ) : null}
            {openLookUpModal ? (
              <LookUp
                checkData={check}
                term={currentHighlight}
                updateOpenLookUpModal={updateOpenLookUpModal}
              />
            ) : null}
             
            {openPostModal ? (
              <AskQuestion
                word={getTermStr(currentHighlight, content)}
                ontology={
                  annotations[currentHighlight][
                    annotationSelection[currentHighlight]
                  ]
                }
                updateOpenPostModal={updateOpenPostModal}
                updateOpenLookUpModal={updateOpenLookUpModal}
                currentHighlight={currentHighlight}
                annotationSelection={annotationSelection}
                annotations={annotations}
                showExpert={showExpert}
                updateShowExpert={updateShowExpert}
                updateExpert={updateExpert}
                expert={expert}
              >
                
                </AskQuestion>

              
            ) : null}
            {personalize ? (
                    <Personalize updatePersonalize = {updatePersonalize} updateOpenPostModal={updateOpenPostModal} updateExpert={updateExpert} showExpert={showExpert} updateShowExpert={updateShowExpert} expert={expert} updateID={updateID} ID={ID}/> 
                  ) : null}
          </Card>
          <div className="text-center">
            <Container>
              <Row>
                <Col>
                  <Button
                    variant="link"
                    style={{ "box-shadow": "none", color: "red" }}
                    onClick={fetch_reply}
                    className="recommendation"
                  >
                    {console.log("check size", Object.keys(check).length)}
                    {/* {element.flag === "0" ? "New Recommendation" : ""} */}
                    {Object.keys(check).length > 0 ? "New Recommendation" : ""}
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="link"
                    style={{ "box-shadow": "none" }}
                    onClick= {(() => setMenu(true))}
                  >
                    Need Help?
                  </Button> 
                  {menu ? (
                 <ShowMenu setMenu={setMenu}/>
                      
                
            ) : null}
                  
  
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const OntologyModal = ({
  term,
  updateOpenOntologyModal,
  annotations,
  definitions,
  setDefinition,
  ontologyIdx,
  annotationSelection,
  updateAnnotationSelection,
  content,
}) => {
  const closeModal = () => updateOpenOntologyModal(false);
  const getDef = (url) => {
    return definitions[url] ? definitions[url] : "loading...";
  };

  useEffect(() => {
    for (const ontology of annotations[term]) {
      $(`.modal-toggle-${ontology.acronym}`).click(() =>
        setDefinition(ontology.link)
      );
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
          {annotations[term].map((ontology, idx) => (
            <Card>
              <Accordion.Toggle
                as={Card.Header}
                eventKey={`${term}-modal-${idx}`}
                className={`d-flex justify-content-between ${ontology.from}-${ontology.to}-${ontology.acronym} modal-toggle-${ontology.acronym}`}
              >
                <span>{ontology.acronym}</span>
                {ontologyIdx != idx ? (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      updateAnnotationSelection({
                        ...annotationSelection,
                        [term]: idx,
                      });
                      updateOpenOntologyModal(false);
                    }}
                  >
                    select
                  </Button>
                ) : null}
              </Accordion.Toggle>
              <Accordion.Collapse
                eventKey={`${term}-modal-${idx}`}
                className={`p-2 p-0 accordion-card`}
              >
                <Card>
                  <Card.Body>
                    <Card.Text>{getDef(ontology.link)}</Card.Text>
                  </Card.Body>
                </Card>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SidebarAccordion;
