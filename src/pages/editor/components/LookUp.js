import React, { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Row,
  Form,
  Col,
  Accordion,
  FormControl,
  Container,
} from "react-bootstrap";
import { recommendationFlag} from "../hooks/editor/documentAPI";
//import EditorHelper from "./components/editorsHelper";

import { useParams } from "react-router-dom";




const LookUp = ({ checkData, term,updateOpenLookUpModal }) => {
  const { documentId } = useParams();
  // const documentId = '2';
  console.log("docid", documentId);
  const [flag, setFlag] = useState("");
  //const [calleditor, setEditor] = useState(false);
  const [timeoutId, updateTimeoutId] = useState(0);
  const closeModal = () => {updateOpenLookUpModal(false);}
  const askQuestion = () => {
    closeModal();
    //updateOpenPostModal(true);
  };

  //Accept recommendation
  const acceptRecommendation = (post_reply_id,acronym,onto_link) => {
    setFlag([]);
    const divider = term.indexOf('-');
    const from = Number(term.substring(0, divider))-1;
    const to = Number(term.substring(divider+1, term.length));
    console.log("while accpet",from, 'asim',to);
    clearTimeout(timeoutId);
    updateTimeoutId(
      setTimeout(() => recommendationFlag(documentId,post_reply_id,from,to,acronym,onto_link,"1",setFlag), 1000)
    );
    alert("Accepted");
    closeModal();
    
  };
//reject recommendation
  const rejectRecommendation = (post_reply_id) => {
    setFlag([]);
    const divider = term.indexOf('-');
    const from = Number(term.substring(0, divider))-1;
    const to = Number(term.substring(divider+1, term.length));
    clearTimeout(timeoutId);
    updateTimeoutId(
      setTimeout(() => recommendationFlag(documentId,post_reply_id,from,to,"","", "-1",setFlag), 1000)
    );

    alert("rejected");
    closeModal();
  };

  console.log("check data", checkData);

  return (
    <>
    <Modal
      show={true}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onHide={closeModal}>
        <Modal.Title id="contained-modal-title-vcenter">
          Recommendations
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Accordion defaultActiveKey={`${"1"}-modal-0`} id="sidebar-accordion">
          <FormControl
            type="search"
            placeholder="Search"
            className="mr-2 mb-3"
            aria-label="Search"
          />
          {checkData.map((element, index) => {
            return (
              <Card>
                <Accordion.Toggle
                  as={Card.Header}
                  eventKey={`${index}-modal-0`}
                  className={`d-flex justify-content-between modal-toggle-`}
                >
                  <span>{element.terminology}</span>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={()=>acceptRecommendation(element.post_reply_id,element.ontology,element.onto_link)
                      }
                    >
                      Accept
                    </Button>{" "}
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() =>rejectRecommendation(element.post_reply_id)
                      }
                    >
                      Reject
                    </Button>
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse
                  eventKey={`${index}-modal-0`}
                  className={`p-2 p-0 accordion-card`}
                >
                  <Container>
                    <Row>
                      <Col
                        style={{
                          fontWeight: "bold",
                          color: "green",
                          fontSize: 16,
                        }}
                      >
                        Expert Confidence Level:
                      </Col>
                    </Row>
                    <Row>
                      <Col>{element.confidence_score}%</Col>
                    </Row>
                    <Row>
                      <Col
                        style={{
                          fontWeight: "bold",
                          color: "green",
                          fontSize: 16,
                        }}
                      >
                        Recommended Ontology:
                      </Col>
                    </Row>
                    <Row>
                      <Col>{element.ontology}</Col>
                    </Row>
                    <Row>
                      <Col
                        style={{
                          fontWeight: "bold",
                          color: "green",
                          fontSize: 16,
                        }}
                      >
                        <a
                          href={
                            element.ontology_link +
                            "?apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f"
                          }
                          target={"_blank"}
                        >
                          Ontology Link:
                        </a>
                      </Col>
                    </Row>
                    {/* <Row>
                      <Col>{element.ontology_link}</Col>
                    </Row> */}
                    <Row>
                      <Col
                        style={{
                          fontWeight: "bold",
                          color: "green",
                          fontSize: 16,
                        }}
                      >
                        Expert Reponse:
                      </Col>
                    </Row>
                    <Row>
                      <Col>{element.reply_content}</Col>
                    </Row>
                  </Container>
                </Accordion.Collapse>
              </Card>
            );
          })}
        </Accordion>
        {/* <div className="text-right"><Button variant="link" style={{'box-shadow': 'none'}} onClick={() => askQuestion()}>{'Ask question'}</Button></div> */}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeModal}>Close</Button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default LookUp;
