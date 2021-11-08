import React,{useState} from 'react';
import {Card, Button, Modal, Row, Form, Col, Accordion, FormControl, Dropdown} from 'react-bootstrap';
import {createPost} from '../hooks/documentAPI';


const AskQuestion = ({word, ontology, updateOpenPostModal, currentHighlight, annotationSelection, annotations}) => {

  const context = "Omnis nihil blanditiis autem numquam autem sit.";
  const [question, updateQuestion] = useState(0);
  const questions = [
    "Which ontology should I use?",
    "Does this ontology best describe this terminology?"
  ];

  const [questionOntology, updateQuestionOntology] = useState(annotationSelection[currentHighlight]);

  const acronyms = annotations[currentHighlight].reduce((ontologies, ontology) => ontologies.concat(ontology.acronym), []);

  const closeModal = () => updateOpenPostModal(false);

  const submit = () => {
    createPost('1', word, questions[question], context, acronyms[questionOntology], data => {
      if (data['post_id']) {
        console.log(data['post_id']);
        window.open('localhost:3001/post', '_blank')
      } else console.log(data['message']);
    });
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
          {'Ask Question'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5">

        <Form>
        <Row className="mb-1">
          <Form.Group as={Col} controlId="term">
            <Form.Label>Terminology</Form.Label>
            <Form.Control type="text" value={word} disabled />
          </Form.Group>
          <Form.Group as={Col} controlId="term">
            <Form.Label>Context</Form.Label>
            <Form.Control type="text" value={context} disabled />
          </Form.Group>
        </Row>
        <Row className="mb-1">
        <Form.Group as={Col} controlId="exampleForm.SelectCustomSizeLg">
  <Form.Label>What do you need help with?</Form.Label>
  <Form.Control as="select" size="md" value={question} onChange={evt => updateQuestion(evt.target.value)} custom>
    {questions.map((question, index) => <option value={index}>{question}</option>)}
  </Form.Control>
</Form.Group>
        </Row>
        {question == 1 ?
        <Row className="mb-1">
        <Form.Group as={Col} controlId="exampleForm.SelectCustomSizeLg">
          <Form.Label>Select Ontology</Form.Label>
          <Form.Control as="select" size="md" value={questionOntology} onChange={evt => updateQuestionOntology(evt.target.value)} custom>
            {acronyms.map((acronym, idx) => <option value={idx}>{acronym}</option>)}
          </Form.Control>
        </Form.Group>
        </Row> : null }
        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button onClick={closeModal} variant="secondary">Close</Button>
    <Button variant="primary" onClick={() => submit()}>Submit</Button>
      </Modal.Footer>
    </Modal>
  )
};

export default AskQuestion;
