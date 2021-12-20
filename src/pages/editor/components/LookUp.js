import React from 'react';
import {Card, Button, Modal, Row, Form, Col, Accordion, FormControl} from 'react-bootstrap';


const LookUp = ({word, ontology, updateOpenPostModal, updateOpenLookUpModal}) => {
  const closeModal = () => updateOpenLookUpModal(false);
  const askQuestion = () => {
    closeModal();
    updateOpenPostModal(true);
  };

  return (
    <Modal
      show={true}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onHide={closeModal}>
        <Modal.Title id="contained-modal-title-vcenter">
          {word}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Accordion defaultActiveKey={`${word}-modal-0`} id="sidebar-accordion">
        <FormControl
          type="search"
          placeholder="Search"
          className="mr-2 mb-3"
          aria-label="Search"
        />
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey={`${word}-modal-0`} className={`d-flex justify-content-between modal-toggle-`}>
            <span>{'NCIT'}</span>
            <div>
              <Button variant="outline-primary" size="sm" onClick={() => {}}>select</Button>{' '}
              <Button variant="outline-info" size="sm" onClick={() => {}}>open</Button>
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={`${word}-modal-0`} className={`p-2 p-0 accordion-card`}>
            <Card>
              <Card.Body>
                <Card.Text>
                  {'Omnis nihil blanditiis autem numquam autem sit. Quia earum rerum id at. Omnis tempora ea vitae ut corrupti sequi ut. Dignissimos accusamus et in. Nemo perferendis quam quis aut qui consequatur amet. Autem adipisci laboriosam totam et.'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey={`${word}-modal-1`} className={`d-flex justify-content-between modal-toggle-`}>
            <span>{'OMIT'}</span>
            <div>
              <Button variant="outline-primary" size="sm" onClick={() => {}}>select</Button>{' '}
              <Button variant="outline-info" size="sm" onClick={() => {}}>open</Button>
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={`${word}-modal-1`} className={`p-2 p-0 accordion-card`}>
            <Card>
              <Card.Body>
                <Card.Text>
                  {'Omnis nihil blanditiis autem numquam autem sit. Quia earum rerum id at. Omnis tempora ea vitae ut corrupti sequi ut. Dignissimos accusamus et in. Nemo perferendis quam quis aut qui consequatur amet. Autem adipisci laboriosam totam et.'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey={`${word}-modal-2`} className={`d-flex justify-content-between modal-toggle-`}>
            <span>{'MELO'}</span>
            <div>
              <Button variant="outline-primary" size="sm" onClick={() => {}}>select</Button>{' '}
              <Button variant="outline-info" size="sm" onClick={() => {}}>open</Button>
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={`${word}-modal-2`} className={`p-2 p-0 accordion-card`}>
            <Card>
              <Card.Body>
                <Card.Text>
                  {'Omnis nihil blanditiis autem numquam autem sit. Quia earum rerum id at. Omnis tempora ea vitae ut corrupti sequi ut. Dignissimos accusamus et in. Nemo perferendis quam quis aut qui consequatur amet. Autem adipisci laboriosam totam et.'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <div className="text-right"><Button variant="link" style={{'box-shadow': 'none'}} onClick={() => askQuestion()}>{'Ask question'}</Button></div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
};

export default LookUp;
