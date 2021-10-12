import React from 'react';
import {Card, Button, Modal, Row, Form, Col} from 'react-bootstrap';


const NewPost = ({word, ontology, updateOpenPostModal}) => {
  const closeModal = () => updateOpenPostModal(false);
  return (
    <Modal
      show={true}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onHide={closeModal}>
        <Modal.Title id="contained-modal-title-vcenter">
          {'Ask a Question'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {/*
      <Row>
        <FloatingLabel controlId="" label="Terminology">
          <Form.Select aria-label="">
            <option>{word}</option>
          </Form.Select>
        </FloatingLabel>
      </Row>
      <Row>
        <FloatingLabel controlId="" label="Ask to:">
          <Form.Select aria-label="">
            <option>Everyone</option>
          </Form.Select>
        </FloatingLabel>
      </Row>
      <Row>
        <FloatingLabel controlId="" label="Question">
          <Form.Select aria-label="">
            <option>Which ontology should be used?</option>
            <option>Is this ontology best describe this term?</option>
          </Form.Select>
        </FloatingLabel>
      </Row>
        <Button onClick={closeModal}>Submit</Button>
        */}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
};

export default NewPost;
